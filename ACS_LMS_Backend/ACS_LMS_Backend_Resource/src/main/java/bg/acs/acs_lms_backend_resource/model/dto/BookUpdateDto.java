package bg.acs.acs_lms_backend_resource.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class BookUpdateDto extends BookAddDto{
    @NotNull(message = "Book id is required!")
    private Long bookId;

    @NotNull(message = "Book copy id is required!")

    private Long bookCopyId;

}
