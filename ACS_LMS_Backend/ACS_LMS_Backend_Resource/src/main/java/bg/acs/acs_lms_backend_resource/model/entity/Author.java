package bg.acs.acs_lms_backend_resource.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "author")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Author extends BaseEntity{

    private String name;

    private String description;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_photo_id", referencedColumnName = "id")
    private Image profilePhoto;

//    @ManyToMany(mappedBy = "authors")
//    private Set<Book> books = new HashSet<>();

}
