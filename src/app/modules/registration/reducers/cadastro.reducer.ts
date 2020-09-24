import { ActionReducer, Action } from '@ngrx/store';
import { Cadastro } from 'app/modules/registration/models/cadastro.model';

export const UPDATE = 'UPDATE';

const initialState: Cadastro = {}

export function CadastroReducer(state = initialState, action: Action) {
  switch (action.type) {
    case UPDATE:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}
