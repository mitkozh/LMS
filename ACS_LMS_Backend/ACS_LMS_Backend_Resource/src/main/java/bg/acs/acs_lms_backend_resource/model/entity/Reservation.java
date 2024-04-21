package bg.acs.acs_lms_backend_resource.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Reservation extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_copy_id", nullable = false)
    private BookCopy bookCopy;

    @Column(name = "reservation_date")
    private LocalDateTime reservationDate;


    @Column(name = "due_date")
    private LocalDateTime dueDate;


    @Column(name = "cancelled")
    private boolean cancelled = false;

    @Column(name = "activated")
    private boolean activated = false;


    @PrePersist
    public void calculateDueDate() {
        if (reservationDate != null) {
            dueDate = reservationDate.plusDays(3);
        }
    }

}
