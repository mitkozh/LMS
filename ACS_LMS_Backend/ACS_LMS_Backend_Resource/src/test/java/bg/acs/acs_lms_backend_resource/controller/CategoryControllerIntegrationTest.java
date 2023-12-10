package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.dto.CategoryWithBooksDto;
import bg.acs.acs_lms_backend_resource.model.entity.Category;
import bg.acs.acs_lms_backend_resource.service.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CategoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryService categoryService;

    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setName("Test Category");
        categoryService.save(testCategory);
    }

    @AfterEach
    void tearDown() {
        categoryService.delete(testCategory);
    }

    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    public void testGetCategories() throws Exception {
        mockMvc.perform(get("/categories"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    public void testAddCategory() throws Exception {
        CategoryWithBooksDto categoryDto = new CategoryWithBooksDto();
        categoryDto.setName("Test category");

        MvcResult result = mockMvc.perform(post("/categories")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryDto)))
                .andExpect(status().isOk())
                .andReturn();


        CategoryWithBooksDto createdCategoryDto = objectMapper.readValue(result.getResponse().getContentAsString(), CategoryWithBooksDto.class);
        categoryService.deleteCategory(createdCategoryDto);
    }


    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    public void testGetCategoryByName() throws Exception {
        String name = "Test Category";
        mockMvc.perform(get("/categories/name/" + name))
                .andExpect(status().isOk());
    }
}
