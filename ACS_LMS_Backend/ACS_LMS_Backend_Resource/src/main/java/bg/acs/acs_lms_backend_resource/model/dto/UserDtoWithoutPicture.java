package bg.acs.acs_lms_backend_resource.model.dto;

import bg.acs.acs_lms_backend_resource.model.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDtoWithoutPicture {

    private String email;

    private UUID id;

    private String name;

    private Gender gender;

    private String role;

}
