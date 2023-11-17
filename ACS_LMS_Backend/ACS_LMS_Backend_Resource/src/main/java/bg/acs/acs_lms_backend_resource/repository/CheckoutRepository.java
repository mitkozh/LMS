package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
}
