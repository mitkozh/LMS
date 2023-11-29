import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Directive({
  selector: '[appIsLoggedIn]'
})
export class IsLoggedInDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private keycloak: KeycloakService
  ) {
    this.applyDirective();
  }

  async applyDirective() {
    if (await this.keycloak.isLoggedIn()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
