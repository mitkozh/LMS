package bg.acs.acs_lms_backend_resource.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "checkout", indexes = {@Index(name = "index_reservation",  columnList="reservation_id", unique = true)})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Checkout extends BaseEntity{

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private LocalDateTime holdEndTime;

    private boolean returned;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_copy_id")
    private BookCopy bookCopy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id")
    private User borrower;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")

    private Reservation reservation;

}