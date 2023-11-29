import { KeycloakProfile } from 'keycloak-js';
import { Component, OnInit, TemplateRef } from '@angular/core';
import ModalData from './shared/modal-data';
import { KeycloakService } from 'keycloak-angular';
import { HttpClient } from '@angular/common/http';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ACS_LMS_Frontend';
  public userProfile: KeycloakProfile | null = null;
  sideNavStatus: boolean = false; 
  public isLoggedIn = false;

  constructor(
    private readonly keycloak: KeycloakService,
    private http: HttpClient
    
  ) {}

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    this.keycloak.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        this.sendRequestToServer();
      }
    });
    if (await this.keycloak.isLoggedIn()) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }

    console.log(await this.keycloak.isLoggedIn());
  }

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  async sendRequestToServer() {
    const url = `http://127.0.0.1:8082/users/save`;

    await this.http.post(url, {}).toPromise();
  }
}
