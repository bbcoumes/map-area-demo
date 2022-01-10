import { ACTIONS } from "./Constants";

const initialState = {
  currentArea: 0,
  currentNominalPower: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_AREA:
      return {
        ...state,
        currentArea: action.payload,
      };
    case ACTIONS.UPDATE_POWER:
      return {
        ...state,
        currentNominalPower: action.payload,
      };
    default:
      throw new Error();
  }
}

export { initialState, reducer };
