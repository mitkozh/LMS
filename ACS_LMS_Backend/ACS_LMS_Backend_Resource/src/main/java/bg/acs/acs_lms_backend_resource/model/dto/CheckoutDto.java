package bg.acs.acs_lms_backend_resource.model.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutDto {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime holdEndTime;
    private boolean returned;
    private Long bookCopyId;
    private UUID borrowerId;
}
