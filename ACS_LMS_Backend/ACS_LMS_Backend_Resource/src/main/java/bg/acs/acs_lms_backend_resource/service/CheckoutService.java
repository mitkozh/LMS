package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.repository.CheckoutRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CheckoutService {
    private final CheckoutRepository checkoutRepository;
}
