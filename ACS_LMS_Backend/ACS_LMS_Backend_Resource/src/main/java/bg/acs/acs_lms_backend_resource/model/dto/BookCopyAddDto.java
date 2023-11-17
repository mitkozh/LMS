package bg.acs.acs_lms_backend_resource.model.dto;

import bg.acs.acs_lms_backend_resource.model.enums.AcquisitionDocumentEnum;
import bg.acs.acs_lms_backend_resource.model.enums.BookBindingEnum;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data

public class BookCopyAddDto {


    @NotNull
    private Long bookId;


    @NotBlank(message = "Call number is required")
    @Size(max = 50, message = "Call number must not exceed 50 characters")
    private String callNumber;

    @NotBlank(message = "Inventory number is required")
    @Size(max = 50, message = "Inventory number must not exceed 50 characters")
    private String inventoryNumber;

    private BigDecimal price;

    @NotBlank(message = "School inventory number is required")
    @Size(max = 50, message = "School inventory number must not exceed 50 characters")
    private String schoolInventoryNumber;



    @NotNull(message = "Language is required!")

    private LanguageDto language;

    @NotNull(message = "Publisher is required!")

    private Long publisher;

    @NotNull(message = "Binding is required!")
    private BookBindingEnum binding;

    @Size(max = 50, message = "Size must not exceed 50 characters")
    private String size;

    private LocalDate publicationDate;

    @NotBlank(message = "Edition is required")
    private String edition;

    @NotBlank(message = "ISBN is required")
    @Pattern(regexp = "\\d{10}|\\d{13}", message = "ISBN must be a 10 or 13-digit number")
    private String isbn;

    @Size(max = 255, message = "Notes must not exceed 255 characters")
    private String notes;

    @NotNull(message = "Acquisition document is required!")

    private AcquisitionDocumentEnum acquisitionDocumentEnum;
}
