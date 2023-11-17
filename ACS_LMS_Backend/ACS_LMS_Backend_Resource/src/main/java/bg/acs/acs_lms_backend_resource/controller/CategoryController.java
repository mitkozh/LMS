package bg.acs.acs_lms_backend_resource.controller;

import bg.acs.acs_lms_backend_resource.model.dto.CategoryWithBooksDto;
import bg.acs.acs_lms_backend_resource.model.entity.Category;
import bg.acs.acs_lms_backend_resource.model.entity.Language;
import bg.acs.acs_lms_backend_resource.repository.CategoryRepository;
import bg.acs.acs_lms_backend_resource.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("categories")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping()
    public ResponseEntity<Set<CategoryWithBooksDto>> getCategories() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @PostMapping()
    public ResponseEntity<CategoryWithBooksDto> addCategory(@RequestBody CategoryWithBooksDto categoryDto) {
        return ResponseEntity.ok(categoryService.save(categoryDto));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity getCategoryByName(@PathVariable String name) {
        try {
            CategoryWithBooksDto category = categoryService.getByName(name);
            return ResponseEntity.ok(category);
        }
        catch (EntityNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getCause());
        }


    }



}
