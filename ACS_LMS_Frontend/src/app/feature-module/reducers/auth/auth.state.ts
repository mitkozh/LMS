import { KeycloakProfile } from 'keycloak-js';

export interface AuthState {
  isLoggedIn: boolean;
  userProfile: KeycloakProfile | null;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  userProfile: null
};
