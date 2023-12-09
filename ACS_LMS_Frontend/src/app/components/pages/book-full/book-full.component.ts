export type BookInfoType = { property: string; value: any };

import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable, catchError, finalize, map, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { BookService } from 'app/core/book.service';
import { ImageService } from './../../../core/image.service';
import { BookFullDto } from 'app/shared/book-full-dto';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthorShortDto } from 'app/shared/author-dto';
import { UserRole } from 'app/shared/user-role';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-book-full',
  templateUrl: './book-full.component.html',
  styleUrls: ['./book-full.component.scss'],
})
export class BookFullComponent implements OnInit {
  authors: number[] | null = null;
  title: string | null = null;
  tab: string | null = null;
  items: MenuItem[] = [];
  bookInfo: BookInfoType[] = [];
  activeItem: MenuItem | undefined;
  isLoading = false;
  book: BookFullDto | undefined;
  bookDescription: String | undefined;
  bookShortDescription: String | undefined;
  bookPhoto: SafeUrl | undefined;
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private keycloakService: KeycloakService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    this.route.paramMap
      .pipe(
        filter((params) => params.has('title')),
        switchMap(() => {
          this.title = this.route.snapshot.paramMap.get('title');
          this.tab = this.route.snapshot.queryParamMap.get('tab');
          this.handleTabChange();

          this.isLoading = true;
          return this.bookService.getBookFullByTitle(this.title || '');
        }),
        catchError(() => {
          this.router.navigate(['/not-found']);
          return [];
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((book) => {
        this.book = book;
        this.authors = this.getEntitiesById(book.authors);
        this.getPhoto(book.imageId).subscribe((photoUrl) => {
          this.bookPhoto = photoUrl;
        });
      });

    this.items = [
      {
        label: 'Overview',
        icon: 'pi pi-fw pi-home',
        command: () => this.updateTab('overview'),
      },
      {
        label: 'Other editions',
        icon: 'pi pi-fw pi-calendar',
        command: () => this.updateTab('editions'),
      },
      {
        label: 'More by authors',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.updateTab('author'),
      },
      {
        label: 'More by subject',
        icon: 'pi pi-fw pi-file',
        command: () => this.updateTab('subject'),
      },
    ];

    if (this.isLoggedIn) {
      this.items.push({
        label: 'Borrow book',
        icon: 'fal fa-user-plus',
        command: () => this.updateTab('subject'),
      });
    }

    this.activeItem =
      this.items.find((item) => item.label === this.tab) || this.items[0];
  }

  private getEntitiesById(entities: any[] | any) {
    if (Array.isArray(entities)) {
      return entities.map((el) => el.id);
    }
    return entities.id;
  }

  handleTabChange() {
    let tab = '';

    if (this.tab != null) {
      tab = this.extractBookTitleFromLink(this.tab);
    }

    const tabsNames = this.items.map((el) => el.label);

    if (!tabsNames.includes(tab)) {
      if (tab === '') {
        tab = 'overview';
      } else {
        this.router.navigate([`books/${this.title}`], {
          queryParams: { tab: 'overview' },
        });
      }
    } else {
      this.activeItem =
        this.items.find((item) => item.label === tab) || this.items[0];
    }
  }
  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
    if (event.label) {
      this.updateTab(event.label.toLowerCase());
    }
  }

  updateTab(tabName: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabName },
      queryParamsHandling: 'merge',
    });
  }
  showFullDescription = false;

  roles: typeof UserRole = UserRole;

  getPhoto(imageId: number): Observable<SafeUrl> {
    console.log(imageId);
    if (imageId) {
      return this.imageService.getImage(imageId).pipe(
        map((res) => {
          console.log(res);
          return this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(res)
          );
        })
      );
    } else {
      return of(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=='
      );
    }
  }

  private extractBookTitleFromLink(title: string): string {
    return decodeURIComponent(title);
  }

  getAuthorsHtml(authors: Set<AuthorShortDto>) {
    const authorArray = [...authors];

    return authorArray
      .map((author) => `<a href="/author/${author.id}">${author.name}</a>`)
      .join(', ');
  }
}

//test
