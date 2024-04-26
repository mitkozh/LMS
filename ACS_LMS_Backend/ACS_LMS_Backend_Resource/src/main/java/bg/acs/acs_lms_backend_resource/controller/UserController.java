package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.dto.MessageDto;
import bg.acs.acs_lms_backend_resource.model.dto.UserDto;
import bg.acs.acs_lms_backend_resource.model.dto.UserDtoWithoutPicture;
import bg.acs.acs_lms_backend_resource.model.entity.Environment;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import bg.acs.acs_lms_backend_resource.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.core.oidc.StandardClaimNames;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"${frontend_url}"})
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/save")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN', 'ROLE_STUDENT', 'ROLE_TEACHER', 'ROLE_ASSISTANT')")
    public ResponseEntity<MessageDto> saveUser(HttpServletRequest request, HttpServletResponse response) {
        JwtAuthenticationToken token = (JwtAuthenticationToken) request.getUserPrincipal();
        String email = token.getToken().getClaimAsString(StandardClaimNames.EMAIL);
        String subject = token.getToken().getClaimAsString(StandardClaimNames.SUB);
        if (email != null && subject != null) {
            User user = userService.saveUser(email, subject);
            if (user != null) {
                return ResponseEntity.ok(new MessageDto("User saved"));
            }
        }
        return ResponseEntity.badRequest().body(new MessageDto("Email or subject claim is missing in the token"));
    }


    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN', 'ROLE_STUDENT', 'ROLE_TEACHER', 'ROLE_ASSISTANT')")
    public ResponseEntity<Object> getCurrentUser() {
        UserDto currentUserDto = userService.getCurrentUserDto();
        if (currentUserDto!=null){
            return ResponseEntity.ok(currentUserDto);
        }
        return ResponseEntity.badRequest().body("No active user found!");
    }



    @GetMapping("/check-user-exists/{email}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<Boolean> checkUserExist(@PathVariable String email) {
        Boolean checkUserExists = userService.checkUserExists(email);
        return ResponseEntity.ok(checkUserExists);
    }


    @PutMapping("/{email}")
    public ResponseEntity<UserDto> updateUser(@PathVariable String email, @RequestBody UserDto userBody) {
        Optional<UserDto> updatedUser = userService.updateUser(email, userBody);
        return updatedUser.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    @GetMapping("/all")
    public Page<UserDtoWithoutPicture> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.getAllUsers(pageable);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    @PutMapping("/update-with-role")
    public ResponseEntity<?> updateUserWithRole(@RequestBody UserDto userDto) {

        Optional<UserDto> updatedUser = userService.updateUserWithRole(userDto);
        return updatedUser.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
