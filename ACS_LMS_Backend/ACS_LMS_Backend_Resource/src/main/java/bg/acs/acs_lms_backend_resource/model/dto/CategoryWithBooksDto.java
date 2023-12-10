package bg.acs.acs_lms_backend_resource.model.dto;

import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryWithBooksDto {

    @NotBlank(message = "Name code is required!")
    @Size(max = 50, message = "Name must not exceed 50 characters")

    private String name;

    @Size(max = 3000, message = "Description must not exceed 3000 characters")
    private String description;
    private Set<BookShortDto> books;
}
