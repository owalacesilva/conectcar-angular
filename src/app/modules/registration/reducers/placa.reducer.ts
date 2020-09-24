import { ActionReducer, Action } from '@ngrx/store';
import { Carro } from 'app/modules/registration/models/carro.model';

export const ADD = 'ADD';
export const LOAD = 'LOAD';
export const REMOVE = 'REMOVE';
export const UPDATE = 'UPDATE';

const initialState: Carro[] = []

export function PlacaReducer(state = initialState, action: Action) {
  switch (action.type) {
    case LOAD:
      return action.payload;

    case ADD:
      if (state.filter(car => car.Placa === action.payload.Placa).length) {
        return [...state];
      }
      return [ ...state, action.payload ];

    case REMOVE:
      return state.filter(data => data.Placa !== action.payload)

    case UPDATE:
      if (state.length === 0) {
        return [action.payload];
      }

      return state.map(data =>
        (data.Placa !== action.payload.Placa) ? data : action.payload);

    default:
      return state;
  }
}
