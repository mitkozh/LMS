import { AppAuthGuard } from './auth/app-auth-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { BookLibraryComponent } from './components/pages/books/book-library/book-library.component';
import { BookCategoriesComponent } from './components/pages/books/book-categories/book-categories.component';
import { CategoryDetailsComponent } from './components/pages/books/category-details/category-details.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { BookFullComponent } from './components/pages/book-full/book-full.component';
import { AdvancedSearchComponent } from './components/pages/advanced-search/advanced-search.component';
import { TranscationsComponent } from './components/pages/transcations/transcations.component';
import { AuthorFullComponent } from './components/pages/author-full/author-full.component';
import { ReservationsComponent } from './components/pages/reservations/reservations.component';
import { HasRolesDirective } from './directive/HasRoleDirective';
import { UserRole } from './shared/user-role';
import { BorrowedBooksComponent } from './components/pages/borrowed-books/borrowed-books.component';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { LibrarySettingsComponent } from './components/pages/settings/library/library-settings.component';
import { ProfileComponent } from './components/pages/settings/profile/profile.component';
import { MembersComponent } from './components/pages/members/members.component';

const routes: Routes = [
  { path: 'books', component: BookLibraryComponent },
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  //   canActivate: [AppAuthGuard],
  // },
  { path: 'books/categories', component: BookCategoriesComponent },
  { path: 'sign-in', redirectTo: 'login', pathMatch: 'full' },
  { path: 'categories/:category', component: CategoryDetailsComponent },
  { path: 'books/:title/:id', component: BookFullComponent },
  { path: 'books/:title/:id/:edition', component: BookFullComponent },
  { path: 'author/:author', component: AuthorFullComponent },
  { path: 'not-found', component: NotFoundComponent },
  {
    path: 'reservations',
    component: ReservationsComponent,
    canActivate: [AppAuthGuard],
    data: { roles: [UserRole.ROLE_ADMIN, UserRole.ROLE_LIBRARIAN] },
  },
  {
    path: 'settings/library',
    component: LibrarySettingsComponent,
    canActivate: [AppAuthGuard],
    data: { roles: [UserRole.ROLE_ADMIN] },
  },
  {
    path: 'settings/profile',
    component: ProfileComponent,
    canActivate: [AppAuthGuard],
  },
  {
    path: 'books/advanced-search',
    component: AdvancedSearchComponent,
  },
  {
    path: 'borrowed',
    component: BorrowedBooksComponent,
    canActivate: [AppAuthGuard],
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AppAuthGuard],
    data: { roles: [UserRole.ROLE_ADMIN, UserRole.ROLE_LIBRARIAN] },
  },
  {
    path: 'transactions',
    component: TranscationsComponent,
    data: { roles: [UserRole.ROLE_ADMIN, UserRole.ROLE_LIBRARIAN] },
  },
  {
    path: 'members',
    component: MembersComponent,
    data: { roles: [UserRole.ROLE_ADMIN, UserRole.ROLE_LIBRARIAN] },
  },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
