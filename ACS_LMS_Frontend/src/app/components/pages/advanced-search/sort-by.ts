// sort-by.ts
import { sortBy as sortByWidget } from 'instantsearch.js/es/widgets';
const items = [
  {
    label: 'Default',
    value: 'books',
  },
  {
    label: 'Book Title',
    value: '_book_title_desc',
  },
];

export const createSortBy = () => {
  return sortByWidget({
    container: '[data-widget="sort-by"]',
    items,
  });
};

export function getFallbackSortByRoutingValue(
  sortByValue: string
): string | undefined {
  if (items.map((item) => item.value).indexOf(sortByValue) !== -1) {
    return sortByValue;
  }

  return undefined;
}
