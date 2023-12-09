package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.entity.BookCopy;
import bg.acs.acs_lms_backend_resource.model.entity.Reservation;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    void deleteByReservationDateBefore(LocalDateTime time);
    Reservation getByUserAndBookCopy(User user, BookCopy bookCopy);

    List<Reservation> getAllByUser(User user);
}
