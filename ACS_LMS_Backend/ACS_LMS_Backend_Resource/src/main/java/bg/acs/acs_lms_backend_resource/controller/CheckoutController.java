package bg.acs.acs_lms_backend_resource.controller;


import bg.acs.acs_lms_backend_resource.model.dto.BookAddDto;
import bg.acs.acs_lms_backend_resource.model.dto.BookShortDto;
import bg.acs.acs_lms_backend_resource.model.dto.CheckoutAddDto;
import bg.acs.acs_lms_backend_resource.model.dto.CheckoutDto;
import bg.acs.acs_lms_backend_resource.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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





}
