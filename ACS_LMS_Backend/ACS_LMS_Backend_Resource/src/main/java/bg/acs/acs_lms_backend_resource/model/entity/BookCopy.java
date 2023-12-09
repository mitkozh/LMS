package bg.acs.acs_lms_backend_resource.model.entity;





import bg.acs.acs_lms_backend_resource.model.enums.AcquisitionDocumentEnum;
import bg.acs.acs_lms_backend_resource.model.enums.BookBindingEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "book_copy")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookCopy extends BaseEntity {


    @Column(name = "call_number", length = 50, nullable = false)
    private String callNumber;

    @Column(name = "inventory_number", length = 50, unique = true, nullable = false)
    private String inventoryNumber;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "school_inventory_number", length = 50)
    private String schoolInventoryNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    @JsonIgnore
    private Book book;

    @ManyToOne
    @JoinColumn(name = "language_id")
    private Language language;
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;


    @Enumerated(EnumType.STRING)
    @Column(name = "binding", length = 20)
    private BookBindingEnum binding;

    @Column(length = 50)
    private String size;

    @Column()
    private LocalDate publicationDate;

    @Column(nullable = false)
    private String edition;

    @Column(length = 50, nullable = false)
    private String isbn;

    @Column(length = 255)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "acquisitionDocument", length = 20)
    private AcquisitionDocumentEnum acquisitionDocumentEnum;

    @OneToMany(mappedBy = "bookCopy", fetch = FetchType.LAZY)
    private List<Checkout> checkouts;

    @OneToMany(mappedBy = "bookCopy", fetch = FetchType.LAZY)
    private List<Reservation> reservations;
}