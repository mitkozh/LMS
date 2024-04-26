package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.CheckoutAddDto;
import bg.acs.acs_lms_backend_resource.model.dto.CheckoutDto;
import bg.acs.acs_lms_backend_resource.model.dto.CheckoutWithFineDto;
import bg.acs.acs_lms_backend_resource.model.entity.*;
import bg.acs.acs_lms_backend_resource.repository.CheckoutRepository;
import bg.acs.acs_lms_backend_resource.repository.ReservationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CheckoutService {
    private final CheckoutRepository checkoutRepository;
    private final UserService userService;
    private final BookService bookService;
    private final ModelMapper modelMapper;


    private EnvironmentService environmentService;
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
        Checkout checkout = checkoutRepository.findByBorrowerAndReturnedFalseAndEndTimeIsNullAndBookCopy_Book(user, book);
        return checkout!=null;
    }

    public List<CheckoutDto> getAllActiveCheckoutsForCurrentUser() {
        User user = userService.getCurrentUser();
        List<Checkout> checkouts = checkoutRepository.findAllByBorrowerAndReturnedFalseAndEndTimeNull(user);
        return checkouts.stream()
                .map(checkout -> modelMapper.map(checkout, CheckoutDto.class))
                .collect(Collectors.toList());
    }

    public Page<CheckoutWithFineDto> getAllActiveCheckouts(Pageable pageable) {
        Page<Checkout> checkouts = checkoutRepository.findAllByReturnedFalseAndEndTimeNull(pageable);
        return checkouts.map(this::mapCheckoutToCheckoutWithFineDto);
    }


    private CheckoutWithFineDto mapCheckoutToCheckoutWithFineDto(Checkout checkout){
        CheckoutWithFineDto map = modelMapper.map(checkout, CheckoutWithFineDto.class);
        map.setId(checkout.getId());
        long between = ChronoUnit.DAYS.between(LocalDate.now(), checkout.getHoldEndTime());
        map.setLate(LocalDate.now().isAfter(checkout.getHoldEndTime().toLocalDate()));
        if (map.isLate()){
            map.setFineAmount(environmentService.getEnvironment().getFineRatePerDay().multiply(BigDecimal.valueOf(between)).doubleValue());
        }
        map.setBookName(checkout.getBookCopy().getBook().getTitle());
        map.setUserEmail(checkout.getBorrower().getEmail());
        return map;

    }
    public CheckoutDto returnBook(Long id) {
        Checkout checkout = checkoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Checkout not found with id " + id));
        checkout.setEndTime(LocalDateTime.now());
        checkout.setReturned(true);
        Checkout save = checkoutRepository.save(checkout);
        return modelMapper.map(save, CheckoutDto.class);
    }


    public long booksCheckedOutLastWeek() {
        LocalDateTime lastWeek = LocalDateTime.now().minus(1, ChronoUnit.WEEKS);
        return checkoutRepository.countByStartTimeAfter(lastWeek);
    }


    public Map<String, Map<String, Long>> booksRentingVsBookCheckingOutDiagram(LocalDate startDate, LocalDate endDate) {
        Map<String, Map<String, Long>> data = new HashMap<>();
        data.put("Checkouts", new HashMap<>());
        data.put("Reservations", new HashMap<>());

        List<Object[]> checkoutsPerDay = checkoutRepository.countCheckoutsPerDay(startDate.atStartOfDay(), endDate.atStartOfDay());
        for (Object[] result : checkoutsPerDay) {
            LocalDate date = ((Date) result[0]).toLocalDate();
            Long count = (Long) result[1];
            data.get("Checkouts").put(date.toString(), count);
        }

        List<Object[]> reservationsPerDay = reservationRepository.countReservationsPerDay(startDate.atStartOfDay(), endDate.atStartOfDay());
        for (Object[] result : reservationsPerDay) {
            LocalDate date = ((Date) result[0]).toLocalDate();
            Long count = (Long) result[1];
            data.get("Reservations").put(date.toString(), count);
        }

        return data;
    }



    public Map<String, Long> countOverduePerDay(LocalDate startDate, LocalDate endDate) {
        Map<String, Long> overdueCountPerDay = new HashMap<>();

        List<Object[]> overdueData = checkoutRepository.countOverduePerDay(startDate.atStartOfDay(), endDate.atStartOfDay());

        for (Object[] data : overdueData) {
            LocalDate date = ((Date) data[0]).toLocalDate();
            Long count = (Long) data[1];
            overdueCountPerDay.put(date.toString(), count);
        }

        return overdueCountPerDay;
    }





}

