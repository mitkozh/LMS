package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.entity.BookCopy;
import bg.acs.acs_lms_backend_resource.model.entity.Reservation;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    void deleteByReservationDateBefore(LocalDateTime time);
    Reservation getByUserAndBookCopy(User user, BookCopy bookCopy);

    List<Reservation> getAllByUser(User user);

    List<Reservation> findByDueDateBefore(LocalDateTime now);

    List<Reservation> findAllByDueDateAfterAndCancelledIsFalseAndActivatedIsFalse(LocalDateTime now);

    Set<Reservation> findByBookCopyIdAndCancelledFalseAndDueDateAfterAndActivatedFalse(Long id, LocalDateTime currentDateTime);

    Reservation getByUserAndBookCopyAndCancelledFalseAndActivatedFalseAndDueDateAfter(User user, BookCopy bookCopy, LocalDateTime localDateTime);
}

