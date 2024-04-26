package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.UserDto;
import bg.acs.acs_lms_backend_resource.model.dto.UserDtoWithoutPicture;
import bg.acs.acs_lms_backend_resource.model.entity.Image;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import bg.acs.acs_lms_backend_resource.repository.UserRepository;
import bg.acs.acs_lms_backend_resource.util.PageUtils;
import lombok.AllArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.info.ServerInfoRepresentation;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;


import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class UserService {
    private UserRepository userRepository;

    private ModelMapper modelMapper;


    private static final Keycloak keycloak = KeycloakBuilder.builder()
            .serverUrl("http://localhost:9080")
            .realm("master")
            .clientId("admin-cli")
            .username("admin")
            .password("admin")
            .build();
    private final ImageService imageService;

    public User saveUser(String email, String subject) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isEmpty()) {
            User user = new User();
            user.setId(UUID.fromString(subject));
            user.setEmail(email);
            return userRepository.save(user);
        }
        else {
            return existing.get();
        }
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuthenticationToken) {
            String email = (String) jwtAuthenticationToken.getToken().getClaims().get("email");
            String subject = (String) jwtAuthenticationToken.getToken().getClaims().get("sub");
            return saveUser(email, subject);
        }
        else {
            return null;
        }
    }

    public UserDto getCurrentUserDto() {
        User currentUser = getCurrentUser();
        if (currentUser != null) {
            return mapUserToUserDto(currentUser);
        }
        return null;
    }




    private UserDto mapUserToUserDto(User user){
        UserDto userDto = modelMapper.map(user, UserDto.class);
        if (user.getProfilePic() != null) {
            userDto.setPictureId(user.getProfilePic().getId());
        }
        RoleRepresentation firstRoleStartingWithRole = getFirstRoleStartingWithRole(user.getEmail());
        if (firstRoleStartingWithRole!=null){
            userDto.setRole(firstRoleStartingWithRole.getName());
        }

        return userDto;
    }

    public Optional<UserDto> updateUserWithRole(UserDto userBody) {
        Optional<User> existing = userRepository.findByEmail(userBody.getEmail());
        if (existing.isPresent()) {
            User user = existing.get();




            return getUserDto(userBody, user);
        }
        return Optional.empty();
    }

    private Optional<UserDto> getUserDto(UserDto userBody, User user) {
        if (userBody.getGender()!=null && userBody.getGender()!=user.getGender()){
            user.setGender(userBody.getGender());
        }

        RoleRepresentation firstRoleStartingWithRole = getFirstRoleStartingWithRole(user.getEmail());
        if (userBody.getRole()!=null){
            updateUserRoleInKeycloak(userBody.getEmail(), firstRoleStartingWithRole.getName(), userBody.getRole());
        }

        if ((user.getName()!=null && !user.getName().equals(userBody.getName())) || (user.getName()==null &&userBody.getName()!=null)) {
            user.setName(userBody.getName());
        }
        if (userBody.getPictureId() != null && userBody.getPictureId() != -1) {
            Image image = imageService.getImage(userBody.getPictureId());
            user.setProfilePic(image);
        }

        User save = userRepository.save(user);
        return Optional.of(mapUserToUserDto(save));
    }


    private void updateUserRoleInKeycloak(String email, String currentRole, String newRole) {
        UserRepresentation user = getUserFromKeycloak(email);
        String userId;
        if (user != null) {
            userId = user.getId();
        } else {
            userId = null;
        }

        RoleRepresentation currentRoleRepresentation = keycloak.realm("ACS_TEST").roles().get(currentRole).toRepresentation();
        RoleRepresentation newRoleRepresentation = keycloak.realm("ACS_TEST").roles().get(newRole).toRepresentation();

        List<RoleRepresentation> existingRoles = keycloak.realm("ACS_TEST").users().get(userId).roles().realmLevel().listEffective();

        existingRoles.stream()
                .filter(role -> role.getName().equals(currentRoleRepresentation.getName()))
                .findFirst()
                .ifPresent(roleToRemove -> keycloak.realm("ACS_TEST").users().get(userId).roles().realmLevel().remove(Collections.singletonList(roleToRemove)));

        keycloak.realm("ACS_TEST").users().get(userId).roles().realmLevel().add(Collections.singletonList(newRoleRepresentation));
    }

    private UserRepresentation getUserFromKeycloak(String email) {
        List<UserRepresentation> users = keycloak.realm("ACS_TEST").users().searchByEmail(email, true);
        if (!users.isEmpty()){
            return users.get(0);
        }
        else return null;
    }


    public Page<UserDtoWithoutPicture> getAllUsers(Pageable pageable) {
        List<String> roles = getUserRolesFromKeycloak();

        List<UserRepresentation> usersFromKeycloak = getAllUsersFromKeycloak();

        if (roles.contains("ROLE_LIBRARIAN")) {
            usersFromKeycloak.removeIf(this::hasLibrarianOrAdminRole);
        } else if (roles.contains("ROLE_ADMIN")) {
            String currentUserId = getCurrentUserFromKeycloak().getId();
            usersFromKeycloak.removeIf(user -> user.getId().equals(currentUserId));
        }
        return PageUtils.convertListToPage(usersFromKeycloak, pageable).map(this::mapUserRepresentationToUserDtoWithoutPicture);
    }

    private boolean hasLibrarianOrAdminRole(UserRepresentation user) {
        List<String> userRoles = user.getRealmRoles();
        return userRoles.contains("ROLE_LIBRARIAN") || userRoles.contains("ROLE_ADMIN");
    }


    public UserDtoWithoutPicture mapUserRepresentationToUserDtoWithoutPicture(UserRepresentation user) {
        Optional<User> byEmail = userRepository.findByEmail(user.getEmail());
        UserDtoWithoutPicture userDtoWithoutPicture = byEmail.map(this::mapUserToUserDtoWithoutPicture).orElse(null);
//        if (userDtoWithoutPicture != null) {
//            userDtoWithoutPicture.setRole(user.getRealmRoles().stream().filter((r) -> r.startsWith("ROLE_")).findFirst().orElse(null));
//        }
        return userDtoWithoutPicture;

    }



    private UserDtoWithoutPicture mapUserToUserDtoWithoutPicture(User user){
        UserDtoWithoutPicture map = modelMapper.map(user, UserDtoWithoutPicture.class);
        RoleRepresentation role = getFirstRoleStartingWithRole(user.getEmail());
        if (role != null) {
            map.setRole(role.getName());
        }
        return map;
    }

    public Boolean checkUserExists(String email) {
        Optional<User> byEmail = userRepository.findByEmail(email);
        return byEmail.isPresent();
    }

    public Optional<User> findByEmail(String user) {
        return userRepository.findByEmail(user);
    }


    public List<String> getUserRolesFromKeycloak() {
        String email = getCurrentUserDto().getEmail();
        UserRepresentation user = keycloak.realm("ACS_TEST").users().searchByEmail(email, true).get(0);
        return keycloak.realm("ACS_TEST").users().get(user.getId()).roles().realmLevel().listEffective()
                .stream()
                .map(RoleRepresentation::getName)
                .collect(Collectors.toList());
    }

    public List<UserRepresentation> getAllUsersFromKeycloak() {
        return keycloak.realm("ACS_TEST").users().list();
    }







    public UserRepresentation getCurrentUserFromKeycloak() {
        String email = getCurrentUser().getEmail();
        return keycloak.realm("ACS_TEST").users().searchByEmail(email, true).get(0);
    }



    public RoleRepresentation getFirstRoleStartingWithRole(String email) {
        Keycloak keycloak = KeycloakBuilder.builder()
                .serverUrl("http://localhost:9080")
                .realm("master")
                .clientId("admin-cli")
                .username("admin")
                .password("admin")
                .build();

        try {
            ServerInfoRepresentation serverInfo = keycloak.serverInfo().getInfo();
            System.out.println("Connected to Keycloak server. Version: " + serverInfo.getSystemInfo().getVersion());
        } catch (Exception e) {
            System.out.println("Failed to connect to Keycloak server.");
            e.printStackTrace();
            return null;
        }


        List<UserRepresentation> users = keycloak.realm("ACS_TEST").users().searchByEmail(email, true);

        if (users.isEmpty()) {
            throw new IllegalArgumentException("No user found with email: " + email);
        }

        UserRepresentation user = users.get(0);

        List<RoleRepresentation> roles = keycloak.realm("ACS_TEST").users().get(user.getId()).roles().realmLevel().listEffective();

        for (RoleRepresentation role : roles) {
            if (role.getName().startsWith("ROLE_")) {
                return role;
            }
        }

        return null;
    }




    public Optional<UserDto> updateUser(String email, UserDto userBody){
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            User user = existing.get();
            return getUserDto(userBody, user);
        }
        return Optional.empty();
    }



}





