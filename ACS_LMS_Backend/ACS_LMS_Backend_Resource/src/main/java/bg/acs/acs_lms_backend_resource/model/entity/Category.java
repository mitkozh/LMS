package bg.acs.acs_lms_backend_resource.model.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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


    @Column(name = "name", length = 100, nullable = false)

    private String name;

    @Column(name = "description", length = 300, nullable = true)

    private String description;

    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private Set<Book> books = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "parent_category_id")
    private Category parentCategory;


}
