// movies.ts
import { hits } from 'instantsearch.js/es/widgets';

export const createMoviesHits = () => {
  return hits({
    container: '[data-widget="hits"]',
    templates: {
      item(hit, { html, components }) {
        return html`
          <article class="hit">
            <header class="hit-image-container">
              <img src="${hit['poster']}" alt="{{title}}" class="hit-image" />
            </header>

            <div class="hit-info-container">
              <h1>${components.Highlight({ attribute: 'title', hit })}</h1>
              <p class="hit-description">
                ${components.Snippet({ attribute: 'plot', hit })}
              </p>
            </div>
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

