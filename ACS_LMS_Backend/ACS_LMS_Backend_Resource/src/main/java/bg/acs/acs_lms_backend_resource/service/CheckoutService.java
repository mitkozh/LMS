package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.CheckoutAddDto;
import bg.acs.acs_lms_backend_resource.model.dto.CheckoutDto;
import bg.acs.acs_lms_backend_resource.model.entity.*;
import bg.acs.acs_lms_backend_resource.repository.CheckoutRepository;
import bg.acs.acs_lms_backend_resource.repository.ReservationRepository;
import bg.acs.acs_lms_backend_resource.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@AllArgsConstructor
public class CheckoutService {
    private final CheckoutRepository checkoutRepository;
    private final UserService userService;
    private final BookService bookService;
    private final ModelMapper modelMapper;

    private ReservationRepository reservationRepository;

    @Transactional
    public CheckoutDto saveCheckout(CheckoutAddDto checkoutAddDto) {
        User user = userService.findByEmail(checkoutAddDto.getUser()).orElseThrow(EntityNotFoundException::new);
        BookCopy bookCopy;
        if (checkoutAddDto.getBookCopyId()!=null){
             bookCopy = bookService.findBookCopyById(checkoutAddDto.getBookCopyId()).orElseThrow(EntityNotFoundException::new);
        }
        else {
            Set<Long> freeBookCopiesByBookId = bookService.getFreeBookCopiesByBookId(checkoutAddDto.getBookId());
            if (!freeBookCopiesByBookId.isEmpty()){
                bookCopy =  bookService.findBookCopyById(freeBookCopiesByBookId.stream().toList().get(0)).orElseThrow(EntityNotFoundException::new);
            }
            else {
                throw new EntityNotFoundException();
            }

        }

        Checkout checkout = new Checkout();
        checkout.setStartTime(checkoutAddDto.getStartTime());
        checkout.setHoldEndTime(checkoutAddDto.getHoldEndTime());
        checkout.setBorrower(user);
        checkout.setBookCopy(bookCopy);
        checkout.setReturned(false);

        if (checkoutAddDto.getReservationId() != null) {
            Reservation reservation = reservationRepository.findById(checkoutAddDto.getReservationId()).orElseThrow(EntityNotFoundException::new);
            reservation.setActivated(true);
            Reservation save = reservationRepository.save(reservation);
            checkout.setReservation(save);
        }

        Checkout savedCheckout = checkoutRepository.save(checkout);

        CheckoutDto checkoutDto = modelMapper.map(savedCheckout, CheckoutDto.class);

        return checkoutDto;
    }

    public Boolean hasActiveCheckout(Long bookId) {
        User user = userService.getCurrentUser();
        Book book = bookService.findBookById(bookId).orElseThrow(EntityNotFoundException::new);
        Checkout checkout = checkoutRepository.findByBorrowerAndReturnedFalseAndAndEndTimeNullAndBookCopy_Book(user, book);
        return checkout!=null;
    }
}

