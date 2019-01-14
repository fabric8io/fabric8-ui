import { AppState } from '../appState';

export const isLoggedIn = (state: AppState) => state.authentication.isLoggedIn;

export const getAuthenticatedUserId = (state: AppState) => state.authentication.userId;
