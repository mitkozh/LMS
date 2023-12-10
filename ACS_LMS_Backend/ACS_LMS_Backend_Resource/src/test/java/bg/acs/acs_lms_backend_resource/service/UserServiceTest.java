package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.entity.User;
import bg.acs.acs_lms_backend_resource.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    public void setUp() {
        user = new User();
        user.setEmail("user@example.com");
        user.setId(UUID.randomUUID());
    }

    @Test
    public void testSaveUser() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.saveUser("user@example.com", user.getId().toString());

        assertEquals("user@example.com", result.getEmail());
        assertEquals(user.getId(), result.getId());
        verify(userRepository, times(1)).findByEmail("user@example.com");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testGetCurrentUser() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", user.getId().toString())
                .claim("email", "user@example.com")
                .build();
        Authentication authentication = new JwtAuthenticationToken(jwt);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.getCurrentUser();

        assertEquals("user@example.com", result.getEmail());
        assertEquals(user.getId(), result.getId());
        verify(userRepository, times(1)).findByEmail("user@example.com");
        verify(userRepository, times(1)).save(any(User.class));
    }
}
