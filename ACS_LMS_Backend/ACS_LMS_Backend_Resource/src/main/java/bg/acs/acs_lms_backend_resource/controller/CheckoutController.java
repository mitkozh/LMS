package bg.acs.acs_lms_backend_resource.controller;


import bg.acs.acs_lms_backend_resource.model.dto.*;
import bg.acs.acs_lms_backend_resource.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"${frontend_url}"})
@RequiredArgsConstructor
@RequestMapping("checkouts")
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<CheckoutDto> addCheckout(@RequestBody CheckoutAddDto checkoutAddDto) {
        CheckoutDto checkoutDto = checkoutService.saveCheckout(checkoutAddDto);
        if (checkoutDto != null) {
            return ResponseEntity.ok(checkoutDto);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("check-active-checkout/{bookId}")
    public ResponseEntity<Boolean> checkAvailableBooks(@PathVariable Long bookId) {
        return ResponseEntity.ok(checkoutService.hasActiveCheckout(bookId));
    }

    @GetMapping("my-active-checkouts")
    public ResponseEntity<List<CheckoutDto>> getAllActiveCheckoutsForCurrentUser() {
        List<CheckoutDto> activeCheckouts = checkoutService.getAllActiveCheckoutsForCurrentUser();
        return ResponseEntity.ok(activeCheckouts);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    @GetMapping
    public Page<CheckoutWithFineDto> getAllActiveCheckouts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return checkoutService.getAllActiveCheckouts(pageable);
    }

    @PostMapping("/{id}/return")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN, ROLE_ASSISTANT')")
    public ResponseEntity<Boolean> returnBook(@PathVariable Long id) {
        CheckoutDto checkoutDto = checkoutService.returnBook(id);
        if (checkoutDto!=null){
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }

    @GetMapping("/books-renting-vs-checking-out")
    public ResponseEntity<Map<String, Map<String, Long>>> getBooksRentingVsBookCheckingOutDiagram(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Map<String, Long>> data = checkoutService.booksRentingVsBookCheckingOutDiagram(startDate, endDate);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }


    @GetMapping("/books-overdue-count")
    public ResponseEntity<Map<String, Long>> getBooksOverdueCount(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Long> data = checkoutService.countOverduePerDay(startDate, endDate);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }




    @GetMapping("/books-checked-out-last-week")
    public ResponseEntity<Long> getBooksCheckedOutLastWeek() {
        long checkedOutLastWeek = checkoutService.booksCheckedOutLastWeek();
        return new ResponseEntity<>(checkedOutLastWeek, HttpStatus.OK);
    }



}


