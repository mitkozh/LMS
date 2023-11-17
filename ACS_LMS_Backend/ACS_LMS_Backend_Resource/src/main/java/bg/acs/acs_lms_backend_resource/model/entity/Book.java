package bg.acs.acs_lms_backend_resource.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "book")
@Data
@EqualsAndHashCode(exclude = {"coverPhoto"}, callSuper = true)
public class Book extends BaseEntity{
    @Column(name = "title", length = 100, nullable = false)
    private String title;


    @Column(length = 3000, nullable = false)
    private String description;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id")
    @JsonIgnore
    private Image coverPhoto;

    @Column(nullable = false)
    private int volume;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "book_author",
            joinColumns = {@JoinColumn(name = "book_id")},
            inverseJoinColumns = {@JoinColumn(name = "author_id")})
    @JsonIgnore
    private Set<Author> authors = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "book_category",
            joinColumns = {@JoinColumn(name = "book_id")},
            inverseJoinColumns = {@JoinColumn(name = "category_id")})
    @JsonIgnore
    private Set<Category> categories = new HashSet<>();


    @JsonIgnore
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY)
    private List<BookCopy> bookCopies;



}
