package bg.acs.acs_lms_backend_resource.model.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorShortDto {

    private Long id;

    @NotBlank(message = "Name code is required!")
    @Size(max = 50, message = "Name must not exceed 50 characters")
    private String name;

    @Size(max = 3000, message = "Description must not exceed 3000 characters")

    private String description;

    private Long imageId;

}
