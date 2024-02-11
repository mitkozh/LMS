import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './components/pages/body/body.component';
import { SidenavComponent } from './components/partials/sidenav/sidenav.component';
import { BookLibraryComponent } from './components/pages/books/book-library/book-library.component';
import { VisitorsComponent } from './components/pages/visitors/visitors.component';
import { BookReservationsComponent } from './components/pages/book-reservations/book-reservations.component';
import { BorrowedBooksComponent } from './components/pages/borrowed-books/borrowed-books.component';
import { SupportComponent } from './components/pages/support/support.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { SublevelMenuComponent } from './components/partials/sidenav/sublevel-menu.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { StatBoxComponent } from './components/partials/stat-box/stat-box.component';
import { ChartComponent } from './components/partials/chart/chart.component';
import { BookRowComponent } from './components/partials/book-row/book-row.component';
import { ButtonModule } from 'primeng/button';
import { BookCardMiniComponent } from './components/partials/book-card-mini/book-card-mini.component';
import { BookCategoriesComponent } from './components/pages/books/book-categories/book-categories.component';
import { BooksGridComponent } from './components/partials/books-grid/books-grid.component';
import { AuthConfigModule } from './auth/auth-config.module';
import { AuthInterceptor } from 'angular-auth-oidc-client';
import { UnauthorizedComponent } from './components/pages/unauthorized/unauthorized.component';
import { LoginComponent } from './components/pages/login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { LoginModalComponent } from './components/partials/modal/login/login-modal/login-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppAuthGuard } from './auth/app-auth-guard';
import { HasRolesDirective } from './directive/HasRoleDirective';
import { BookAddComponent } from './components/partials/modal/book-add/book-add.component';
import { CategoryDetailsComponent } from './components/pages/books/category-details/category-details.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { AddCategoriesComponent } from './components/partials/modal/add-categories/add-categories.component';
import { SearchInputComponent } from './components/partials/search-input/search-input.component';
import { ListboxModule } from 'primeng/listbox';
import { AddAuthorComponent } from './components/partials/modal/add-author/add-author.component';
import { NgOnDestroyService } from './core/ng-on-destroy.service';
import { ChipsModule } from 'primeng/chips';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { CdkMenuModule } from '@angular/cdk/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { AddPublisherComponent } from './components/partials/modal/add-publisher/add-publisher.component';
import { AddLanguageComponent } from './components/partials/modal/add-language/add-language.component';
import { LabeledInputComponent } from './components/partials/labeled-input/labeled-input.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BOOK_SERVICE_CONFIG, BookService } from './core/book.service';
import { BookFullComponent } from './components/pages/book-full/book-full.component';
import { BookCardMediumComponent } from './components/partials/book-card-medium/book-card-medium.component';
import { OverviewComponent } from './components/pages/book-full/overview/overview.component';
import { OtherEditionsComponent } from './components/pages/book-full/other-editions/other-editions.component';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AddBookCopyComponent } from './components/partials/modal/add-book-copy/add-book-copy.component';
import {
  LANGUAGE_SERVICE_CONFIG,
  LanguageService,
} from './core/language.service';
import {
  PUBLISHER_SERVICE_CONFIG,
  PublisherService,
} from './core/publisher.service';
import {
  CATEGORY_SERVICE_CONFIG,
  CategoryService,
} from './core/category.service';
import { AUTHOR_SERVICE_CONFIG, AuthorService } from './core/author.service';
import { MoreByAuthorComponent } from './components/pages/book-full/more-by-author/more-by-author.component';
import { AdvancedSearchComponent } from './components/pages/advanced-search/advanced-search.component';
import { SearchComponent } from './components/partials/search/search.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { authReducer } from './feature-module/reducers/auth/auth.reducer';
import { AuthState } from './feature-module/reducers/auth/auth.state';
import { login, logout } from './feature-module/reducers/auth/auth.actions';
import { AuthEffects } from './feature-module/reducers/auth/auth.effects';
import { OverlayModule } from 'primeng/overlay';
import { BorrowABookComponent } from './components/pages/book-full/borrow-a-book/borrow-a-book.component';
import { TranscationsComponent } from './components/pages/transcations/transcations.component';
import { RESERVATION_SERVICE_CONFIG, ReservationService } from './core/reservation.service';
import { PaginatorModule } from 'primeng/paginator';
import { AuthorFullComponent } from './components/pages/author-full/author-full.component';
import { EditBookComponent } from './components/partials/modal/edit-book/edit-book.component';

