package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {
    @Override
    Optional<Fine> findById(Long aLong);
}
