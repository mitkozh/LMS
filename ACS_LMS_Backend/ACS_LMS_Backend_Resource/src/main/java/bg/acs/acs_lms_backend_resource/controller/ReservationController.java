package bg.acs.acs_lms_backend_resource.controller;


import bg.acs.acs_lms_backend_resource.model.dto.CategoryWithBooksDto;
import bg.acs.acs_lms_backend_resource.model.dto.ReservationDto;
import bg.acs.acs_lms_backend_resource.model.entity.Reservation;
import bg.acs.acs_lms_backend_resource.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = {"${frontend_url}"})
@RequiredArgsConstructor
@RequestMapping("/reservations")
public class ReservationController {
    private final ReservationService reservationService;

    @GetMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<List<ReservationDto>> getReservations() {
        return ResponseEntity.ok(reservationService.getAllActiveReservations());
    }

    @GetMapping("/books-reserved-last-week")
    public ResponseEntity<Long> getBooksReservedLastWeek() {
        long reservedLastWeek = reservationService.booksReservedLastWeek();
        return new ResponseEntity<>(reservedLastWeek, HttpStatus.OK);
    }

}
