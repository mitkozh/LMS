package bg.acs.acs_lms_backend_resource.repository;


import bg.acs.acs_lms_backend_resource.model.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {


    Optional<Author> findByName(String author);


    List<Author> getAllByNameContainsIgnoreCase(String name);

    Set<Author> findAllByIdIsIn(Set<Long> ids);
}
