package bg.acs.acs_lms_backend_resource.service;

import bg.acs.acs_lms_backend_resource.model.dto.CategoryWithBooksDto;
import bg.acs.acs_lms_backend_resource.model.entity.Category;
import bg.acs.acs_lms_backend_resource.repository.CategoryRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;
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

    public Long count(){
        return categoryRepository.count();
    }

    public boolean existsById(Long id){
        return categoryRepository.existsById(id);
    }


    public Set<Category> getCategories(){
        return new HashSet<>(categoryRepository.findAll());
    }

    public Category save(Category category){
        return categoryRepository.save(category);
    }


    public Set<Category> getCategoriesInit() {
        Category philosophyCategory = Category.builder()
                .name("Philosophy")
                .description("The study of fundamental nature and existence.")
                .build();

        Category technologyCategory = Category.builder()
                .name("Technology")
                .description("The application of scientific knowledge for practical purposes.")
                .build();

        Category literatureCategory = Category.builder()
                .name("Literature")
                .description("Written works, including fiction, non-fiction, and poetry.")
                .build();

        Category historyCategory = Category.builder()
                .name("History")
                .description("The study of past events and human activities.")
                .build();

        Category naturalSciencesCategory = Category.builder()
                .name("Natural Sciences")
                .description("Scientific study of the natural world.")
                .build();

        Category ethicsCategory = Category.builder()
                .name("Ethics")
                .description("The branch of philosophy that involves systematizing, defending, and recommending concepts of right and wrong conduct.")
                .parentCategory(philosophyCategory)
                .build();

        Category computerScienceCategory = Category.builder()
                .name("Computer Science")
                .description("The study of computers and computational systems.")
                .parentCategory(technologyCategory)
                .build();

        Category fictionCategory = Category.builder()
                .name("Fiction")
                .description("Imaginative works, including novels and short stories.")
                .parentCategory(literatureCategory)
                .build();

        Category ancientHistoryCategory = Category.builder()
                .name("Ancient History")
                .description("The study of historical events in the ancient world.")
                .parentCategory(historyCategory)
                .build();

        Category biologyCategory = Category.builder()
                .name("Biology")
                .description("The study of living organisms and their interactions with each other and their environments.")
                .parentCategory(naturalSciencesCategory)
                .build();

        Category mathematicsCategory = Category.builder()
                .name("Mathematics")
                .description("The abstract science of number, quantity, and space.")
                .build();

        Category astronomyCategory = Category.builder()
                .name("Astronomy")
                .description("The branch of science that deals with celestial objects, space, and the physical universe as a whole.")
                .parentCategory(naturalSciencesCategory)
                .build();

        Category chemistryCategory = Category.builder()
                .name("Chemistry")
                .description("The branch of science that deals with the composition, structure, properties, and reactions of matter.")
                .parentCategory(naturalSciencesCategory)
                .build();

        Category physicsCategory = Category.builder()
                .name("Physics")
                .description("The branch of science that deals with matter, energy, motion, and force.")
                .parentCategory(naturalSciencesCategory)
                .build();

        Category geographyCategory = Category.builder()
                .name("Geography")
                .description("The study of the physical features of the earth and its atmosphere.")
                .build();

        Category politicalScienceCategory = Category.builder()
                .name("Political Science")
                .description("The systematic study of governance, politics, and political behavior.")
                .build();

        Category psychologyCategory = Category.builder()
                .name("Psychology")
                .description("The scientific study of the mind and behavior.")
                .build();

        Category sociologyCategory = Category.builder()
                .name("Sociology")
                .description("The study of society, patterns of social relationships, and culture.")
                .build();

        Category economicsCategory = Category.builder()
                .name("Economics")
                .description("The branch of knowledge concerned with the production, consumption, and transfer of wealth.")
                .build();

        Category educationCategory = Category.builder()
                .name("Education")
                .description("The process of facilitating learning, or the acquisition of knowledge, skills, values, morals, beliefs, and habits.")
                .build();

        Category languageCategory = Category.builder()
                .name("Language")
                .description("The method of human communication, either spoken or written, consisting of the use of words in a structured and conventional way.")
                .build();

        Category religionCategory = Category.builder()
                .name("Religion")
                .description("The belief in and worship of a superhuman controlling power, especially a personal God or gods.")
                .build();

        Category artsCategory = Category.builder()
                .name("Arts")
                .description("Various branches of creative activity, such as painting, music, literature, and dance.")
                .build();

        Category technologyEngineeringCategory = Category.builder()
                .name("Technology & Engineering")
                .description("The practical application of scientific knowledge in the design, construction, and operation of structures, machines, systems, and devices.")
                .parentCategory(technologyCategory)
                .build();

        Category medicalScienceCategory = Category.builder()
                .name("Medical Science")
                .description("The branch of science concerned with the maintenance of health and the prevention, alleviation, or cure of disease.")
                .build();


        return new HashSet<>(Set.of(
                philosophyCategory, technologyCategory, literatureCategory, historyCategory, naturalSciencesCategory,
                ethicsCategory, computerScienceCategory, fictionCategory, ancientHistoryCategory, biologyCategory,
                mathematicsCategory, astronomyCategory, chemistryCategory, physicsCategory, geographyCategory,
                politicalScienceCategory, psychologyCategory, sociologyCategory, economicsCategory, educationCategory,
                languageCategory, religionCategory, artsCategory, technologyEngineeringCategory, medicalScienceCategory
        ));
    }


    public Set<Category> saveAll(Set<Category> initializedCategories) {
        return new HashSet<>(categoryRepository.saveAll(initializedCategories));
    }
}
