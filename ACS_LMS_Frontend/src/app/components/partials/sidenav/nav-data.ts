import { UserRole } from 'app/shared/user-role';
import { INavbarData } from './helper';

const roles: typeof UserRole = UserRole;

export const navbarData: INavbarData[] = [
  {
    routeLink: 'books',
    icon: 'fal fa-book',
    label: 'Books',
    expanded: false,
    items: [
      {
        routeLink: 'books',
        label: 'Books Overview',
      },
      {
        routeLink: 'books/advanced-search',
        label: 'Find Books',
      },
      {
        routeLink: 'books/categories',
        label: 'Book Categories',
      },
    ],
  },
  {
    routeLink: 'reservations',
    icon: 'fal fa-tag',
    label: 'Reservations',
    requiredRoles: [roles.ROLE_ADMIN, roles.ROLE_LIBRARIAN],
  },
  {
    routeLink: 'checkout',
    icon: 'fal fa-exchange',
    label: 'Checkout',
    requiredRoles: [roles.ROLE_ADMIN, roles.ROLE_LIBRARIAN],
  },
  {
    routeLink: 'borrowed',
    icon: 'fal fa-handshake',
    label: 'Borrowed',
  },
  {
    routeLink: 'members',
    icon: 'fal fa-users',
    label: 'Members',
    requiredRoles: [roles.ROLE_ADMIN, roles.ROLE_LIBRARIAN],
  },
  // {
  //   routeLink: 'statistics',
  //   icon: 'fal fa-chart-bar',
  //   label: 'Statistics',
  //   requiredRoles: [roles.ROLE_ADMIN, roles.ROLE_LIBRARIAN],
  // },
  {
    routeLink: 'transactions/check-outs',
    icon: 'fal fa-table',
    label: 'Transactions',
    requiredRoles: [roles.ROLE_ADMIN, roles.ROLE_LIBRARIAN],
    items: [
      {
        routeLink: 'transactions/check-outs',
        label: 'Transaction History',
      },
      {
        routeLink: 'transactions/fines',
        label: 'Borrow Book',
      },
    ],
  },
  {
    routeLink: 'settings/profile',
    icon: 'fal fa-cog',
    label: 'Settings',
    expanded: false,
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
