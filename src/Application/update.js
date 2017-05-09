
import { handleActions } from 'redux-actions'
import { initialModel } from './model'

// TYPES

export const types = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  FALL: 'FALL',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  RESET: 'RESET',
  FIRST_TICK: 'FIRST_TICK'
}

// ACTIONS

export const Actions = {
  left: () => ({ type: types.LEFT }),
  right: () => ({ type: types.RIGHT }),
  fall: () => ({ type: types.FALL }),
  success: () => ({ type: types.SUCCESS }),
  failure: () => ({ type: types.FAILURE }),
  firstTick: () => ({ type: types.FIRST_TICK }),
  reset: () => ({ type: types.RESET })
}

// UPDATE
const defaultUpdater = (state, { payload }) => ({
  ...state,
  ...payload,
})

export const update = handleActions({
  [`${types.LEFT}`]: defaultUpdater,
  [`${types.RIGHT}`]: defaultUpdater,
  [`${types.FALL}`]: defaultUpdater,
  [`${types.SUCCEED}`]: defaultUpdater,
  [`${types.FAILURE}`]: defaultUpdater,
  [`${types.RESET}`]: defaultUpdater,
  [`${types.FIRST_TICK}`]: defaultUpdater,
}, initialModel)
