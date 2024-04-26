package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.entity.Environment;
import bg.acs.acs_lms_backend_resource.repository.EnvironmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EnvironmentService {

    private final EnvironmentRepository environmentRepository;


    @Cacheable("environment")

    public Environment getEnvironment() {
        return environmentRepository.findAll().stream().findFirst().orElse(null);
    }

    @CacheEvict(value = "environment", allEntries = true)

    public Environment updateEnvironment(Environment environment) {
        Optional<Environment> existingEnvironment = environmentRepository.findAll().stream().findFirst();
        if (existingEnvironment.isPresent()) {
            Environment updatedEnvironment = existingEnvironment.get();
            updatedEnvironment.setFineRatePerDay(environment.getFineRatePerDay());
            updatedEnvironment.setCurrencyCode(environment.getCurrencyCode());
            updatedEnvironment.setBackupsOptions(environment.getBackupsOptions());
            updatedEnvironment.setMaxCheckoutDurationDays(environment.getMaxCheckoutDurationDays());
            updatedEnvironment.setMaxBooksPerUser(environment.getMaxBooksPerUser());
            return environmentRepository.save(updatedEnvironment);
        } else {
            return environmentRepository.save(environment);
        }
    }
}
