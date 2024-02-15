package bg.acs.acs_lms_backend_resource.config;


import bg.acs.acs_lms_backend_resource.model.dto.BookFullDto;
import bg.acs.acs_lms_backend_resource.model.dto.BookGoogleAPIDto;
import bg.acs.acs_lms_backend_resource.util.KeycloakJwtAuthenticationConverter;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.SessionFactory;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
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

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
    @Bean
    public ModelMapper modelMapper(){
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.createTypeMap(BookGoogleAPIDto.class, BookFullDto.class)
                .addMappings(mapper -> {
                    mapper.skip(BookFullDto::setCategories);
                });
        return modelMapper;

    }





}