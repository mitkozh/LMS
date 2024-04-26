package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.service.FineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"${frontend_url}"})
@RequiredArgsConstructor
@RequestMapping("fines")
public class FineController {

    private final FineService fineService;

    @GetMapping("/fine-collected")
    public ResponseEntity<Double> getFineCollectedThroughoutTheYear() {
        Double fineCollected = fineService.fineCollectedThroughoutTheYear();
        return new ResponseEntity<>(fineCollected, HttpStatus.OK);
    }

}
