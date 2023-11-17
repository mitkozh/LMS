package bg.acs.acs_lms_backend_resource.model.dto;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PublisherDto {
    private long id;

    private String name;
}
