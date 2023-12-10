package bg.acs.acs_lms_backend_resource.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageDto {

    @NotNull(message = "Language code is required!")
    private String languageCode;

}
