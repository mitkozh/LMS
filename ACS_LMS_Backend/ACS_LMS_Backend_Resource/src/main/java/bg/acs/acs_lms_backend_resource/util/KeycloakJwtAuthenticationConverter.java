package bg.acs.acs_lms_backend_resource.util;


import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

public class KeycloakJwtAuthenticationConverter extends JwtAuthenticationConverter {
    public static final String PRINCIPAL_CLAIM_NAME = "preferred_username";
    public static final String AUTHORITY_PREFIX = "ROLE_";

    public KeycloakJwtAuthenticationConverter() {
        var grantedAuthoritiesConverter = new KeycloakRealmRolesGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix(AUTHORITY_PREFIX);

        setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        setPrincipalClaimName(PRINCIPAL_CLAIM_NAME);
    }
}