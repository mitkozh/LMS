package bg.acs.acs_lms_backend_resource.model.entity;

import bg.acs.acs_lms_backend_resource.model.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {

    private String email;

    @Id
    private UUID id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_pic_id", referencedColumnName = "id")
    private Image profilePic;

    private String name;

    @Enumerated(EnumType.STRING)
    private Gender gender;
}


