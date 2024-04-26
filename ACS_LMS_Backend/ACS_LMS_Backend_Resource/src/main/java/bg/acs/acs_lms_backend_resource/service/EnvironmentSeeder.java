package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.entity.Environment;
import bg.acs.acs_lms_backend_resource.model.enums.BackupsOptions;
import bg.acs.acs_lms_backend_resource.model.enums.CurrencyCode;
import bg.acs.acs_lms_backend_resource.repository.EnvironmentRepository;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@AllArgsConstructor
public class EnvironmentSeeder {

    private EnvironmentRepository environmentRepository;

    @PostConstruct
    public void seedEnvironmentTable() {
        if (environmentRepository.count() == 0) {
            Environment environment = Environment.builder()
                    .fineRatePerDay(new BigDecimal("0.50"))
                    .currencyCode(CurrencyCode.BGN)
                    .backupsOptions(BackupsOptions.DAILY)
                    .maxCheckoutDurationDays(14)
                    .maxBooksPerUser(5)
                    .build();
            environmentRepository.save(environment);
        }
    }
}
