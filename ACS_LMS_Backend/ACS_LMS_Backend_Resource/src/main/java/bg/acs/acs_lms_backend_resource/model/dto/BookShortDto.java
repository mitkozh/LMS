package bg.acs.acs_lms_backend_resource.model.dto;

import bg.acs.acs_lms_backend_resource.model.enums.BookBindingEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookShortDto {
    private Long id;
    private String title;
    private String coverPhotoName;
    private Set<AuthorShortDto> authors;
}
