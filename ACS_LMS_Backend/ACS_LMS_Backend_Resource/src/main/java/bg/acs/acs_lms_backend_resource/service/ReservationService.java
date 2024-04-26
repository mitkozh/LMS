package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.ReservationDto;
import bg.acs.acs_lms_backend_resource.model.entity.Book;
import bg.acs.acs_lms_backend_resource.model.entity.BookCopy;
import bg.acs.acs_lms_backend_resource.model.entity.Reservation;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import bg.acs.acs_lms_backend_resource.repository.ReservationRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ModelMapper modelMapper;


    public ReservationDto mapReservationToReservationDto(Reservation reservation){
        ReservationDto reservationDto = modelMapper.map(reservation, ReservationDto.class);
        reservationDto.setBookCopyId(reservation.getBookCopy().getId());
        reservationDto.setUserEmail(reservation.getUser().getEmail());
        Book book = reservation.getBookCopy().getBook();
        reservationDto.setBookId(book.getId());
        reservationDto.setBookName(book.getTitle());
        return reservationDto;
    }


    public Optional<ReservationDto> getActiveReservationByUserAndBookCopy(BookCopy bookCopy, User user) {
        LocalDateTime now = LocalDateTime.now();
        Reservation reservation = reservationRepository.getByUserAndBookCopyAndCancelledFalseAndActivatedFalseAndDueDateAfter(user, bookCopy, now);
        if (reservation == null) {
            return Optional.empty();
        }
        return Optional.of(mapReservationToReservationDto(reservation));
    }


    public Reservation save(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public List<ReservationDto> getReservationByUser(User user) {
        return reservationRepository.getAllByUser(user).stream().map(this::mapReservationToReservationDto).collect(Collectors.toList());
    }





    public List<ReservationDto> getAllActiveReservations(){
        LocalDateTime now = LocalDateTime.now();
        return reservationRepository.findAllByDueDateAfterAndCancelledIsFalseAndActivatedIsFalse(now).stream()
                .map(this::mapReservationToReservationDto)
                .collect(Collectors.toList());
    }


    public long booksReservedLastWeek() {
        LocalDateTime lastWeek = LocalDateTime.now().minus(1, ChronoUnit.WEEKS);
        return reservationRepository.countByReservationDateAfter(lastWeek);
    }
}
