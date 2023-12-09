import { style } from '@angular/animations';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  isLoggedIn = false;

  canShowSearchAsOverlay = false;
  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit(): Promise<void> {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
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
}
