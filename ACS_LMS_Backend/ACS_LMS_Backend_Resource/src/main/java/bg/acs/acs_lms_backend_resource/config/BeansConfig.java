package bg.acs.acs_lms_backend_resource.config;


import bg.acs.acs_lms_backend_resource.util.KeycloakJwtAuthenticationConverter;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.net.URLDecoder;
import java.util.List;
import java.util.Set;

@Configuration
public class BeansConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration cors = new CorsConfiguration();
        cors.addAllowedHeader("*");
        cors.addAllowedMethod("*");
        cors.setAllowCredentials(true);
        cors.addAllowedOrigin("http://localhost:4200");
        source.registerCorsConfiguration("/**", cors);
        return source;
    }

    @Bean
    public KeycloakJwtAuthenticationConverter jwtAuthenticationConverter(){
        return new KeycloakJwtAuthenticationConverter();
    }
    //testt

    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }


}