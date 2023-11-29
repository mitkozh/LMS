import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: 'books',
        icon: 'fal fa-book',
        label: 'Books',
        expanded: true,
        items: [
            {
                routeLink: 'books',
                label: 'Overview',
            },
            {
                routeLink: 'books/categories',
                label: 'Categories',
            },
            {
                routeLink: 'books/editors-picks',
                label: 'Editors\'s Picks',
            }
        ]
    },
    {
        routeLink: 'statistics',
        icon: 'fal fa-chart-bar',
        label: 'Statistics'
    },
    {
        routeLink: 'coupens',
        icon: 'fal fa-tags',
        label: 'Coupens',
        items: [
            {
                routeLink: 'coupens/list',
                label: 'List Coupens'
            },
            {
                routeLink: 'coupens/create',
                label: 'Create Coupens'
            }
        ]
    },
    {
        routeLink: 'settings',
        icon: 'fal fa-cog',
        label: 'Settings',
        expanded: true,
        items: [
            {
                routeLink: 'settings/profile',
                label: 'Profile'
            },
            {
                routeLink: 'settings/customize',
                label: 'Customize'
            }
        ]
    },
];