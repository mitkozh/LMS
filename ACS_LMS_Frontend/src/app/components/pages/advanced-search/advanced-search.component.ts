import { ImageService } from './../../../core/image.service';
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  SecurityContext,
  ViewEncapsulation,
} from '@angular/core';
import instantsearch, { BaseHit, Renderer } from 'instantsearch.js';
import Searchkit, { SearchkitConfig } from 'searchkit';
import SearchkitInstantsearchClient from '@searchkit/instantsearch-client';
import { createActorRefinementList } from './actors-filters';
import { createRatingRangeSlider } from './imdb-rating';
import { createMetascoreRangeSlider } from './matascore-range';
import { createSortBy } from './sort-by';
import { createPagination } from './pagination';
import { createClearFiltersEmptyResults } from './clear-filters-empty';
import { createHitsPerPage } from './hits-per-page';
import { configuration } from './configuration';
import { clearFiltersMobile } from './clear-filters-mobile';
import { createSaveFiltersMobile } from './save-filters-mobile';
import { createResultsNumberMobile } from './results-number-mobile';
import { searchBox as searchBoxWidget } from 'instantsearch.js/es/widgets';
import { createSearchBox } from './search-box';
import { createTypeHierarchicalMenu } from './types';
import { createMoviesHits } from './movies';
import { createClearFilters } from './clear-filters';
import { createAuthorRefinementList } from './authors-filters';
import { createCategoriesHierarchicalMenu } from './categories';
import { createBooksHits } from './books';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, map, of } from 'rxjs';
import { connectHits } from 'instantsearch.js/es/connectors';
import {
  HitsConnectorParams,
  HitsRenderState,
} from 'instantsearch.js/es/connectors/hits/connectHits';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: [
    './advanced-search.component.scss',
    './range-slider.scss',
    './theme.css',
    './app-mobile.scss',
    './books.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AdvancedSearchComponent implements OnInit {
  hitts: any[] = [];

  constructor(
    private imageService: ImageService,
    private domSanitizer: DomSanitizer,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      const books = createBooksHits(this.imageService, this.domSanitizer);

      const config: SearchkitConfig = {
        connection: {
          host: 'http://localhost:9200',
        },
        search_settings: {
          highlight_attributes: ['book_title'],
          search_attributes: [
            { field: 'book_title', weight: 3 },
            'description', 'authors.name.keyword'
          ], 
          result_attributes: [
            'book_title',
            'authors',
            'coverPhoto',
            'description',
            'hierarchicalCategories',
            'categories',
            'image_id',
          ],
          facet_attributes: [
            {
              attribute: 'authors.name',
              field: 'authors.name.keyword',
              type: 'string',
            },
            // { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' },
            // { attribute: 'metascore', type: 'numeric', field: 'metascore' },
            {
              attribute: 'hierarchicalCategories.lvl0',
              field: 'hierarchicalCategories.lvl0.keyword',
              type: 'string',
            },
            {
              attribute: 'hierarchicalCategories.lvl1',
              field: 'hierarchicalCategories.lvl1.keyword',
              type: 'string',
            },
            // { attribute: 'categories', field: 'categories.keyword', type: 'string' }, // Added a facet for 'categories'
          ],
          sorting: {
            default: {
              field: '_score',
              order: 'desc',
            },
            _book_title_desc: {
              field: 'book_title.keyword',
              order: 'desc',
            },
          },
          snippet_attributes: ['description'],
          query_rules: [],
        },
      };

      const searchkitClient = new Searchkit(config);
      const searchClient = SearchkitInstantsearchClient(searchkitClient);
      const search = instantsearch({
        indexName: 'books',
        searchClient: searchClient as any,
      });

      const searchBox = createSearchBox();
      const sortBy = createSortBy();
      const categories = createCategoriesHierarchicalMenu();
      const authors = createAuthorRefinementList();
      const pagination = createPagination();
      const clearFilters = createClearFilters();
      const clearFiltersEmptyResults = createClearFiltersEmptyResults();
      const hitsPerPage = createHitsPerPage();
      const saveFiltersMobile = createSaveFiltersMobile();
      const resultsNumberMobile = createResultsNumberMobile();

      search.addWidgets([
        searchBox,
        categories,
        authors,
        sortBy,
        books,
        pagination,
        clearFilters,
        clearFiltersEmptyResults,
        hitsPerPage,
        configuration,
        clearFiltersMobile,
        saveFiltersMobile,
        resultsNumberMobile,
      ]);

      search.start();

      search.on('render', () => {
        const hitsContainer = document.querySelector('[data-widget="hits"]');
        if (hitsContainer) {
          const imageElements =
            hitsContainer.querySelectorAll('img.cover-photo');
          imageElements.forEach((imageElement) => {
            const imageId = imageElement.getAttribute('_imageId');
            if (imageId) {
              const imageIdInt: number = +imageId;
              this.getPhoto(imageIdInt).subscribe((image) => {
                imageElement.setAttribute('src', image);
              });
            }
          });
        }
      });
    });
  }
  getPhoto(imageId: number): Observable<string> {
    if (imageId) {
      return this.imageService.getImage(imageId).pipe(
        map((res) => {
          return URL.createObjectURL(res);
        })
      );
    } else {
      return of();
    }
  }
}
