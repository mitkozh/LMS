package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.AuthorShortDto;
import bg.acs.acs_lms_backend_resource.model.entity.Author;
import bg.acs.acs_lms_backend_resource.repository.AuthorRepository;
import bg.acs.acs_lms_backend_resource.repository.ImageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthorServiceTest {

    @Mock
    private AuthorRepository authorRepository;

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private AuthorService authorService;

    private Author author;
    private AuthorShortDto authorShortDto;

    @BeforeEach
    public void setUp() {
        author = new Author();
        author.setName("Test Author");

        authorShortDto = new AuthorShortDto();
        authorShortDto.setName("Test Author");
    }


    @Test
    public void getAuthorsTest() {
        List<Author> authors = new ArrayList<>();
        authors.add(author);

        when(authorRepository.findAll()).thenReturn(authors);
        when(modelMapper.map(any(Author.class), any())).thenReturn(authorShortDto);

        Set<AuthorShortDto> returnedAuthors = authorService.getAuthors();

        assertEquals(1, returnedAuthors.size());
        assertEquals(author.getName(), returnedAuthors.iterator().next().getName());
    }

    @Test
    public void getAuthorByNameTest() {
        when(authorRepository.findByName(anyString())).thenReturn(Optional.of(author));
        when(modelMapper.map(any(Author.class), any())).thenReturn(authorShortDto);

        AuthorShortDto returnedAuthor = authorService.getAuthorByName(author.getName());

        assertEquals(author.getName(), returnedAuthor.getName());
    }

    @Test
    public void getAuthorsByNameTest() {
        List<Author> authors = new ArrayList<>();
        authors.add(author);

        when(authorRepository.getAllByNameContainsIgnoreCase(anyString())).thenReturn(authors);
        when(modelMapper.map(any(Author.class), any())).thenReturn(authorShortDto);

        Set<AuthorShortDto> returnedAuthors = authorService.getAuthorsByName(author.getName());

        assertEquals(1, returnedAuthors.size());
        assertEquals(author.getName(), returnedAuthors.iterator().next().getName());
    }

    @Test
    public void saveAuthorTest() {
        when(modelMapper.map(any(AuthorShortDto.class), any())).thenReturn(author);
        when(authorRepository.save(any(Author.class))).thenReturn(author);
        when(modelMapper.map(any(Author.class), any())).thenReturn(authorShortDto);

        AuthorShortDto savedAuthor = authorService.saveAuthor(authorShortDto);

        assertEquals(savedAuthor.getName(), author.getName());
    }
}
