// metascore-slider.ts
import { panel, rangeSlider } from 'instantsearch.js/es/widgets';
import { collapseButtonText } from './panel';

const createMetascoreRangeSlider = () => {
  const metascoreRangeSlider = panel({
    templates: {
      header: 'Metascore',
      collapseButtonText,
    },
    collapsed: () => false,
  })(rangeSlider);

  return metascoreRangeSlider({
    container: '[data-widget="metascore-range"]', // Change the container selector accordingly
    attribute: 'metascore', // Change the attribute to the one corresponding to Metascore in your dataset
    pips: false,
    tooltips: {
      format(value: number) {
        return `${Math.round(value).toLocaleString()}`;
      },
    },
  });
};

export { createMetascoreRangeSlider };
