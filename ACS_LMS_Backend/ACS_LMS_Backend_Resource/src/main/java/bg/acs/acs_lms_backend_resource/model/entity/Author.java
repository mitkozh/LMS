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

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "description", length = 100)

    private String description;

    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "profile_photo_id", referencedColumnName = "id")
    private Image profilePhoto;

//    @ManyToMany(mappedBy = "authors")
//    private Set<Book> books = new HashSet<>();

}
