package bg.acs.acs_lms_backend_resource.model.entity;

import bg.acs.acs_lms_backend_resource.model.enums.BackupsOptions;
import bg.acs.acs_lms_backend_resource.model.enums.CurrencyCode;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "environment")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Environment extends BaseEntity {


    private BigDecimal fineRatePerDay;

    @Enumerated(EnumType.STRING)
    private CurrencyCode currencyCode;

    @Enumerated(EnumType.STRING)
    private BackupsOptions backupsOptions;

    private int maxCheckoutDurationDays;

    private int maxBooksPerUser;


}
