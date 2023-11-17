import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Directive({
  selector: '[hasRoles]'
})
export class HasRolesDirective implements OnChanges {
  private visible: boolean | undefined;
  private roles: string[] | undefined; // Role names as strings

  @Input() set hasRoles(roles: string[]) {
    this.roles = roles;
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private keycloakService: KeycloakService
  ) {}

  ngOnChanges(): void {
    if (!this.roles?.length) {
      return;
    }

    if (this.visible) {
      return;
    }

    const hasRole = this.roles.some(role => this.keycloakService.getUserRoles().includes(role));
    console.log(this.keycloakService.getUserRoles());
    if (hasRole) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.visible = true;
    } else {
      this.viewContainer.clear();
      this.visible = false;
    }
  }
}