package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.*;
import bg.acs.acs_lms_backend_resource.model.entity.BaseEntity;
import bg.acs.acs_lms_backend_resource.model.entity.Book;
import bg.acs.acs_lms_backend_resource.model.entity.BookCopy;
import bg.acs.acs_lms_backend_resource.model.entity.Category;
import bg.acs.acs_lms_backend_resource.repository.BookCopyRepository;
import bg.acs.acs_lms_backend_resource.repository.BookRepository;
import bg.acs.acs_lms_backend_resource.repository.CategoryRepository;
import bg.acs.acs_lms_backend_resource.repository.ImageRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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

    @Transactional
    public BookShortDto saveBook(BookAddDto bookAddDto){
        Book book = bookRepository.findByTitle(bookAddDto.getTitle())
                .orElse(mapBookAddDtoToBook(bookAddDto));
        BookCopy bookCopy = mapBookAddDtoToBookCopy(bookAddDto);
        bookCopy.setBook(book);
        bookCopy.setPublisher(publisherService.getPublisherById(bookAddDto.getPublisher()));
        bookCopy.setLanguage(languageService.mapLanguageDtoToLanguage(bookAddDto.getLanguage()));
        bookRepository.save(book);
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
        return bookCopy;
    }

    public BookShortDto mapBookToBookShortDto(Book book) {
        BookShortDto bookShortDto = modelMapper.map(book, BookShortDto.class);
        bookShortDto.setAuthors(book.getAuthors().stream().map(authorService::mapAuthorToAuthorShortDto)
                .collect(Collectors.toSet()));
        bookShortDto.setCoverPhotoName(book.getCoverPhoto().getFileName());

        return bookShortDto;
    }

    public Book mapBookAddDtoToBook(BookAddDto bookAddDto) {
        Book book = modelMapper.map(bookAddDto, Book.class);
        book.setAuthors(authorService.getAuthorsByIds(bookAddDto.getAuthors()));
        book.setCategories(mapCategoryNamesToCategories(bookAddDto.getCategories()));
        book.setCoverPhoto(imageRepository.findByFileName(bookAddDto.getCoverPhotoName()).orElseThrow(EntityNotFoundException::new));
        return book;
    }


    public Set<Long> getBookCopyIDsByTitle(String title){
        List<BookCopy> allByBookTitle = bookCopyRepository.findAllByBookTitle(title);
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

    public Optional<BookFullDto> getBookFullByTitle(String title) {
        Book book = bookRepository.findByTitle(title).orElseThrow(EntityNotFoundException::new);
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

    public BookFullDto getBookFullByTitleAndEdition(String title, Long edition) {
        Book book = bookRepository.findByTitle(title).orElseThrow(EntityNotFoundException::new);
        Optional<BookCopy> firstByBook = bookCopyRepository.findByBookAndId(book, edition);
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
        bookCopy.setBook(book);
        bookRepository.save(book);
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
}
