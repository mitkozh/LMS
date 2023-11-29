// save-filters-mobile.ts
import { stats as statsWidget } from 'instantsearch.js/es/widgets';

const createSaveFiltersMobile = () => {
  return statsWidget({
    container: '[data-widget="save-filters-mobile"]',
    templates: {
      text: `
        <button class="button button-primary">
          See {{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} results
        </button>
      `,
    },
  });
};

export { createSaveFiltersMobile };
