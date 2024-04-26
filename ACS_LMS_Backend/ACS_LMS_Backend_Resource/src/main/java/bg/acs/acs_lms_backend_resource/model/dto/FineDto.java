package bg.acs.acs_lms_backend_resource.model.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FineDto {
    private Long id;
    private double amount;
    private LocalDateTime paymentDate;
    private Long borrowerId;
    private Long bookCopyId;
}