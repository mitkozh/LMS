import { style } from '@angular/animations';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { take } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchValue: string | undefined;
  onLogoutClick() {
    this.keycloakService.logout();
  }
  onProfileClick() {
    throw new Error('Method not implemented.');
  }
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  isLoggedIn = false;

  canShowSearchAsOverlay = false;
  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    
    this.route.queryParams.subscribe((params) => {
      const searchQuery = params['search'];
      if (searchQuery) {
        if (searchQuery) {
          this.searchValue = searchQuery;
        }
      }
      else{
        this.searchValue = '';
      }
    });
  }

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  checkCanShowSearchAsOverlay(innerWidth: number): void {
    if (innerWidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }

  login() {
    this.keycloakService.login();
  }
  async onSearch(event: any) {
    const query = event.target.value;
    this.router.navigate(['/advanced-search'], {
      queryParams: { search: query },
    });
    await this.ngOnInit();
  }
}
