package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.PublisherDto;
import bg.acs.acs_lms_backend_resource.model.entity.Author;
import bg.acs.acs_lms_backend_resource.model.entity.Publisher;
import bg.acs.acs_lms_backend_resource.repository.PublisherRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublisherService {

    private final PublisherRepository publisherRepository;

    private final ModelMapper modelMapper;

    public Set<PublisherDto> getAll() {
        return publisherRepository.findAll().stream().map(publisher -> modelMapper.map(publisher, PublisherDto.class)).collect(Collectors.toSet());
    }

    public Set<PublisherDto> getPublishersByName(String name) {
        return publisherRepository.getAllByNameContainsIgnoreCase(name).stream().map(publisher->modelMapper.map(publisher, PublisherDto.class)).collect(Collectors.toSet());
    }

    public PublisherDto savePublisher(PublisherDto publisherDto) {
        Publisher publisher = this.modelMapper.map(publisherDto, Publisher.class);
        publisherRepository.save(publisher);
        return this.modelMapper.map(publisher, PublisherDto.class);
    }

    public Publisher getPublisherById(long id) {
        return publisherRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public PublisherDto getPublisherByIdDto(long id) {
        Publisher publisher = publisherRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        return this.modelMapper.map(publisher, PublisherDto.class);
    }

    public Publisher findByPublisherNameOrCreate(String publisherName) {
        if (publisherName != null && publisherName.length() > 0) {
            Publisher publisher = publisherRepository.findByNameIgnoreCase(publisherName).orElse(null);
            if (publisher == null) {
                publisher = new Publisher(publisherName);
                publisher = publisherRepository.saveAndFlush(publisher);
            }
            return publisher;        }
        return null;
    }

}
