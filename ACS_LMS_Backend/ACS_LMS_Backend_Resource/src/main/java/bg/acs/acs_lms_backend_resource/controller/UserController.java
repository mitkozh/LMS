package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.dto.MessageDto;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import bg.acs.acs_lms_backend_resource.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.StandardClaimNames;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @PostMapping("/save")
    public ResponseEntity<MessageDto> saveUser(HttpServletRequest request, HttpServletResponse response) {
        JwtAuthenticationToken token = (JwtAuthenticationToken) request.getUserPrincipal();
        String email = token.getToken().getClaimAsString(StandardClaimNames.EMAIL);
        String subject = token.getToken().getClaimAsString(StandardClaimNames.SUB);
        if (email != null && subject != null) {
            Optional<User> existing = userRepository.findByEmail(email);
            if (existing.isEmpty()) {
                User user = new User();
                user.setId(UUID.fromString(subject));
                user.setEmail(email);
                userRepository.save(user);
                return ResponseEntity.ok(new MessageDto("User saved"));
            } else {
                return ResponseEntity.ok(new MessageDto("User already exists"));
            }
        } else {
            return ResponseEntity.badRequest().body(new MessageDto("Email or subject claim is missing in the token"));
        }
    }
}
