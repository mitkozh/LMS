package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.dto.LanguageDto;

import bg.acs.acs_lms_backend_resource.service.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("languages")
public class LanguageController {


    private final LanguageService languageService;


    @GetMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<Set<LanguageDto>> getLanguages() {
        return ResponseEntity.ok(languageService.getAll());
    }

    @GetMapping("/{languageCode}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<LanguageDto> getLanguage(@PathVariable String languageCode) {
        LanguageDto languageDto =  languageService.getByLanguageCodeDto(languageCode);
        if (languageDto!=null){
            return ResponseEntity.ok(languageDto);
        }
        return ResponseEntity.noContent().build();
    }


    @PostMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<LanguageDto> addLanguage(@RequestBody LanguageDto languageDto) {
        return ResponseEntity.ok(languageService.saveLanguage(languageDto));
    }


}
