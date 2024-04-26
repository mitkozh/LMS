package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.repository.FineRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class FineService {

    private final FineRepository fineRepository;

    public Double fineCollectedThroughoutTheYear() {
        LocalDateTime startOfYear = LocalDateTime.now().withDayOfYear(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        return fineRepository.sumAmountByPaymentDateAfter(startOfYear);
    }
}
