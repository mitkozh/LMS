package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.ReservationDto;
import bg.acs.acs_lms_backend_resource.model.entity.BookCopy;
import bg.acs.acs_lms_backend_resource.model.entity.Reservation;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import bg.acs.acs_lms_backend_resource.repository.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.*;

import static org.hibernate.validator.internal.util.Contracts.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private ReservationService reservationService;

    private Reservation reservation;
    private ReservationDto reservationDto;
    private User user;
    private BookCopy bookCopy;

    @BeforeEach
    public void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("user@example.com");
        bookCopy = new BookCopy();
        bookCopy.setId(1L);
        reservation = new Reservation();
        reservation.setUser(user);
        reservation.setBookCopy(bookCopy);
        reservationDto = new ReservationDto();
        reservationDto.setUserEmail("user@example.com");
        reservationDto.setBookCopyId(1L);
    }

    @Test
    public void testGetReservationByUserAndBookCopy() {
        when(reservationRepository.getByUserAndBookCopy(user, bookCopy)).thenReturn(reservation);
        when(modelMapper.map(reservation, ReservationDto.class)).thenReturn(reservationDto);

        Optional<ReservationDto> result = reservationService.getReservationByUserAndBookCopy(bookCopy, user);

        assertTrue(result.isPresent(), "Expected non-empty Optional, but was empty");
        assertEquals("user@example.com", result.get().getUserEmail());
        assertEquals(1L, result.get().getBookCopyId());
        verify(reservationRepository, times(1)).getByUserAndBookCopy(user, bookCopy);
    }


    @Test
    public void testSave() {
        when(reservationRepository.save(reservation)).thenReturn(reservation);

        Reservation result = reservationService.save(reservation);

        assertEquals(user, result.getUser());
        assertEquals(bookCopy, result.getBookCopy());
        verify(reservationRepository, times(1)).save(reservation);
    }

    @Test
    public void testGetReservationByUser() {
        when(reservationRepository.getAllByUser(user)).thenReturn(Collections.singletonList(reservation));
        when(modelMapper.map(reservation, ReservationDto.class)).thenReturn(reservationDto);

        List<ReservationDto> result = reservationService.getReservationByUser(user);

        assertEquals(1, result.size());
        assertEquals("user@example.com", result.get(0).getUserEmail());
        assertEquals(1L, result.get(0).getBookCopyId());
        verify(reservationRepository, times(1)).getAllByUser(user);
    }
}
