package bg.acs.acs_lms_backend_resource.model.dto;

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
    private String name;

    private String description;

    private Long imageId;

}
