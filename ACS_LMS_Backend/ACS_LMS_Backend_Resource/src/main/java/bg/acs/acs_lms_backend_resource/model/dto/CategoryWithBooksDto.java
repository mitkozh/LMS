package bg.acs.acs_lms_backend_resource.model.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryWithBooksDto {
    private String name;
    private String description;
    private Set<BookShortDto> books;
}
