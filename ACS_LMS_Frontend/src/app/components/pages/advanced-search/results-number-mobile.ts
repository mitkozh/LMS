// results-number-mobile.ts
import { stats as statsWidget } from 'instantsearch.js/es/widgets';

const createResultsNumberMobile = () => {
  return statsWidget({
    container: '[data-widget="results-number-mobile"]',
    templates: {
      text: '<strong>{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}}</strong> results',
    },
  });
};

export { createResultsNumberMobile };
