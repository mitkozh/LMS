package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.dto.BookShortDto;
import bg.acs.acs_lms_backend_resource.model.entity.Book;
import bg.acs.acs_lms_backend_resource.model.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByTitle(String title);

    Set<Book> findAllByCategoriesContaining(Category category);


    Set<Book> getAllByTitleContainsIgnoreCase(String title);

    @Query("SELECT b FROM Book b JOIN b.authors a WHERE a.id IN :ids")
    List<Book> findAllByAuthorIds(@Param("ids") List<Long> ids);

    Optional<Book> findByTitleAndId(String title, Long id);

    Set<Book> findAllByDeletedIsFalse();

    Set<Book> findAllByCategoriesContainingAndDeletedIsFalse(Category category);

    Set<Book> getAllByTitleContainsIgnoreCaseAndDeletedIsFalse(String title);

    @Query("SELECT b FROM Book b JOIN b.authors a WHERE a.id IN :ids AND b.deleted = false")
    Set<Book> findAllByAuthorIdsAndDeletedIsFalse(@Param("ids") List<Long> ids);}
