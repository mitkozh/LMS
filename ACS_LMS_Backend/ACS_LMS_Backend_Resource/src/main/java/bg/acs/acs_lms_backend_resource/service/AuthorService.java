package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.AuthorShortDto;
import bg.acs.acs_lms_backend_resource.model.dto.ImageDto;
import bg.acs.acs_lms_backend_resource.model.entity.Author;
import bg.acs.acs_lms_backend_resource.model.entity.Image;
import bg.acs.acs_lms_backend_resource.repository.AuthorRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    private final ImageService imageService;
    private final ModelMapper modelMapper;

    public AuthorShortDto mapAuthorToAuthorShortDto(Author author){
        AuthorShortDto authorShortDto = modelMapper.map(author, AuthorShortDto.class);
        if (author.getProfilePhoto() != null) {
            authorShortDto.setImageId(author.getProfilePhoto().getId());
        }
        return authorShortDto;
    }
    @Transactional
    public Author mapAuthorNameToAuthor(String authorName) throws IOException {
        ImageDto imageDto = imageService.uploadLocalImage("src/main/resources/static/author-photo.png");
        Image image = imageService.getImage(imageDto.getId());
        if (authorName != null && !authorName.isEmpty()) {
            Author author = authorRepository.findFirstByName(authorName).orElse(null);
            if (author == null) {
                author = Author.builder().name(authorName).profilePhoto(image).build();
                author = authorRepository.save(author);
            }
            return author;
        } else {
            return null;
        }
    }

    public Author mapAuthorShortDtoToAuthor(AuthorShortDto authorShortDto){
        Author author = modelMapper.map(authorShortDto, Author.class);
        Optional<Image> optionalImage = imageService.findById(authorShortDto.getImageId());
        optionalImage.ifPresent(author::setProfilePhoto);
        return author;
    }


    public Set<Author> getAuthorsByIds(Set<Long> ids){
        return authorRepository.findAllByIdIsIn(ids);
    }


    public Set<AuthorShortDto> getAuthors(){
        return authorRepository.findAll().stream().map(this::mapAuthorToAuthorShortDto).collect(Collectors.toSet());
    }

    public Set<AuthorShortDto> getAuthorsByName(String name){
        return authorRepository.getAllByNameContainsIgnoreCase(name).stream().map(this::mapAuthorToAuthorShortDto).collect(Collectors.toSet());
    }

    public AuthorShortDto saveAuthor(AuthorShortDto authorShortDto) {
        Author author = mapAuthorShortDtoToAuthor(authorShortDto);
        authorRepository.save(author);
        return mapAuthorToAuthorShortDto(author);
    }

    public AuthorShortDto getAuthorByName(String name) throws IOException {
        Author author = mapAuthorNameToAuthor(name);
        return mapAuthorToAuthorShortDto(author);
    }

    public void deleteAuthor(Long id) {
        authorRepository.deleteById(id);
    }

    public AuthorShortDto getAuthorById(Long id) {
        Author author = authorRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        return mapAuthorToAuthorShortDto(author);
    }

    public AuthorShortDto updateAuthor(Long id, AuthorShortDto authorShortDto) {
        Author author = mapAuthorShortDtoToAuthor(authorShortDto);
        return mapAuthorToAuthorShortDto(authorRepository.save(author));

    }
}
