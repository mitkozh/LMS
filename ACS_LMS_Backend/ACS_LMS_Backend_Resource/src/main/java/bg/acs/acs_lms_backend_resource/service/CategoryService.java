package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.CategoryWithBooksDto;
import bg.acs.acs_lms_backend_resource.model.entity.Category;
import bg.acs.acs_lms_backend_resource.repository.CategoryRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final ModelMapper modelMapper;

    private final BookService bookService;


    public Set<CategoryWithBooksDto> getAll() {
        return categoryRepository.findAll().stream().map(this::mapCategoryToCategoryWithBooksDto).collect(Collectors.toSet());
    }

    public CategoryWithBooksDto getByName(String name) {
        Category category =  categoryRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Category not found with name: " + name));
        return mapCategoryToCategoryWithBooksDto(category);
    }


    public CategoryWithBooksDto save(CategoryWithBooksDto categoryWithBooksDto){
        if (categoryRepository.findByName(categoryWithBooksDto.getName()).isEmpty()){
            Category category =modelMapper.map(categoryWithBooksDto, Category.class);
            categoryRepository.save(category);
            return mapCategoryToCategoryWithBooksDto(category);
        }
        throw new EntityExistsException("Category with the same name exists" );


    }


    public CategoryWithBooksDto mapCategoryToCategoryWithBooksDto(Category category){
        CategoryWithBooksDto categoryWithBooksDto = modelMapper.map(category, CategoryWithBooksDto.class);
        categoryWithBooksDto.setBooks(bookService.getBooksByCategory(category));
        return categoryWithBooksDto;
    }


}
