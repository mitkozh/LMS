package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.dto.ImageDto;
import bg.acs.acs_lms_backend_resource.model.entity.Image;
import bg.acs.acs_lms_backend_resource.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ImageController {

    private final ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<ImageDto> uploadImage(@RequestParam("image") MultipartFile file)
            throws IOException {
        ImageDto image = imageService.uploadImage(file);
        return ResponseEntity.status(HttpStatus.OK)
                .body(image);
    }

    @GetMapping("/info/{name}")
    public ResponseEntity<ImageDto> getImageDetails(@PathVariable("name") String name) throws IOException {
        ImageDto image = imageService.getImageDetails(name);
        return ResponseEntity.ok(image);
    }

    @GetMapping("/{name}")
    public ResponseEntity<byte[]> getImage(@PathVariable("name") String name) throws IOException {
            byte[] imageData = imageService.getImageData(name);
        ImageDto imageDto =  imageService.getImageDetails(name);

        MediaType contentType;
        if (imageDto.getType().equalsIgnoreCase("jpeg")) {
            contentType = MediaType.IMAGE_JPEG;
        } else if (imageDto.getType().equalsIgnoreCase("png")) {
            contentType = MediaType.IMAGE_PNG;
        } else {
            contentType = MediaType.IMAGE_JPEG;
        }

        return ResponseEntity
                .ok()
                .contentType(contentType)
                .body(imageData);
    }
}
