package bg.acs.acs_lms_backend_resource.controller;


import bg.acs.acs_lms_backend_resource.model.dto.LanguageDto;
import bg.acs.acs_lms_backend_resource.model.entity.Language;
import bg.acs.acs_lms_backend_resource.service.LanguageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class LanguageControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LanguageService languageService;

    private Language testLanguage;

    @BeforeEach
    void setUp() {
        testLanguage = new Language("testLanguageCode");
        languageService.saveLanguage(testLanguage);
    }

    @AfterEach
    void tearDown() {
        // cleanup code here
        languageService.deleteLanguage(testLanguage);
    }

    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    public void testGetLanguages() throws Exception {
        mockMvc.perform(get("/languages"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    public void testGetLanguage() throws Exception {
        String languageCode = "testLanguageCode";
        mockMvc.perform(get("/languages/" + languageCode))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    public void testAddLanguage() throws Exception {
        LanguageDto languageDto = new LanguageDto("newLanguageCode");

        MvcResult result = mockMvc.perform(post("/languages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(languageDto))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        LanguageDto createdLanguageDto = objectMapper.readValue(result.getResponse().getContentAsString(), LanguageDto.class);

        languageService.deleteLanguage(createdLanguageDto.getLanguageCode());
    }

}
