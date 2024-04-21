package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.dto.AuthorShortDto;
import bg.acs.acs_lms_backend_resource.model.dto.PublisherDto;
import bg.acs.acs_lms_backend_resource.model.entity.Language;
import bg.acs.acs_lms_backend_resource.model.entity.Publisher;
import bg.acs.acs_lms_backend_resource.repository.PublisherRepository;
import bg.acs.acs_lms_backend_resource.service.PublisherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = {"${frontend_url}"})
@RequiredArgsConstructor
@RequestMapping("/publishers")
public class PublisherController {


    private final PublisherService publisherService;

    @GetMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<Set<PublisherDto>> getLanguages() {
        return ResponseEntity.ok(publisherService.getAll());
    }


    @GetMapping("/all/{name}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity getPublishersByName(@PathVariable String name) {
        Set<PublisherDto> publishers = publisherService.getPublishersByName(name);

        if (publishers.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(publishers);
    }

    @PostMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<PublisherDto> addPublisher(@RequestBody PublisherDto publisherDto) {
        return ResponseEntity.ok(publisherService.savePublisher(publisherDto));
    }

    @GetMapping("{id}")
    public ResponseEntity<PublisherDto> getPublishersById(@PathVariable Long id) {
         PublisherDto publisher = publisherService.getPublisherByIdDto(id);

        if (publisher==null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(publisher);
    }
}
