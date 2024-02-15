package bg.acs.acs_lms_backend_resource.model.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BookGoogleAPIDto {
    private String title;
    private String description;
    private List<String> authors;
    private List<String> categories;
    private String language;
    private String publisher;
    private String binding;
    private Integer size;
    private LocalDate publicationDate;
    private String isbn;

    private String imageUrl;

}
