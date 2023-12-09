package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.ReservationDto;
import bg.acs.acs_lms_backend_resource.model.entity.BookCopy;
import bg.acs.acs_lms_backend_resource.model.entity.Reservation;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import bg.acs.acs_lms_backend_resource.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ModelMapper modelMapper;
    @Transactional
    @Scheduled(fixedRate = 86400000)
    public void deleteReservations() {
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        reservationRepository.deleteByReservationDateBefore(twentyFourHoursAgo);
    }

    public ReservationDto mapReservationToReservationDto(Reservation reservation){
        ReservationDto reservationDto = modelMapper.map(reservation, ReservationDto.class);
        reservationDto.setBookCopyId(reservation.getBookCopy().getId());
        reservationDto.setUserEmail(reservation.getUser().getEmail());
        return reservationDto;
    }


    public Optional<ReservationDto> getReservationByUserAndBookCopy(BookCopy bookCopy, User user) {
        Reservation reservation = reservationRepository.getByUserAndBookCopy(user, bookCopy);
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
}
