package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.PublisherDto;
import bg.acs.acs_lms_backend_resource.model.entity.Publisher;
import bg.acs.acs_lms_backend_resource.repository.PublisherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PublisherServiceTest {

    @Mock
    private PublisherRepository publisherRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private PublisherService publisherService;

    private Publisher publisher;
    private PublisherDto publisherDto;

    @BeforeEach
    public void setUp() {
        publisher = new Publisher();
        publisher.setName("Publisher1");
        publisherDto = new PublisherDto();
        publisherDto.setName("Publisher1");
    }

    @Test
    public void testGetAll() {
        when(publisherRepository.findAll()).thenReturn(Collections.singletonList(publisher));
        when(modelMapper.map(publisher, PublisherDto.class)).thenReturn(publisherDto);

        Set<PublisherDto> result = publisherService.getAll();

        assertEquals(1, result.size());
        verify(publisherRepository, times(1)).findAll();
    }

    @Test
    public void testGetPublishersByName() {
        when(publisherRepository.getAllByNameContainsIgnoreCase("Publisher1")).thenReturn(Set.of(publisher));
        when(modelMapper.map(publisher, PublisherDto.class)).thenReturn(publisherDto);

        Set<PublisherDto> result = publisherService.getPublishersByName("Publisher1");

        assertEquals(1, result.size());
        verify(publisherRepository, times(1)).getAllByNameContainsIgnoreCase("Publisher1");
    }

    @Test
    public void testSavePublisher() {
        when(modelMapper.map(publisherDto, Publisher.class)).thenReturn(publisher);
        when(publisherRepository.save(publisher)).thenReturn(publisher);
        when(modelMapper.map(publisher, PublisherDto.class)).thenReturn(publisherDto);

        PublisherDto result = publisherService.savePublisher(publisherDto);

        assertEquals("Publisher1", result.getName());
        verify(publisherRepository, times(1)).save(publisher);
    }

    @Test
    public void testGetPublisherByIdDto() {
        when(publisherRepository.findById(1L)).thenReturn(java.util.Optional.of(publisher));
        when(modelMapper.map(publisher, PublisherDto.class)).thenReturn(publisherDto);

        PublisherDto result = publisherService.getPublisherByIdDto(1L);

        assertEquals("Publisher1", result.getName());
        verify(publisherRepository, times(1)).findById(1L);
    }
}
