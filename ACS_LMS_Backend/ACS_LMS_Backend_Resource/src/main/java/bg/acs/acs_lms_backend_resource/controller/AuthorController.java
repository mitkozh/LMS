package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.dto.AuthorShortDto;
import bg.acs.acs_lms_backend_resource.model.entity.Author;
import bg.acs.acs_lms_backend_resource.model.entity.Language;
import bg.acs.acs_lms_backend_resource.repository.AuthorRepository;
import bg.acs.acs_lms_backend_resource.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<Set<AuthorShortDto>> getAuthors() {
        return ResponseEntity.ok(authorService.getAuthors());
    }


    @GetMapping("/all/{name}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity getAuthorsByName(@PathVariable String name) {
        name = URLDecoder.decode(name, StandardCharsets.UTF_8);

        Set<AuthorShortDto> authors = authorService.getAuthorsByName(name);

        if (authors.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(authors);
      }

    @GetMapping("/name/{name}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<AuthorShortDto> getAuthorByName(@PathVariable String name) {
        name = URLDecoder.decode(name, StandardCharsets.UTF_8);
        AuthorShortDto author = authorService.getAuthorByName(name);
        if (author!=null) {
            return ResponseEntity.ok(author);
        }
        return ResponseEntity.noContent().build();


    }


    @PostMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<AuthorShortDto> addAuthor(@RequestBody AuthorShortDto authorShortDto) {
        return ResponseEntity.ok(authorService.saveAuthor(authorShortDto));
    }
}
