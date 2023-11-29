import { createAction, props } from '@ngrx/store';
import { KeycloakProfile } from 'keycloak-js';

export const login = createAction('[Auth] Login',  props<{ userProfile: KeycloakProfile | null; isLoggedIn: boolean }>());
export const logout = createAction('[Auth] Logout');
export const setUserProfile = createAction('[Auth] Set User Profile', props<{ userProfile: KeycloakProfile | null }>());
