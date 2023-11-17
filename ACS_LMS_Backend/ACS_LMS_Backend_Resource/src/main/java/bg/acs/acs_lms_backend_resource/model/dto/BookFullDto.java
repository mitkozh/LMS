package bg.acs.acs_lms_backend_resource.model.dto;

import bg.acs.acs_lms_backend_resource.model.entity.Category;
import bg.acs.acs_lms_backend_resource.model.enums.AcquisitionDocumentEnum;
import bg.acs.acs_lms_backend_resource.model.enums.BookBindingEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookFullDto {
    private Long bookId;
    private String title;
    private String description;
    private Long imageId;
    private String coverPhotoUrl;
    private int volume;
    public Set<AuthorShortDto> authors;
    private Set<String> categories;
    private Long bookCopyId;
    private String callNumber;
    private String inventoryNumber;
    private BigDecimal price;
    private String schoolInventoryNumber;
    private String language;
    private Long publisherId;
    private BookBindingEnum binding;
    private String size;
    private LocalDate publicationDate;
    private String edition;
    private String isbn;
    private String notes;
    private AcquisitionDocumentEnum acquisitionDocument;
}
