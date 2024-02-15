package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.*;
import bg.acs.acs_lms_backend_resource.model.entity.*;
import bg.acs.acs_lms_backend_resource.repository.BookCopyRepository;
import bg.acs.acs_lms_backend_resource.repository.BookRepository;
import bg.acs.acs_lms_backend_resource.repository.CategoryRepository;
import bg.acs.acs_lms_backend_resource.repository.ImageRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final ModelMapper modelMapper;

    private final AuthorService authorService;

    private final CategoryRepository categoryRepository;

    private final ImageRepository imageRepository;
    
    private final PublisherService publisherService;

    private final LanguageService languageService;

    private final UserService userService;

    private final ReservationService reservationService;

    @Transactional
    public BookShortDto saveBook(BookAddDto bookAddDto){
        Book book = bookRepository.findByTitle(bookAddDto.getTitle())
                .orElse(mapBookAddDtoToBook(bookAddDto));
        Book book1 = bookRepository.saveAndFlush(book);
        BookCopy bookCopy = mapBookAddDtoToBookCopy(bookAddDto);
        bookCopy.setBook(book1);
        bookCopyRepository.save(bookCopy);
        return mapBookToBookShortDto(book);
    }


    public Set<BookShortDto> getBooksShort(){
        return bookRepository.findAll().stream().map(this::mapBookToBookShortDto).collect(Collectors.toSet());
    }

    public Set<BookShortDto> getBooksByCategory(Category category){
        return bookRepository.findAllByCategoriesContaining(category)
                .stream()
                .map(this::mapBookToBookShortDto)
                .collect(Collectors.toSet());
    }



    public BookCopy mapBookAddDtoToBookCopy(BookAddDto bookAddDto) {
        BookCopy bookCopy = modelMapper.map(bookAddDto, BookCopy.class);
        bookCopy.setPublisher(publisherService.getPublisherById(bookAddDto.getPublisher()));
        bookCopy.setLanguage(languageService.mapLanguageDtoToLanguage(bookAddDto.getLanguage()));
        bookCopy.setPublicationDate(bookAddDto.getPublicationDate());
        return bookCopy;
    }

    public BookCopy mapBookUpdateDtoToBookCopy(BookUpdateDto bookUpdateDto) {
        BookCopy bookCopy = modelMapper.map(bookUpdateDto, BookCopy.class);
        bookCopy.setPublisher(publisherService.getPublisherById(bookUpdateDto.getPublisher()));
        bookCopy.setLanguage(languageService.mapLanguageDtoToLanguage(bookUpdateDto.getLanguage()));
        bookCopy.setPublicationDate(bookUpdateDto.getPublicationDate());
        bookCopy.setId(bookUpdateDto.getBookCopyId());
        return bookCopy;
    }

    public BookShortDto mapBookToBookShortDto(Book book) {
        BookShortDto bookShortDto = modelMapper.map(book, BookShortDto.class);
        bookShortDto.setAuthors(book.getAuthors().stream().map(authorService::mapAuthorToAuthorShortDto)
                .collect(Collectors.toSet()));
        bookShortDto.setImageId(book.getCoverPhoto().getId());

        return bookShortDto;
    }

    public Book mapBookAddDtoToBook(BookAddDto bookAddDto) {
        Book book = modelMapper.map(bookAddDto, Book.class);
        book.setAuthors(authorService.getAuthorsByIds(bookAddDto.getAuthors()));
        book.setCategories(mapCategoryNamesToCategories(bookAddDto.getCategories()));
        book.setCoverPhoto(imageRepository.findById(bookAddDto.getImageId()).orElseThrow(EntityNotFoundException::new));
        return book;
    }

    public Book mapBookUpdateDtoToBook(BookUpdateDto bookUpdateDto) {
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.typeMap(BookUpdateDto.class, Book.class)
                .addMappings(mapper -> mapper.map(BookUpdateDto::getBookId, Book::setId));
        Book book = modelMapper.map(bookUpdateDto, Book.class);
        book.setAuthors(authorService.getAuthorsByIds(bookUpdateDto.getAuthors()));
        book.setCategories(mapCategoryNamesToCategories(bookUpdateDto.getCategories()));
        book.setCoverPhoto(imageRepository.findById(bookUpdateDto.getImageId()).orElseThrow(EntityNotFoundException::new));
        return book;
    }


    public Set<Long> getBookCopyIdsByTitleAndId(String title, Long id){
        List<BookCopy> allByBookTitle = bookCopyRepository.findAllByBookTitleAndBookId(title, id);
        return allByBookTitle.stream().map(BaseEntity::getId).collect(Collectors.toSet());
    }


    public Set<BookShortDto> getBooksBestSellers(int topN) {
        List<Map<String, Object>> bestSellersData = bookCopyRepository.findTopNBestSellers(PageRequest.of(0,topN));
        List<Book> booksToBeMapped;
        if (bestSellersData.isEmpty()){
            booksToBeMapped = bookRepository.findAll(PageRequest.of(0, topN)).stream().toList();
        }
        else {
            List<Long> bookIds = bestSellersData.stream()
                    .map(data -> (Long) data.get("bookId"))
                    .collect(Collectors.toList());

            booksToBeMapped = bookRepository.findAllById(bookIds);
        }

        return booksToBeMapped.stream()
                .map(this::mapBookToBookShortDto)
                .collect(Collectors.toSet());
    }



