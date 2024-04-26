package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.entity.Book;
import bg.acs.acs_lms_backend_resource.model.entity.Checkout;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Set<Checkout> findByBookCopyIdAndReturnedFalse(Long id);

    Checkout findByBorrowerAndReturnedFalseAndEndTimeIsNullAndBookCopy_Book(User user, Book book);

    List<Checkout> findAllByBorrowerAndReturnedFalseAndEndTimeNull(User user);

    Page<Checkout> findAllByReturnedFalseAndEndTimeNull(Pageable pageable);

    long countByStartTimeAfter(LocalDateTime lastWeek);

    long countByEndTimeAfterAndReturnedTrue(LocalDateTime lastWeek);


    @Query("SELECT DATE(c.endTime), COUNT(c) FROM Checkout c WHERE c.endTime BETWEEN :startDate AND :endDate GROUP BY DATE(c.endTime)")
    List<Object[]> countCheckoutsPerDay(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT DATE(c.endTime), COUNT(c) FROM Checkout c WHERE c.endTime BETWEEN :startDate AND :endDate AND c.returned = false GROUP BY DATE(c.endTime)")
    List<Object[]> countOverduePerDay(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    long countByEndTimeBeforeAndReturnedFalse(LocalDateTime now);
}
