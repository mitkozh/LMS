package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.entity.User;
import bg.acs.acs_lms_backend_resource.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;


import java.util.Optional;
import java.util.UUID;


@Service
@AllArgsConstructor
public class UserService {

    private UserRepository userRepository;

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

    public Boolean checkUserExists(String email) {
        Optional<User> byEmail = userRepository.findByEmail(email);
        return byEmail.isPresent();
    }

    public Optional<User> findByEmail(String user) {
        return userRepository.findByEmail(user);
    }
}





