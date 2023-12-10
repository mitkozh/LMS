package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.dto.AuthorShortDto;
import bg.acs.acs_lms_backend_resource.model.entity.Author;
import bg.acs.acs_lms_backend_resource.model.entity.Image;
import bg.acs.acs_lms_backend_resource.service.AuthorService;
import bg.acs.acs_lms_backend_resource.service.ImageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jdk.jfr.ContentType;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthorControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuthorService authorService;

    @Autowired
    private ImageService imageService;

    private Image managedImage;
    private AuthorShortDto authorShortDto;

    @BeforeEach
    public void setup() {

        Image profilePhoto = new Image();
        profilePhoto.setFileName("Test Image");
        profilePhoto.setContentType("image/jpeg");
        profilePhoto.setData(new byte[0]);
        Image savedImage = imageService.saveImage(profilePhoto);

        managedImage = imageService.getImage(savedImage.getId());

        Author author = new Author();
        author.setName("Test Author");
        author.setDescription("Test Description");
        author.setProfilePhoto(managedImage);
        authorShortDto = authorService.mapAuthorToAuthorShortDto(author);
        authorShortDto =  authorService.saveAuthor(authorShortDto);
    }

    @AfterEach
    public void tearDown() {
        authorService.deleteAuthor(authorShortDto.getId());
        imageService.deleteImage(managedImage.getId());
    }


    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    public void getAuthorsTest() throws Exception {
        mockMvc.perform(get("/authors")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    public void getAuthorsByNameTest() throws Exception {
        String name = "test";
        mockMvc.perform(get("/authors/all/" + name)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    public void getAuthorByNameTest() throws Exception {
        String name = "test";
        mockMvc.perform(get("/authors/name/" + name)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    public void addAuthorTest() throws Exception {

        Image profilePhoto = new Image();
        profilePhoto.setFileName("Test Image");
        profilePhoto.setContentType("image/jpeg");
        profilePhoto.setData(new byte[0]);
        Image savedImage = imageService.saveImage(profilePhoto);

        Image managedImage2 = imageService.getImage(savedImage.getId());

        AuthorShortDto authorShortDto2 = new AuthorShortDto();
        authorShortDto2.setName("Test Author");
        authorShortDto2.setDescription("Test Description");
        authorShortDto2.setImageId(managedImage2.getId());

        MvcResult result = mockMvc.perform(post("/authors")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(authorShortDto2)))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        AuthorShortDto createdAuthor = new ObjectMapper().readValue(response, AuthorShortDto.class);

        authorService.deleteAuthor(createdAuthor.getId());
        imageService.deleteImage(managedImage2.getId());
    }


}
