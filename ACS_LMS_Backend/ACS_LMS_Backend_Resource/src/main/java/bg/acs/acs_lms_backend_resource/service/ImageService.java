package bg.acs.acs_lms_backend_resource.service;



import bg.acs.acs_lms_backend_resource.model.dto.ImageDto;
import bg.acs.acs_lms_backend_resource.model.entity.Image;
import bg.acs.acs_lms_backend_resource.repository.ImageRepository;
import bg.acs.acs_lms_backend_resource.util.ImageUtility;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ImageService {

    private final ImageRepository imageRepository;

    @Autowired
    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public ImageDto uploadImage(MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = generateUniqueFileName(originalFileName);


        Image savedImage = imageRepository.save(Image.builder()
                .fileName(uniqueFileName)
                .contentType(file.getContentType())
                .data(ImageUtility.compressImage(file.getBytes()))
                .build());

        return new ImageDto(savedImage.getFileName(), savedImage.getContentType());
    }

    public ImageDto getImageDetails(String name) throws IOException {
        Optional<Image> dbImage = imageRepository.findByFileName(name);
        if (dbImage.isPresent()) {
            return new ImageDto(dbImage.get().getFileName(), dbImage.get().getContentType());
        } else {
            throw new EntityNotFoundException("Image not found with name: " + name);
        }
    }

    public byte[] getImageData(String name) throws IOException {
        Optional<Image> dbImage = imageRepository.findByFileName(name);
        if (dbImage.isPresent()) {
            return ImageUtility.decompressImage(dbImage.get().getData());
        } else {
            throw new EntityNotFoundException("Image not found with name: " + name);
        }
    }

    private String generateUniqueFileName(String originalFileName) {
        long timestamp = System.currentTimeMillis();
        return timestamp + "_" + originalFileName;
    }

    @Scheduled(cron = "0 44 21 * * ?")
    @Transactional
    public void deleteUnusedImages() {
        List<Image> imagesToDelete = imageRepository.findUnusedImages();
        imageRepository.deleteAll(imagesToDelete);
    }



}
