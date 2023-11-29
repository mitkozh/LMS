// hits-per-page.ts
import { hitsPerPage as hitsPerPageWidget } from 'instantsearch.js/es/widgets';

const createHitsPerPage = () => {
  const items = [
    {
      label: '16 hits per page',
      value: 16,
      default: true,
    },
    {
      label: '32 hits per page',
      value: 32,
    },
    {
      label: '64 hits per page',
      value: 64,
    },
  ];

  return hitsPerPageWidget({
    container: '[data-widget="hits-per-page"]',
    items,
  });
};

const getFallbackHitsPerPageRoutingValue = (hitsPerPageValue: string): string | undefined => {
  const items = [
    {
      label: '16 hits per page',
      value: 16,
      default: true,
    },
    {
      label: '32 hits per page',
      value: 32,
    },
    {
      label: '64 hits per page',
      value: 64,
    },
  ];

  if (items.map((item) => item.value).indexOf(Number(hitsPerPageValue)) !== -1) {
    return hitsPerPageValue;
  }

  return undefined;
};

export { createHitsPerPage, getFallbackHitsPerPageRoutingValue };
