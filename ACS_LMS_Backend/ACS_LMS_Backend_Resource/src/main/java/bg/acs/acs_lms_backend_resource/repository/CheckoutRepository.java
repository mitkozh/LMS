package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.entity.Book;
import bg.acs.acs_lms_backend_resource.model.entity.Checkout;
import bg.acs.acs_lms_backend_resource.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Set<Checkout> findByBookCopyIdAndReturnedFalse(Long id);

    Checkout findByBorrowerAndReturnedFalseAndAndEndTimeNullAndBookCopy_Book(User user, Book book);
}
