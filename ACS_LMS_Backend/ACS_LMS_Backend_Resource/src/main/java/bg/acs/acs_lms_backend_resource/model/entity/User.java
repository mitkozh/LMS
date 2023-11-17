package bg.acs.acs_lms_backend_resource.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "user")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {

    private String email;

//    @ManyToMany
//    @JoinTable(
//            name = "user_roles",
//            joinColumns = @JoinColumn(name = "user_id"),
//            inverseJoinColumns = @JoinColumn(name = "user_role_id")
//    )
//    private Set<UserRole> roles;
    @Id
    private UUID id;
}