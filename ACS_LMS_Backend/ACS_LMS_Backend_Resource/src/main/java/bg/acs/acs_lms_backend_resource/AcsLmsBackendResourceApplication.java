package bg.acs.acs_lms_backend_resource;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.HashSet;
import java.util.Set;


@SpringBootApplication
@RequiredArgsConstructor
@EnableCaching
@EnableScheduling

public class AcsLmsBackendResourceApplication  {

	public static void main(String[] args) {
		SpringApplication.run(AcsLmsBackendResourceApplication.class, args);
	}

}
