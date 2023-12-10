package bg.acs.acs_lms_backend_resource.model.dto;

import jakarta.validation.constraints.Size;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PublisherDto {
    private long id;

    @Size(max = 50, message = "Name must not exceed 50 characters")
    private String name;
}
