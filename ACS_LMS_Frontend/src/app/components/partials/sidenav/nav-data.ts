import { UserRole } from 'app/shared/user-role';
import { INavbarData } from './helper';

const roles: typeof UserRole = UserRole;

export const navbarData: INavbarData[] = [
  {
    routeLink: 'books',
    icon: 'fal fa-book',
    label: 'Books',
    expanded: true,
    items: [
      {
        routeLink: 'advanced-search',
        label: 'Find Book',
      },
      {
        routeLink: 'books/categories',
        label: 'Book Categories',
      },
    ],
  },
  {
    routeLink: 'dashboard',
    icon: 'fal fa-chart-line',
    label: 'Dashboard',
  },
  {
    routeLink: 'my-books',
    icon: 'fal fa-bookmark',
    label: 'My Books',
  },
  {
    routeLink: 'borrowed-books',
    icon: 'fal fa-handshake',
    label: 'Borrowed Books',
  },
  {
    routeLink: 'members',
    icon: 'fal fa-users',
    label: 'Members',
    requiredRoles: [roles.ROLE_ADMIN, roles.ROLE_LIBRARIAN],
    expanded: true,
    items: [
      {
        routeLink: 'members/all',
        label: 'All Members',
      },
      {
        routeLink: 'members/add',
        label: 'Add Member',
      },
    ],
  },
  {
    routeLink: 'statistics',
    icon: 'fal fa-chart-bar',
    label: 'Statistics',
    requiredRoles: [roles.ROLE_ADMIN, roles.ROLE_LIBRARIAN],
  },
  {
    routeLink: 'transactions',
    icon: 'fal fa-exchange',
    label: 'Transactions',
    requiredRoles: [roles.ROLE_ADMIN, roles.ROLE_LIBRARIAN],
    items: [
      {
        routeLink: 'transactions/history',
        label: 'Transaction History',
      },
      {
        routeLink: 'transactions/borrow',
        label: 'Borrow Book',
      },
    ],
  },
  {
    routeLink: 'settings',
    icon: 'fal fa-cog',
    label: 'Settings',
    expanded: true,
    items: [
      {
        routeLink: 'settings/profile',
        label: 'Profile',
      },
      {
        routeLink: 'settings/library',
        requiredRoles: [roles.ROLE_ADMIN],
        label: 'Library Settings',
      },
    ],
  },
];
