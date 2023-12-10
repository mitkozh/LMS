package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.AuthorShortDto;
import bg.acs.acs_lms_backend_resource.model.entity.Author;
import bg.acs.acs_lms_backend_resource.model.entity.Image;
import bg.acs.acs_lms_backend_resource.repository.AuthorRepository;
import bg.acs.acs_lms_backend_resource.repository.ImageRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    private final ImageRepository imageRepository;
    private final ModelMapper modelMapper;

    public AuthorShortDto mapAuthorToAuthorShortDto(Author author){
        AuthorShortDto authorShortDto = modelMapper.map(author, AuthorShortDto.class);
        if (author.getProfilePhoto() != null) {
            authorShortDto.setImageId(author.getProfilePhoto().getId());
        }
        return authorShortDto;
    }
    public Author mapAuthorNameToAuthor(String authorName) {
        return
               authorRepository.findByName(authorName)
                        .orElse(Author.builder().name(authorName).build());
    }

    public Author mapAuthorShortDtoToAuthor(AuthorShortDto authorShortDto){
        Author author = modelMapper.map(authorShortDto, Author.class);
        Optional<Image> optionalImage = imageRepository.findById(authorShortDto.getImageId());
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

    public AuthorShortDto getAuthorByName(String name) {
        Author author = mapAuthorNameToAuthor(name);
        return mapAuthorToAuthorShortDto(author);
    }

    public void deleteAuthor(Long id) {
        authorRepository.deleteById(id);
    }
}
