package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.LanguageDto;
import bg.acs.acs_lms_backend_resource.model.entity.Language;
import bg.acs.acs_lms_backend_resource.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LanguageService {
    private final LanguageRepository languageRepository;

    private final ModelMapper modelMapper;

    @Cacheable(value = "languages")
    public Set<LanguageDto> getAll() {
        return languageRepository.findAll().stream().map(language -> modelMapper.map(language, LanguageDto.class)).collect(Collectors.toSet());
    }

    @CacheEvict(value = "languages", allEntries = true)
    public LanguageDto saveLanguage(LanguageDto languageDto) {
        Language language = this.modelMapper.map(languageDto, Language.class);
        language.setLanguageCode(language.getLanguageCode().toLowerCase().trim());
        languageRepository.save(language);
        return this.modelMapper.map(language, LanguageDto.class);
    }

    @Cacheable(value = "language", key = "#languageCode")
    public LanguageDto getByLanguageCodeDto(String languageCode) {
        Language language =  languageRepository.findByLanguageCodeIgnoreCase(languageCode).orElse(null);
        return this.modelMapper.map(language, LanguageDto.class);
    }

    @Cacheable(value = "language", key = "#languageCode")
    public Language getByLanguageCode(String languageCode) {
        return  languageRepository.findByLanguageCodeIgnoreCase(languageCode).orElse(null);
    }

    public Language mapLanguageDtoToLanguage(LanguageDto languageDto){
        return this.modelMapper.map(languageDto, Language.class);
    }

    @CacheEvict(value = "languages", allEntries = true)
    public Language saveLanguage(Language testLanguage) {
        return languageRepository.save(testLanguage);
    }

    @CacheEvict(value = "languages", allEntries = true)
    public void deleteLanguage(Language testLanguage) {
        languageRepository.delete(testLanguage);
    }

    @CacheEvict(value = "languages", allEntries = true)
    public void deleteLanguage(String languageCode) {
        languageRepository.deleteById(languageCode);
    }

    public Language findByLanguageCodeOrCreate(String language) {
        if (language!=null && language.length()>0) {
            return languageRepository.findByLanguageCodeIgnoreCase(language)
                    .orElse(languageRepository.saveAndFlush(new Language(language.toLowerCase())));
        }
        return null;
    }
}
