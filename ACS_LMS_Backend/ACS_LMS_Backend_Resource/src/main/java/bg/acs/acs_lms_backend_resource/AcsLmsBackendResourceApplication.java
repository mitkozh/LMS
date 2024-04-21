package bg.acs.acs_lms_backend_resource;

import bg.acs.acs_lms_backend_resource.model.entity.Category;
import bg.acs.acs_lms_backend_resource.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.List;
import java.util.Set;


@SpringBootApplication
@RequiredArgsConstructor
@EnableCaching
@EnableScheduling
@Log4j2
public class AcsLmsBackendResourceApplication implements CommandLineRunner {

	private final CategoryService categoryService;


	public static void main(String[] args) {

		SpringApplication.run(AcsLmsBackendResourceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		Set<Category> initializedCategories = categoryService.getCategoriesInit();
		long categoryCount = categoryService.count();

		if (categoryService.count()==0){
			categoryService.saveAll(initializedCategories);
		}
		else if (categoryCount < initializedCategories.size()) {
			for (Category category : initializedCategories) {
				if (!categoryService.existsById(category.getId())) {
					categoryService.save(category);
				}
			}
		}

	}
}
