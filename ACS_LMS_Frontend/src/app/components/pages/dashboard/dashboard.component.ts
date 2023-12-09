import { LoginModalComponent } from './../../partials/modal/login/login-modal/login-modal.component';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'environments/environment.development';
import { BookService, IStatBoxData } from 'app/core/book.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { ReservationService } from 'app/core/reservation.service';
import { ReservationDto } from 'app/shared/reservation-dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DialogService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;

  statBoxData: IStatBoxData[] = [];
  constructor(
    private bookService: BookService,
    public dialogService: DialogService,
    private readonly keycloak: KeycloakService,
    private http: HttpClient,
    private reservationService: ReservationService
  ) {}
  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  ref: DynamicDialogRef | undefined;
  reservations: any[] = [];

  public async ngOnInit() {
    this.fetchData();
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }

  showLoginModal: boolean = false;

  fetchData(): void {
    this.bookService.fetchStatBoxData().subscribe((data: IStatBoxData[]) => {
      this.statBoxData = data;
    });
  }

  openLoginModal() {
    // const modalRef = this.modalService.open(LoginModalComponent);
    this.ref = this.dialogService.open(LoginModalComponent, {
      header: 'Login',
      width: '30%',
      height: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      closeOnEscape: false,
    });

    this.ref.onClose.subscribe(() => {
      console.log('close');
    });
  }

  fetchReservations(): void {
    this.reservationService
      .getList()
      .subscribe((reservations: ReservationDto[]) => {
        this.reservations = reservations;
      });
  }
}
