import { KeycloakProfile } from 'keycloak-js';
import { createReducer, on } from '@ngrx/store';
import { login, logout, setUserProfile } from './auth.actions';
import { initialState } from './auth.state';

export const authReducer = createReducer(
  initialState,
  on(login, (state, { userProfile, isLoggedIn }) => {
    return {
      ...state,
      userProfile,
      isLoggedIn,
    };
  }),  on(logout, (state) => ({ ...state, isLoggedIn: false, userProfile: null })),
  on(setUserProfile, (state, { userProfile }) => ({ ...state, userProfile }))
);
