package bg.acs.acs_lms_backend_resource.repository;

import bg.acs.acs_lms_backend_resource.model.dto.LanguageDto;
import bg.acs.acs_lms_backend_resource.model.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageRepository extends JpaRepository<Language, String> {
    List<Language> findAll();

    Language findByLanguageCodeIgnoreCase(String languageCode);
}
