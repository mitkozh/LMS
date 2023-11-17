package bg.acs.acs_lms_backend_resource.util;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.Assert;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class KeycloakRealmRolesGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    private String authorityPrefix = "";

    public KeycloakRealmRolesGrantedAuthoritiesConverter() {
    }

    public KeycloakRealmRolesGrantedAuthoritiesConverter setAuthorityPrefix(String authorityPrefix) {
        Assert.notNull(authorityPrefix, "authorityPrefix cannot be null");
        this.authorityPrefix = authorityPrefix;
        return this;
    }

    /**
     * Get authorities from the {@code realm_access.roles} jwt claim
     *
     * @param source the source object to convert, which must be an instance of {@link Jwt} (never {@code null})
     * @return collection of {@link GrantedAuthority}
     */
    @Override
    public Collection<GrantedAuthority> convert(Jwt source) {
        Map<String, Object> realmAccess = source.getClaim("realm_access");
        if (Objects.isNull(realmAccess)) {
            return Collections.emptySet();
        }

        Object roles = realmAccess.get("roles");
        if (Objects.isNull(roles) || !Collection.class.isAssignableFrom(roles.getClass())) {
            return Collections.emptySet();
        }

        var rolesCollection = (Collection<?>) roles;

        return rolesCollection.stream()
                .filter(String.class::isInstance) // The realm_access.role is supposed to be a list of string, for good measure we double-check that
                .map(x -> new SimpleGrantedAuthority(((String) x)))
                .collect(Collectors.toSet());
    }

}