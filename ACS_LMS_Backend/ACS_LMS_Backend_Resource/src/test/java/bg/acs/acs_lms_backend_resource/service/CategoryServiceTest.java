package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.CategoryWithBooksDto;
import bg.acs.acs_lms_backend_resource.model.entity.Category;
import bg.acs.acs_lms_backend_resource.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private BookService bookService;

    @InjectMocks
    private CategoryService categoryService;

    private Category category;
    private CategoryWithBooksDto categoryWithBooksDto;

    @BeforeEach
    public void setUp() {
        category = new Category();
        category.setName("Test Category");

        categoryWithBooksDto = new CategoryWithBooksDto();
        categoryWithBooksDto.setName("Test Category");
    }

    @Test
    public void getAllTest() {
        List<Category> categories = new ArrayList<>();
        categories.add(category);

        when(categoryRepository.findAll()).thenReturn(categories);
        when(modelMapper.map(any(Category.class), any())).thenReturn(categoryWithBooksDto);

        Set<CategoryWithBooksDto> returnedCategories = categoryService.getAll();

        assertEquals(1, returnedCategories.size());
        assertEquals(category.getName(), returnedCategories.iterator().next().getName());
    }

    @Test
    public void getByNameTest() {
        when(categoryRepository.findByName(anyString())).thenReturn(Optional.of(category));
        when(modelMapper.map(any(Category.class), any())).thenReturn(categoryWithBooksDto);

        CategoryWithBooksDto returnedCategory = categoryService.getByName(category.getName());

        assertEquals(category.getName(), returnedCategory.getName());
    }

    @Test
    public void saveTest() {
        when(categoryRepository.findByName(anyString())).thenReturn(Optional.empty());
        when(modelMapper.map(any(CategoryWithBooksDto.class), any())).thenReturn(category);
        when(categoryRepository.save(any(Category.class))).thenReturn(category);
        when(modelMapper.map(any(Category.class), any())).thenReturn(categoryWithBooksDto);

        CategoryWithBooksDto savedCategory = categoryService.save(categoryWithBooksDto);

        assertEquals(savedCategory.getName(), category.getName());
    }

    @Test
    public void countTest() {
        when(categoryRepository.count()).thenReturn(1L);

        Long count = categoryService.count();

        assertEquals(1L, count);
    }

    @Test
    public void existsByIdTest() {
        when(categoryRepository.existsById(anyLong())).thenReturn(true);

        boolean exists = categoryService.existsById(1L);

        assertTrue(exists);
    }

    @Test
    public void getCategoriesTest() {
        Set<Category> categories = new HashSet<>();
        categories.add(category);

        when(categoryRepository.findAll()).thenReturn(categories.stream().toList());

        Set<Category> returnedCategories = categoryService.getCategories();

        assertEquals(1, returnedCategories.size());
        assertEquals(category.getName(), returnedCategories.iterator().next().getName());
    }

    @Test
    public void saveCategoryTest() {
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        Category savedCategory = categoryService.save(category);

        assertEquals(savedCategory.getName(), category.getName());
    }

    @Test
    public void saveAllTest() {
        Set<Category> categories = new HashSet<>();
        categories.add(category);

        when(categoryRepository.saveAll(anyIterable())).thenReturn(categories.stream().toList());

        Set<Category> savedCategories = categoryService.saveAll(categories);

        assertEquals(1, savedCategories.size());
        assertEquals(category.getName(), savedCategories.iterator().next().getName());
    }

}
