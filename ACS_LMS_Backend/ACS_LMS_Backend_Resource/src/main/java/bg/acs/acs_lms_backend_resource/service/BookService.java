package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.*;
import bg.acs.acs_lms_backend_resource.model.entity.*;
import bg.acs.acs_lms_backend_resource.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final ModelMapper modelMapper;

    private final AuthorService authorService;

    private final CheckoutRepository checkoutRepository;

    private final CategoryRepository categoryRepository;

    private final ImageService imageService;

    private final PublisherService publisherService;

    private final LanguageService languageService;

    private final UserService userService;

    private final ReservationService reservationService;
    private final ReservationRepository reservationRepository;

    @CacheEvict(value = {"booksShort", "booksByCategory"}, allEntries = true)
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


    @Cacheable(value = "booksShort")
    public Set<BookShortDto> getBooksShort() {
        return bookRepository.findAllByDeletedIsFalse().stream()
                .map(this::mapBookToBookShortDto)
                .collect(Collectors.toSet());
    }

    @Cacheable(value = "booksByCategory")
    public Set<BookShortDto> getBooksByCategory(Category category) {
        Set<BookShortDto> books =  bookRepository.findAllByCategoriesContainingAndDeletedIsFalse(category)
                .stream()
                .map(this::mapBookToBookShortDto)
                .collect(Collectors.toSet());

        return books;
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
        return getBook(bookAddDto);
    }

    private Book getBook(BookAddDto bookAddDto)  {
        Book book = modelMapper.map(bookAddDto, Book.class);
        book.setAuthors(authorService.getAuthorsByIds(bookAddDto.getAuthors()));
        book.setCategories(mapCategoryNamesToCategories(bookAddDto.getCategories()));
        if (bookAddDto.getImageId()!=null){
            book.setCoverPhoto(imageService.findById(bookAddDto.getImageId()).orElseThrow(EntityNotFoundException::new));
        }
        else{
            try{
                ImageDto imageDto = imageService.uploadLocalImage("src/main/resources/static/cover_photo.jpg");
                Image image = imageService.getImage(imageDto.getId());
                book.setCoverPhoto(image);
            }
            catch (IOException e) {
                throw new RuntimeException(e);
            }

        }

        return book;
    }

    public Book mapBookUpdateDtoToBook(BookUpdateDto bookUpdateDto) {
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.typeMap(BookUpdateDto.class, Book.class)
                .addMappings(mapper -> mapper.map(BookUpdateDto::getBookId, Book::setId));
        return getBook(bookUpdateDto);
    }


    public Set<Long> getBookCopyIdsByTitleAndId(String title, Long id){
        List<BookCopy> allByBookTitle = bookCopyRepository.findAllByBookTitleAndBookId(title, id);
        return allByBookTitle.stream().map(BaseEntity::getId).collect(Collectors.toSet());
    }


    public Set<BookShortDto> getBooksBestSellers(int topN) {
        List<Map<String, Object>> bestSellersData = bookCopyRepository.findTopNBestSellers(PageRequest.of(0,topN));
        List<Book> booksToBeMapped;
        if (bestSellersData.size()<topN){
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

    @CacheEvict(value = {"booksShort", "booksByCategory"}, allEntries = true)
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
        return bookRepository.getAllByTitleContainsIgnoreCaseAndDeletedIsFalse(title)
                .stream()
                .map(this::mapBookToBookShortDto)
                .collect(Collectors.toSet());
    }

    public Set<BookShortDto> getBooksByAuthorsIds(List<Long> ids) {
        return bookRepository.findAllByAuthorIdsAndDeletedIsFalse(ids)
                .stream()
                .map(this::mapBookToBookShortDto)
                .collect(Collectors.toSet());
    }

    public boolean checkForCallNumber(String callNumber) {
        return bookCopyRepository.existsByCallNumber(callNumber);
    }


    @Transactional
    public Optional<ReservationDto> reserveBook(Long bookId) {
        if (hasActiveReservationsForBookAndHasNotBorrower(bookId).isPresent()) {
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

    public Optional<ReservationDto> hasActiveReservationsForBookAndHasNotBorrower(Long bookId){
        List<BookCopy> allByBookId = bookCopyRepository.findAllByBookId(bookId);
        for (BookCopy copy : allByBookId){
            Optional<ReservationDto> reservation = reservationService.getActiveReservationByUserAndBookCopy(copy, userService.getCurrentUser());
            if (reservation.isPresent()){
                return reservation;
            }
        }
        return Optional.empty();
    }

    public List<BookCopy> booksAvailable(Long bookId){
        return getFreeBookCopiesByBookId(bookId)
                .stream()
                .map(bId->bookCopyRepository.findById(bId).orElseThrow(EntityNotFoundException::new))
                .collect(Collectors.toList());
    }


    public boolean areBooksAvailable(Long bookId){
        return !getFreeBookCopiesByBookId(bookId).isEmpty();
    }


    public boolean checkForISBN(String isbn) {
        return bookCopyRepository.existsByIsbn(isbn);
    }

    @CacheEvict(value = {"booksShort", "booksByCategory"}, allEntries = true)
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

    @CacheEvict(value = {"booksShort", "booksByCategory"}, allEntries = true)
    @Transactional
    public Boolean deleteBookByBookIdAndBookCopyId(Long bookId, Long bookCopyId) {
        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(EntityNotFoundException::new);
        bookCopyRepository.delete(bookCopy);
        List<BookCopy> allByBookId = bookCopyRepository.findAllByBookId(bookId);
        if (allByBookId.size()==0){
            Book book = bookRepository.findById(bookId)
                    .orElseThrow(EntityNotFoundException::new);
            book.setDeleted(true);
        }
        Optional<BookCopy> byId = bookCopyRepository.findById(bookCopyId);
        return byId.isEmpty();
    }

    public BookShortDto getBookById(Long id) {
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (optionalBook.isPresent()) {
            Book book = optionalBook.get();
            return mapBookToBookShortDto(book);
        }
        return null;
    }

    public Set<Long> getFreeBookCopiesByBookId(Long id) {
        Set<Long> freeBookCopyIds = new HashSet<>();
        Set<Long> checkedOutBookCopyIds = new HashSet<>();
        Set<Long> reservedBookCopyIds = new HashSet<>();

        Set<Checkout> checkouts = checkoutRepository.findByBookCopyIdAndReturnedFalse(id);
        checkouts.forEach(checkout -> checkedOutBookCopyIds.add(checkout.getBookCopy().getId()));

        LocalDateTime currentDateTime = LocalDateTime.now();
        Set<Reservation> reservations = reservationRepository.findByBookCopyIdAndCancelledFalseAndDueDateAfterAndActivatedFalse(id, currentDateTime);
        reservations.forEach(reservation -> reservedBookCopyIds.add(reservation.getBookCopy().getId()));

        Set<BookCopy> allBookCopies = bookCopyRepository.findByBookId(id);
        allBookCopies.forEach(bookCopy -> {
            if (!checkedOutBookCopyIds.contains(bookCopy.getId()) && !reservedBookCopyIds.contains(bookCopy.getId())) {
                freeBookCopyIds.add(bookCopy.getId());
            }
        });

        return freeBookCopyIds;
    }

    public Optional<BookCopy> findBookCopyById(Long bookCopyId) {
        return bookCopyRepository.findById(bookCopyId);
    }

    public Optional<Book> findBookById(Long bookId) {
        return bookRepository.findById(bookId);
    }

    public List<BookShortDto> getAllActiveCheckoutBooksForCurrentUser() {
        User user = userService.getCurrentUser();
        List<Checkout> checkouts = checkoutRepository.findAllByBorrowerAndReturnedFalseAndEndTimeNull(user);
        return checkouts.stream()
                .map(checkout -> mapBookToBookShortDto(checkout.getBookCopy().getBook()))
                .collect(Collectors.toList());
    }


    public long booksReturnedLastWeek() {
        LocalDateTime lastWeek = LocalDateTime.now().minus(1, ChronoUnit.WEEKS);
        return checkoutRepository.countByEndTimeAfterAndReturnedTrue(lastWeek);
    }


    public long booksOverdueCount() {
        return checkoutRepository.countByEndTimeBeforeAndReturnedFalse(LocalDateTime.now());
    }
    public long booksCount() {
        return bookRepository.count();
    }





}
