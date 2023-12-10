package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.ImageDto;
import bg.acs.acs_lms_backend_resource.model.entity.Image;
import bg.acs.acs_lms_backend_resource.repository.ImageRepository;
import bg.acs.acs_lms_backend_resource.util.ImageUtility;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Optional;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ImageServiceTest {

    @Mock
    private ImageRepository imageRepository;

    @InjectMocks
    private ImageService imageService;

    private Image image;
    private ImageDto imageDto;

    @Spy
    private ImageUtility imageUtility;


    private MockMultipartFile file;

    @BeforeEach
    public void setUp() throws IOException {
        image = new Image();
        image.setFileName("Test Image");
        image.setData("Test Image".getBytes());

        imageDto = new ImageDto();
        imageDto.setName("Test Image");

        file = new MockMultipartFile("file", "Test Image", "image/jpeg", "Test Image".getBytes());
    }


    @Test
    public void uploadImageTest() throws IOException {
        when(imageRepository.save(any(Image.class))).thenReturn(image);

        ImageDto savedImage = imageService.uploadImage(file);

        assertEquals(savedImage.getName(), image.getFileName());
    }

    @Test
    public void getImageDetailsTest() throws IOException {
        when(imageRepository.findById(anyLong())).thenReturn(Optional.of(image));

        ImageDto returnedImage = imageService.getImageDetails(1L);

        assertEquals(returnedImage.getName(), image.getFileName());
    }


//    @Test
//    public void testGetImageData() throws IOException {
//
//        Long id = 1L;
//        Image mockImage = new Image();
//        mockImage.setData(new byte[]{1, 2, 3});
//
//        when(imageRepository.findById(any(Long.class))).thenReturn(Optional.of(mockImage));
//
//        byte[] result = imageService.getImageData(id);
//
//        assertNotNull(result, "Image data should not be null");
//        assertEquals(mockImage.getData().length, result.length, "Returned data length should match mock data length");
//    }

    @Test
    public void testGetImageData_ImageNotFound() {
        Long id = 1L;
        when(imageRepository.findById(any(Long.class))).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> imageService.getImageData(id));
    }

    @Test
    public void testGetImageData_ImageDataIsNull() {
        Long id = 1L;
        Image mockImage = new Image();
        when(imageRepository.findById(any(Long.class))).thenReturn(Optional.of(mockImage));

        assertThrows(IllegalArgumentException.class, () -> imageService.getImageData(id));
    }




}
