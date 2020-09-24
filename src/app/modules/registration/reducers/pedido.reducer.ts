import { ActionReducer, Action } from '@ngrx/store';
import { Pedido } from '../models/pedido.model';

export const UPDATED = 'UPDATED';

const initialState: Pedido = {}

export function PedidoReducer(state = initialState, action: Action) {
  switch (action.type) {
    case UPDATED:
      return action.payload;

    default:
      return state;
  }
}
