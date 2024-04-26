package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {

    @Query("SELECT SUM(f.amount) FROM Fine f WHERE f.paymentDate > :paymentDate")
    Double sumAmountByPaymentDateAfter(@Param("paymentDate") LocalDateTime paymentDate);



}
