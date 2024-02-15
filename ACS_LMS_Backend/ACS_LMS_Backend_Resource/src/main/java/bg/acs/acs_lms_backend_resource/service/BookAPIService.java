package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.BookFullDto;
import bg.acs.acs_lms_backend_resource.model.dto.BookGoogleAPIDto;
import bg.acs.acs_lms_backend_resource.model.dto.ImageDto;
import bg.acs.acs_lms_backend_resource.model.entity.Author;
import bg.acs.acs_lms_backend_resource.model.entity.Category;
import bg.acs.acs_lms_backend_resource.model.entity.Language;
import bg.acs.acs_lms_backend_resource.model.entity.Publisher;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Feign;
import feign.RequestLine;
import feign.gson.GsonDecoder;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookAPIService {
    private static final String GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q=isbn:%s";
    private final ModelMapper modelMapper;

    private final RestTemplate restTemplate = new RestTemplate();
    private final PublisherService publisherService;
    private final LanguageService languageService;
    private final AuthorService authorService;

    private final CategoryService categoryService;

    private final ImageService imageService;


    public BookGoogleAPIDto getBookByISBN(String isbn) {
        ResponseEntity<JsonNode> response = restTemplate.getForEntity(String.format(GOOGLE_BOOKS_API_URL, isbn), JsonNode.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            JsonNode body = response.getBody();
            if (body != null && body.has("items")) {
                JsonNode items = body.get("items");
                if (items.isArray() && items.size() > 0) {
                    JsonNode volumeInfo = items.get(0).get("volumeInfo");
                    return mapToBookGoogleAPIDto(isbn, volumeInfo);
                }
            }
        }
        return null;
    }

    private BookGoogleAPIDto mapToBookGoogleAPIDto(String isbn, JsonNode volumeInfo) {
        BookGoogleAPIDto book = new BookGoogleAPIDto();
        book.setIsbn(isbn);
        book.setLanguage(volumeInfo.has("language") ? volumeInfo.get("language").asText() : null);
        book.setPublisher(volumeInfo.has("publisher") ? volumeInfo.get("publisher").asText() : null);
        book.setSize(volumeInfo.has("pageCount") ? volumeInfo.get("pageCount").asInt() : null);
        if(volumeInfo.has("publishedDate")) {
            String publishedDate = volumeInfo.get("publishedDate").asText();
            if(publishedDate.length() == 4) {
                book.setPublicationDate(LocalDate.of(Integer.parseInt(publishedDate), 1, 1));
            } else {
                book.setPublicationDate(LocalDate.parse(publishedDate, DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            }
        }

        book.setCategories(volumeInfo.has("categories") ? readValueAsList(volumeInfo.get("categories")) : Collections.emptyList());
        book.setAuthors(volumeInfo.has("authors") ? readValueAsList(volumeInfo.get("authors")) : Collections.emptyList());
        book.setTitle(volumeInfo.has("title") ? volumeInfo.get("title").asText() : null);
        book.setDescription(volumeInfo.has("description") ? volumeInfo.get("description").asText() : null);
        book.setImageUrl(volumeInfo.has("imageLinks")? volumeInfo.get("imageLinks").get("thumbnail").asText() : null);
        return book;
    }

    private List<String> readValueAsList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node.isArray()) {
            for (JsonNode item : node) {
                list.add(item.asText());
            }
        }
        return list;
    }

    @Transactional
    public BookFullDto getBookFullDtoByIsbn(String isbn) throws IOException {
        BookGoogleAPIDto bookGoogleApiDtoByISBN = getBookByISBN(isbn);

        if (bookGoogleApiDtoByISBN != null) {
            List<Author> authorList = bookGoogleApiDtoByISBN.getAuthors().stream()
                    .map(author -> {
                        try {
                            return authorService.mapAuthorNameToAuthor(author);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }).toList();
            List<Category> categories = categoryService.findAllByNames(bookGoogleApiDtoByISBN.getCategories());
            Language language = languageService.findByLanguageCodeOrCreate(bookGoogleApiDtoByISBN.getLanguage());
            Publisher publisher = publisherService.findByPublisherNameOrCreate(bookGoogleApiDtoByISBN.getPublisher());
            ImageDto imageDto = null;
            if (bookGoogleApiDtoByISBN.getImageUrl()!=null){
                 imageDto = imageService.uploadImageFromUrl(bookGoogleApiDtoByISBN.getImageUrl());
            }

            BookFullDto bookFullDto = modelMapper.map(bookGoogleApiDtoByISBN, BookFullDto.class);
            if (!authorList.isEmpty()) {
                bookFullDto.setAuthors(authorList.stream()
                        .map(authorService::mapAuthorToAuthorShortDto)
                        .collect(Collectors.toSet()));
            }
            if (categories != null && !categories.isEmpty()) {
                bookFullDto.setCategories(categories.stream()
                        .map(Category::getName)
                        .collect(Collectors.toSet()));
            }
            if (language != null) {
                bookFullDto.setLanguage(language.getLanguageCode());
            }
            if (publisher != null) {
                bookFullDto.setPublisherId(publisher.getId());
            }
            if (imageDto!=null){
                bookFullDto.setImageId(imageDto.getId());
            }
            return bookFullDto;


        }
        return null;
    }


}
