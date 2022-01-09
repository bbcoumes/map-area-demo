import { ACTIONS } from "./Constants";

const initialState = {
  currentArea: 0,
  currentNominalPower: 0,
  currentLat: 0,
  currentLong: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_AREA:
      return {
        ...state,
        currentArea: action.payload,
      };
    case ACTIONS.UPDATE_LAT:
      return {
        ...state,
        currentLat: action.payload,
      };
    case ACTIONS.UPDATE_LONG:
      return {
        ...state,
        currentLong: action.payload,
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
