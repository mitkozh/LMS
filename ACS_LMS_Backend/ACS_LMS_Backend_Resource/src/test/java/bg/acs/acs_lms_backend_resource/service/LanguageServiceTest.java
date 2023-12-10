package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.LanguageDto;
import bg.acs.acs_lms_backend_resource.model.entity.Language;
import bg.acs.acs_lms_backend_resource.repository.LanguageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LanguageServiceTest {

    @Mock
    private LanguageRepository languageRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private LanguageService languageService;

    private Language language;
    private LanguageDto languageDto;

    @BeforeEach
    public void setUp() {
        language = new Language("en");
        languageDto = new LanguageDto();
        languageDto.setLanguageCode("en");
    }

    @Test
    public void testGetAll() {
        when(languageRepository.findAll()).thenReturn(Collections.singletonList(language));
        when(modelMapper.map(language, LanguageDto.class)).thenReturn(languageDto);

        Set<LanguageDto> result = languageService.getAll();

        assertEquals(1, result.size());
        verify(languageRepository, times(1)).findAll();
    }

    @Test
    public void testSaveLanguage() {
        when(modelMapper.map(languageDto, Language.class)).thenReturn(language);
        when(languageRepository.save(language)).thenReturn(language);
        when(modelMapper.map(language, LanguageDto.class)).thenReturn(languageDto);

        LanguageDto result = languageService.saveLanguage(languageDto);

        assertEquals("en", result.getLanguageCode());
        verify(languageRepository, times(1)).save(language);
    }

    @Test
    public void testGetByLanguageCodeDto() {
        when(languageRepository.findByLanguageCodeIgnoreCase("en")).thenReturn(language);
        when(modelMapper.map(language, LanguageDto.class)).thenReturn(languageDto);

        LanguageDto result = languageService.getByLanguageCodeDto("en");

        assertEquals("en", result.getLanguageCode());
        verify(languageRepository, times(1)).findByLanguageCodeIgnoreCase("en");
    }
}
