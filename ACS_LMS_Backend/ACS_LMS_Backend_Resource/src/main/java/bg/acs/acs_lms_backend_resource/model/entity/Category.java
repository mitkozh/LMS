package bg.acs.acs_lms_backend_resource.model.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "category")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Category extends BaseEntity{


    private String name;

    private String description;

    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private Set<Book> books = new HashSet<>();


}
