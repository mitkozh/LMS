package bg.acs.acs_lms_backend_resource.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageDto {

    private Long id;
    private String name;
    private String type;


}