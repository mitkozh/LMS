//package bg.acs.acs_lms_backend_resource.filter;
//
//import bg.acs.acs_lms_backend_resource.model.entity.User;
//import bg.acs.acs_lms_backend_resource.repository.UserRepository;
//import bg.acs.acs_lms_backend_resource.util.KeycloakJwtAuthenticationConverter;
//import jakarta.servlet.*;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.security.oauth2.core.oidc.StandardClaimNames;
//import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//import java.util.Optional;
//import java.util.UUID;
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
//public class UserRegistrationFilter extends OncePerRequestFilter {
//
//    private final UserRepository userRepo;
//
//    private final KeycloakJwtAuthenticationConverter keycloakJwtAuthenticationConverter;
//
//
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
//                                    FilterChain filterChain) throws ServletException, IOException{
//        JwtAuthenticationToken token = (JwtAuthenticationToken) request.getUserPrincipal();
//        String subject = token.getToken().getClaimAsString(StandardClaimNames.SUB);
//        String email = token.getToken().getClaimAsString(StandardClaimNames.EMAIL);
//
//
//        if (email != null && subject!=null) {
//            Optional<User> existing = userRepo.findByEmail(email);
//            if (existing.isEmpty()) {
//                User user = new User();
//                user.setId(UUID.fromString(subject));
//                user.setEmail(email);
//                userRepo.save(user);
//            }
//        }
//    }
//}