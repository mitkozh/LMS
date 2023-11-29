// types.ts
import { panel, hierarchicalMenu } from 'instantsearch.js/es/widgets';
import { collapseButtonText } from './panel';

const createTypeHierarchicalMenu = () => {
  const typeHierarchicalMenu = panel({
    templates: {
      header: 'Type',
      collapseButtonText,
    },
    collapsed: () => false,
  })(hierarchicalMenu);

  return typeHierarchicalMenu({
    container: '[data-widget="types"]', 
    attributes: ['type'], // Change the attribute names accordingly
  });
};

export { createTypeHierarchicalMenu };
