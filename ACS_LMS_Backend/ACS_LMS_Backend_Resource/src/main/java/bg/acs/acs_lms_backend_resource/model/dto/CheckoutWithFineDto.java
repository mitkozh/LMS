package bg.acs.acs_lms_backend_resource.model.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutWithFineDto {

    private Long id;
    private String bookName;
    private Long bookCopyId;
    private String userEmail;
    private double fineAmount;
    private LocalDateTime startTime;
    private LocalDateTime holdEndTime;
    private boolean late;


}
