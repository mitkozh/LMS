package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.dto.MessageDto;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import bg.acs.acs_lms_backend_resource.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.core.oidc.StandardClaimNames;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

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



    @GetMapping("/check-user-exists/{email}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<Boolean> checkUserExist(@PathVariable String email) {
        Boolean checkUserExists = userService.checkUserExists(email);
        return ResponseEntity.ok(checkUserExists);
    }



}
