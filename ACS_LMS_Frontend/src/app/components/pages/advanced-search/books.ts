import { SafeUrl } from '@angular/platform-browser';
import { hits } from 'instantsearch.js/es/widgets';
import { ImageService } from 'app/core/image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, forkJoin, map, of } from 'rxjs';

export const createBooksHits = (
  imageService: ImageService,
  sanitizer: DomSanitizer
) => {
  return hits({
    container: '[data-widget="hits"]',
    templates: {
      item(hit) {
        const bookTitle = hit['book_title'];
        const bookLink = `/books/${encodeURIComponent(bookTitle)}`;
        const imageId = hit['image_id'] ? hit['image_id'] : '';
        return `
        <article class="hit">
      <a href="${bookLink}" class="card-link"></a>
      <div class="upper">
        <div class="colored-container"></div>
        <div class="image-wrapper">
          <img src='' _imageId="${imageId}" class="cover-photo" alt="${bookTitle}">
        </div>
      </div>
      <div class="middle">
        <p class="book-title">
          ${bookTitle}
        </p>
        <a class="author-link">
          ${hit['authors'][0].name}
        </a>
      </div>
      <div class="lower"></div>
    </article>
        `;
      },
      empty(searchResults) {
        const hasRefinements = searchResults.getRefinements().length > 0;
        const description = hasRefinements
          ? 'Try to reset your applied filters.'
          : 'Please try another query.';

        return `
          <div class="hits-empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="138"
              height="138"
              class="hits-empty-state-image"
            >
              <!-- ... (unchanged) ... -->
            </svg>

            <p class="hits-empty-state-title">
              Sorry, we can't find any matches to your query!
            </p>
            <p class="hits-empty-state-description">
              ${description}
            </p>
          </div>
        `;
      },
    },
  });
};
