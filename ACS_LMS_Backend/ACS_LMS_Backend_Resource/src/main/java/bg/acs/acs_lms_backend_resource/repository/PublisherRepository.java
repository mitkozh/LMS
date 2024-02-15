package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Long> {
    Set<Publisher> getAllByNameContainsIgnoreCase(String name);


    Optional<Publisher> findByNameIgnoreCase(String publisherName);


}
