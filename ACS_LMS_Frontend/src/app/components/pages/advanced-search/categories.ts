// types.ts
import { panel, hierarchicalMenu } from 'instantsearch.js/es/widgets';
import { collapseButtonText } from './panel';

const createCategoriesHierarchicalMenu = () => {
  const typeHierarchicalMenu = panel({
    templates: {
      header: 'Categories',
      collapseButtonText,
    },
    collapsed: () => false,
  })(hierarchicalMenu);

  return typeHierarchicalMenu({
    container: '[data-widget="categories"]', 
    attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1'], 
  });
};

export { createCategoriesHierarchicalMenu };
