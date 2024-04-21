package bg.acs.acs_lms_backend_resource.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutAddDto {

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "Hold end time is required")
    private LocalDateTime holdEndTime;

    @NotNull(message = "Book ID is required")
    private Long bookId;

    private Long bookCopyId;

    @NotNull(message = "User is required")
    private String user;

    private Long reservationId;

}
