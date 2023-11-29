// rating-slider.ts
import { panel, rangeSlider } from 'instantsearch.js/es/widgets';
import { collapseButtonText } from './panel';

const createRatingRangeSlider = () => {
  const ratingRangeSlider = panel({
    templates: {
      header: 'IMDb Rating', // Change header to IMDb Rating
      collapseButtonText,
    },
    collapsed: () => false,
  })(rangeSlider);

  return ratingRangeSlider({
    container: '[data-widget="rating-range"]', // Change the container data attribute
    attribute: 'imdbrating', // Change the attribute to 'imdbrating'
    pips: false,
    tooltips: {
      format(value: number) {
        return `${value.toFixed(1)}`; // Adjust the formatting as needed
      },
    },
  });
};

export { createRatingRangeSlider };
