import { ActionReducer, Action } from '@ngrx/store';
import * as store from 'store';

export const CPF_STATUS = 'CPF_STATUS';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

const hasToken = !!store.get('token')

export function AuthenticationReducer(state = hasToken, action: Action) {
  switch (action.type) {
    case LOGIN:
      return (action.payload && action.payload.TokenDeSeguranca);

    case LOGOUT:
      return false;

    default:
      return state;
  }
}

const initialState: any = {
  EhCadastrado: false,
  EhUsuario: false,
  PossuiTagAtiva: false,
}

export function CheckCpfReducer(state = initialState, action: Action) {
  switch (action.type) {
    case CPF_STATUS:
      return action.payload;

    default:
      return state;
  }
}

const fbInitialState: any = {
  err: null,
  name: null,
  email: null,
}

export function FacebookAuthenticationReducer(state = fbInitialState, action: Action) {
  switch (action.type) {
    case LOGIN:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}
