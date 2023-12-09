package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.dto.*;
import bg.acs.acs_lms_backend_resource.model.entity.Book;
import bg.acs.acs_lms_backend_resource.model.entity.Category;
import bg.acs.acs_lms_backend_resource.model.entity.Reservation;
import bg.acs.acs_lms_backend_resource.repository.BookRepository;
import bg.acs.acs_lms_backend_resource.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("books")
public class BookController {

    private final BookService bookService;
    @GetMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<Set<BookShortDto>> getBooks() {
        return ResponseEntity.ok(bookService.getBooksShort());
    }
    
    @PostMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<BookShortDto> addBook(@RequestBody BookAddDto bookAddDto) {
        BookShortDto bookShortDto = bookService.saveBook(bookAddDto);
        if (bookShortDto!=null){
            return ResponseEntity.ok(bookShortDto);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("bestsellers")
    public ResponseEntity<Set<BookShortDto>> getBestsellers() {
        return ResponseEntity.ok(bookService.getBooksBestSellers(25));
    }

    @GetMapping("{title}")
    public ResponseEntity<BookFullDto> getBookByName(@PathVariable String title) {
        Optional<BookFullDto> bookFullDto = bookService.getBookFullByTitle(title);
        return bookFullDto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping("{title}/{edition}")
    public ResponseEntity<BookFullDto> getBookByName(@PathVariable String title, @PathVariable Long edition) {

        BookFullDto bookFullDto = bookService.getBookFullByTitleAndEdition(title, edition);
        if (bookFullDto!=null){
            return ResponseEntity.ok(bookFullDto);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("bookCopy/{title}")
    public ResponseEntity<Set<Long>> getBookCopyIDsByTitle(@PathVariable String title) {
        Set<Long> bookCopyIDsByTitle = bookService.getBookCopyIDsByTitle(title);
        if (!bookCopyIDsByTitle.isEmpty()){
            return ResponseEntity.ok(bookCopyIDsByTitle);
        }
        return ResponseEntity.noContent().build();
    }


    @PostMapping("bookCopy")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<BookFullDto> addBookCopy(@RequestBody BookCopyAddDto bookCopyAddDto) {
        BookFullDto bookFullDto = bookService.saveBookCopy(bookCopyAddDto);
        if (bookFullDto!=null){
            return ResponseEntity.ok(bookFullDto);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("all/{title}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    public ResponseEntity<Set<BookShortDto>> getBooksByTitle(@PathVariable String title) {
        title = URLDecoder.decode(title, StandardCharsets.UTF_8);

        Set<BookShortDto> books = bookService.getBooksByTitle(title);

        if (books.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(books);
    }


    @PostMapping("authors")
    public ResponseEntity<Set<BookShortDto>> getBooksByAuthorsIds(@RequestBody List<Long> ids) {
        Set<BookShortDto> books = bookService.getBooksByAuthorsIds(ids);
        if (books.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(books);
    }


    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_LIBRARIAN')")
    @GetMapping("check-call-number/{callNumber}")
    public ResponseEntity<Boolean> checkForCallNumber(@PathVariable String callNumber) {
        boolean exists = bookService.checkForCallNumber(callNumber);
        return ResponseEntity.ok(exists);
    }


        @GetMapping("reserveBook/{bookId}")
        public ResponseEntity<ReservationDto> reserveBook(@PathVariable Long bookId) {
            Optional<ReservationDto>  reservation= bookService.reserveBook(bookId);
            return reservation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
        }

        @GetMapping("available-check/{bookId}")
        public ResponseEntity<Boolean> checkAvailableBooks(@PathVariable Long bookId) {
            return ResponseEntity.ok(bookService.areBooksAvailable(bookId));
        }

        @GetMapping("has-reservations/{bookId}")
        public ResponseEntity<ReservationDto> hasReservationForBook(@PathVariable Long bookId) {
            Optional<ReservationDto> reservation = bookService.hasReservationsForBook(bookId);
            return reservation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
        }
}