export function initializeKeycloak(
  keycloak: KeycloakService,
  store: Store<AuthState>
) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'ACS_TEST',
        clientId: 'frontend_client',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      },
    });
}

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    BookLibraryComponent,
    VisitorsComponent,
    BookReservationsComponent,
    BorrowedBooksComponent,
    SupportComponent,
    SettingsComponent,
    SublevelMenuComponent,
    DashboardComponent,
    StatBoxComponent,
    ChartComponent,
    BookRowComponent,
    BookCardMiniComponent,
    BookCategoriesComponent,
    BooksGridComponent,
    UnauthorizedComponent,
    LoginComponent,
    LoginModalComponent,
    HasRolesDirective,
    BookAddComponent,
    CategoryDetailsComponent,
    NotFoundComponent,
    AddCategoriesComponent,
    SearchInputComponent,
    AddAuthorComponent,
    AddPublisherComponent,
    AddLanguageComponent,
    LabeledInputComponent,
    BookFullComponent,
    BookCardMediumComponent,
    OverviewComponent,
    OtherEditionsComponent,
    AddBookCopyComponent,
    MoreByAuthorComponent,
    AdvancedSearchComponent,
    SearchComponent,
    HeaderComponent,
    BorrowABookComponent,
    TranscationsComponent,
    AuthorFullComponent,
    EditBookComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgChartsModule,
    FormsModule,
    InputTextareaModule,
    CarouselModule,
    ButtonModule,
    PaginatorModule,
    AvatarModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthConfigModule,
    InputTextModule,
    NgbModule,
    DynamicDialogModule,
    KeycloakAngularModule,
    AutoCompleteModule,
    CalendarModule,
    ListboxModule,
    ChipsModule,
    FileUploadModule,
    SplitButtonModule,
    TabMenuModule,
    CardModule,
    ToolbarModule,
    TableModule,
    DividerModule,
    OverlayModule,
    CdkMenuModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: BOOK_SERVICE_CONFIG,
      useValue: { resourceEndpoint: 'books' },
    },
    {
      provide: BookService,
      useClass: BookService,
      deps: [HttpClient, BOOK_SERVICE_CONFIG],
    },
    {
      provide: LANGUAGE_SERVICE_CONFIG,
      useValue: { resourceEndpoint: 'languages' },
    },
    {
      provide: LanguageService,
      useClass: LanguageService,
      deps: [HttpClient, LANGUAGE_SERVICE_CONFIG],
    },
    {
      provide: PUBLISHER_SERVICE_CONFIG,
      useValue: { resourceEndpoint: 'publishers' },
    },
    {
      provide: PublisherService,
      useClass: PublisherService,
      deps: [HttpClient, PUBLISHER_SERVICE_CONFIG],
    },
    {
      provide: RESERVATION_SERVICE_CONFIG,
      useValue: { resourceEndpoint: 'reservations' },
    },
    {
      provide: ReservationService,
      useClass: ReservationService,
      deps: [HttpClient, RESERVATION_SERVICE_CONFIG],
    },    
    {
      provide: CATEGORY_SERVICE_CONFIG,
      useValue: { resourceEndpoint: 'categories' },
    },
    {
      provide: CategoryService,
      useClass: CategoryService,
      deps: [HttpClient, CATEGORY_SERVICE_CONFIG],
    },
    {
      provide: AUTHOR_SERVICE_CONFIG,
      useValue: { resourceEndpoint: 'authors' },
    },
    {
      provide: AuthorService,
      useClass: AuthorService,
      deps: [HttpClient, AUTHOR_SERVICE_CONFIG],
    },
    DialogService,
    AppAuthGuard,
    NgOnDestroyService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
