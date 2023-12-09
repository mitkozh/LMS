package bg.acs.acs_lms_backend_resource.controller;


import bg.acs.acs_lms_backend_resource.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;



}
