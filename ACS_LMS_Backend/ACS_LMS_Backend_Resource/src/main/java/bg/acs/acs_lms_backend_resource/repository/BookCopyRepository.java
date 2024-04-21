package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.entity.Book;
import bg.acs.acs_lms_backend_resource.model.entity.BookCopy;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {
    @Query("SELECT bc.book.id AS bookId, COUNT(co) AS checkoutCount " +
            "FROM BookCopy bc " +
            "INNER JOIN bc.checkouts co " +
            "GROUP BY bc.book.id " +
            "ORDER BY checkoutCount DESC")
    List<Map<String, Object>> findTopNBestSellers(PageRequest pageRequest);

    Optional<BookCopy> findFirstByBook(Book book);

    Optional<BookCopy> findByBookAndId(Book book, Long id);

    Optional<BookCopy> findFirstByBookId(Long id);


    List<BookCopy> findAllByBookTitle(String title);

    boolean existsByCallNumber(String callNumber);

    @Query("SELECT bc FROM BookCopy bc " +
            "LEFT JOIN bc.checkouts co " +
            "LEFT JOIN bc.reservations re " +
            "WHERE bc.book.id = :bookId " +
            "AND (co IS NULL OR co.endTime IS NOT NULL) " +
            "AND (re IS NULL)")
    List<BookCopy> findAvailableCopiesByBookId(@Param("bookId") Long bookId);

    List<BookCopy> findAllByBookId(Long bookId);


    boolean existsByIsbn(String isbn);

    Optional<BookCopy> findByBook(Book updatedBook);

    List<BookCopy> findAllByBookTitleAndBookId(String title, Long id);

    boolean existsByInventoryNumber(String inventoryNumber);

    Set<BookCopy> findByBookId(Long id);
}
