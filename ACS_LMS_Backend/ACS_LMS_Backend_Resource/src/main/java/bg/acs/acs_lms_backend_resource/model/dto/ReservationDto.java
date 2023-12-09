package bg.acs.acs_lms_backend_resource.model.dto;

import bg.acs.acs_lms_backend_resource.model.entity.BookCopy;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservationDto {

    Long id;

    private String userEmail;

    private Long bookCopyId;


    private LocalDateTime reservationDate;
}
