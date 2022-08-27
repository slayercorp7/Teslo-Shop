import { UiState } from './';

type UiType = { type: '[UI] - toggleMenu' };

export const uiReducer = (state: UiState, action: UiType) : UiState=> {
  switch (action.type) {
    case '[UI] - toggleMenu':
      return {
               ...state,
                isMenuOpen: !state.isMenuOpen
              };

    default:
      return state;
  }
};