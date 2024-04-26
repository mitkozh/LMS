package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.entity.Environment;
import bg.acs.acs_lms_backend_resource.service.EnvironmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"${frontend_url}"})
@RequiredArgsConstructor
@RequestMapping("environment")
public class EnvironmentController {

    private final EnvironmentService environmentService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")

    public Environment getEnvironment() {
        return environmentService.getEnvironment();
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public Environment updateEnvironment(@RequestBody Environment environment) {
        return environmentService.updateEnvironment(environment);
    }
}
