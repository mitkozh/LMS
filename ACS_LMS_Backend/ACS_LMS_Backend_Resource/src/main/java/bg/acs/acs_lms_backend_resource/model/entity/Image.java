package bg.acs.acs_lms_backend_resource.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "image")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"book"}, callSuper = true)
public class Image extends BaseEntity {


    @Column(name = "file_name", length = 100, nullable = false)
    private String fileName;

    @Column(name = "content_type", length = 100, nullable = false)
    private String contentType;

    @Column(name = "data", columnDefinition = "BYTEA", nullable = false)
    private byte[] data;

    @OneToOne(mappedBy = "profilePhoto", cascade = CascadeType.MERGE)
    @JsonIgnore
    private Author author;

    @OneToOne(mappedBy = "coverPhoto")
    @JsonIgnore
    private Book book;
}