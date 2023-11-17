package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<Image> findByFileName(String fileName);


    @Query("SELECT i FROM Image i LEFT JOIN i.author a LEFT JOIN i.book b WHERE a IS NULL AND b IS NULL")
    List<Image> findUnusedImages();

}