//    @Caching(evict = {
//            @CacheEvict(value = "bestSellers", allEntries = true)
//    })
//    @Transactional(value= Transactional.TxType.REQUIRES_NEW)
//    @Scheduled(cron = "0 0 0 * * ?")
//    public void updateBestSellers() {
//        getBooksBestSellers(25);
//    }


    private Set<Category> mapCategoryNamesToCategories(Set<String> categoryNames) {
        return categoryNames.stream()
                .map(categoryName -> categoryRepository.findByName(categoryName)
                        .orElse(Category.builder().name(categoryName).build()))
                .collect(Collectors.toSet());
    }

    public Optional<BookFullDto> getBookFullByTitleAndId(String title, Long id) {
        Book book = bookRepository.findByTitleAndId(title, id).orElseThrow(EntityNotFoundException::new);
        Optional<BookCopy> firstByBook = bookCopyRepository.findFirstByBook(book);
        return firstByBook.map(bookCopy -> mapBookAndBookCopyToBookFullDto(book, bookCopy));
    }

    private BookFullDto mapBookAndBookCopyToBookFullDto(Book book, BookCopy bookCopy) {
            BookFullDto bookFullDto = modelMapper.map(book, BookFullDto.class);
            modelMapper.map(bookCopy, bookFullDto);
            bookFullDto.setBookCopyId(bookCopy.getId());
            bookFullDto.setPublisherId(bookCopy.getPublisher().getId());
            bookFullDto.setCategories(book.getCategories().stream().map(Category::getName).collect(Collectors.toSet()));
            bookFullDto.setAuthors(book.getAuthors().stream().map(authorService::mapAuthorToAuthorShortDto).collect(Collectors.toSet()));
            bookFullDto.setPublicationDate(bookCopy.getPublicationDate());
            bookFullDto.setCoverPhotoUrl(book.getCoverPhoto().getFileName());
            bookFullDto.setImageId(book.getCoverPhoto().getId());
            return bookFullDto;

    }

    public BookFullDto getBookFullByTitleAndIdAndBookCopyId(String title, Long id, Long bookCopyId) {
        Book book = bookRepository.findByTitleAndId(title, id).orElseThrow(EntityNotFoundException::new);
        Optional<BookCopy> firstByBook = bookCopyRepository.findByBookAndId(book, bookCopyId);
        if (firstByBook.isPresent()) {
            return mapBookAndBookCopyToBookFullDto(book, firstByBook.get());
        } else {
            throw new EntityNotFoundException("No BookCopy found for the given Book");
        }
    }

    @Transactional
    public BookFullDto saveBookCopy(BookCopyAddDto bookCopyAddDto) {
        BookCopy bookCopy = mapBookCopyAddDtoToBookCopy(bookCopyAddDto);
        Book book = bookRepository.findById(bookCopyAddDto.getBookId()).orElseThrow(EntityNotFoundException::new);
        book.getBookCopies().add(bookCopy);
        Book save = bookRepository.save(book);
        bookCopy.setBook(save);
        bookCopyRepository.save(bookCopy);
        return mapBookAndBookCopyToBookFullDto(book, bookCopy);
    }


    private BookCopy mapBookCopyAddDtoToBookCopy(BookCopyAddDto bookCopyAddDto) {
        BookCopy map = modelMapper.map(bookCopyAddDto, BookCopy.class);
        map.setId(null);
        map.setPublisher(publisherService.getPublisherById(bookCopyAddDto.getPublisher()));
        map.setLanguage(languageService.mapLanguageDtoToLanguage(bookCopyAddDto.getLanguage()));
        return map;
    }

    public Set<BookShortDto> getBooksByTitle(String title) {
        return bookRepository.getAllByTitleContainsIgnoreCase(title).stream().map(this::mapBookToBookShortDto).collect(Collectors.toSet());
    }

    public Set<BookShortDto> getBooksByAuthorsIds(List<Long> ids) {
        return bookRepository.findAllByAuthorIds(ids)
                .stream()
                .map(this::mapBookToBookShortDto)
                .collect(Collectors.toSet());
    }

    public boolean checkForCallNumber(String callNumber) {
        return bookCopyRepository.existsByCallNumber(callNumber);
    }


    @Transactional
    public Optional<ReservationDto> reserveBook(Long bookId) {
        if (hasReservationsForBook(bookId).isPresent()) {
            throw new IllegalStateException("User has already reserved this book");
        }

        List<BookCopy> booksAvailable = booksAvailable(bookId);
        if (!booksAvailable.isEmpty()) {
            BookCopy bookCopy = booksAvailable.get(0);
            Reservation reservation = Reservation.builder()
                    .reservationDate(LocalDateTime.now())
                    .bookCopy(bookCopy)
                    .user(userService.getCurrentUser())
                    .build();
            Reservation save = reservationService.save(reservation);
            return Optional.of(reservationService.mapReservationToReservationDto(save));
        }
        return Optional.empty();
    }

    public Optional<ReservationDto> hasReservationsForBook(Long bookId){
        List<BookCopy> allByBookId = bookCopyRepository.findAllByBookId(bookId);
        for (BookCopy copy : allByBookId){
            Optional<ReservationDto> reservation = reservationService.getReservationByUserAndBookCopy(copy, userService.getCurrentUser());
            if (reservation.isPresent()){
                return reservation;
            }
        }
        return Optional.empty();
    }

    public List<BookCopy> booksAvailable(Long bookId){
        return bookCopyRepository.findAvailableCopiesByBookId(bookId).stream().toList();
    }


    public boolean areBooksAvailable(Long bookId){
        return !booksAvailable(bookId).isEmpty();
    }


    public boolean checkForISBN(String isbn) {
        return bookCopyRepository.existsByIsbn(isbn);
    }

    @Transactional
    public BookShortDto updateBook(Long id, BookUpdateDto bookUpdateDto) {
        Book book = mapBookUpdateDtoToBook(bookUpdateDto);
        Book updatedBook = bookRepository.saveAndFlush(book);
        BookCopy bookCopy = mapBookUpdateDtoToBookCopy(bookUpdateDto);
        bookCopy.setBook(updatedBook);
        bookCopyRepository.save(bookCopy);

        return mapBookToBookShortDto(updatedBook);
    }


    public boolean checkForInventoryNumber(String inventoryNumber) {
        return bookCopyRepository.existsByInventoryNumber(inventoryNumber);
    }

    @Transactional
    public Boolean deleteBookByBookIdAndBookCopyId(Long bookId, Long bookCopyId) {
        bookCopyRepository.deleteById(bookCopyId);
        List<BookCopy> allByBookId = bookCopyRepository.findAllByBookId(bookId);
        if (allByBookId.size()==0){
            Book book = bookRepository.findById(bookId).orElseThrow(EntityNotFoundException::new);
            bookRepository.delete(book);
        }
        Optional<BookCopy> byId = bookCopyRepository.findById(bookCopyId);
        if (byId.isPresent()){
            return false;
        }
        return true;
    }


}
