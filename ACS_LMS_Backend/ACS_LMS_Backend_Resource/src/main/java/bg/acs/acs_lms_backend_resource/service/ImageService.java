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

        return new ImageDto(savedImage.getId(), savedImage.getFileName(), savedImage.getContentType());
    }

    public ImageDto getImageDetails(Long id) throws IOException {
        Optional<Image> dbImage = imageRepository.findById(id);
        if (dbImage.isPresent()) {
            return new ImageDto(dbImage.get().getId(), dbImage.get().getFileName(), dbImage.get().getContentType());
        } else {
            throw new EntityNotFoundException("Image not found with id: " + id);
        }
    }

    public byte[] getImageData(Long id) throws IOException {
        Optional<Image> dbImage = imageRepository.findById(id);
        if (dbImage.isPresent()) {
            byte[] data = dbImage.get().getData();
            if (data != null) {
                return ImageUtility.decompressImage(data);
            } else {
                throw new IllegalArgumentException("Image data is null for id: " + id);
            }
        } else {
            throw new EntityNotFoundException("Image not found with id: " + id);
        }
    }



    private String generateUniqueFileName(String originalFileName) {
        return ((Long) System.currentTimeMillis()).toString();
    }

    @Scheduled(cron = "0 44 21 * * ?")
    @Transactional
    public void deleteUnusedImages() {
        List<Image> imagesToDelete = imageRepository.findUnusedImages();
        imageRepository.deleteAll(imagesToDelete);
    }


    public Image saveImage(Image image){
        return imageRepository.save(image);
    }


    public Image getImage(Long id) {
        Optional<Image> byId = imageRepository.findById(id);
        return byId.orElse(null);
    }

    public void deleteImage(Long id) {
        imageRepository.deleteById(id);
    }
}
