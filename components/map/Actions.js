import { ACTIONS } from "./Constants";

export function updateArea(dispatch, areaValue) {
  dispatch({ type: ACTIONS.UPDATE_AREA, payload: areaValue });
}

export function updateNominalPower(dispatch) {
  dispatch({ type: ACTIONS.UPDATE_POWER });
}

export function updateCurrentLat(dispatch, latValue) {
  dispatch({ type: ACTIONS.UPDATE_LAT, payload: latValue });
}

export function updateCurrentLong(dispatch, longValue) {
  dispatch({ type: ACTIONS.UPDATE_LONG, payload: longValue });
}
