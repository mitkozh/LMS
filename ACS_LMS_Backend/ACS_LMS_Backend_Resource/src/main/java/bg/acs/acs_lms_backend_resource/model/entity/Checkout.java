package bg.acs.acs_lms_backend_resource.model.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "checkout")
public class Checkout extends BaseEntity{

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean returned;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_copy_id")
    private BookCopy bookCopy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id")
    private User borrower;

}