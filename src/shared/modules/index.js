import defaults from '../../Application/model'
import { types } from '../../Application/update'

const g = -9
const v = 3
const vR = 0.25

const nonInteractable = (shape) => (state = shape, action) => {
  switch(action.type) {
  case types.RESET:
    return shape
  default:
    return state
  }
}

const success = (state = defaults.success, action) => {
  switch (action.type) {
  case types.RESET:
    return defaults.success
  case types.FAILURE:
    return false
  case types.SUCCESS:
    return true
  default:
    return state
  }
}

const inGame = (state = defaults.inGame, action) => {
  switch (action.type) {
  case types.RESET:
    return defaults.inGame
  case types.FAILURE:
  case types.SUCCESS:
    return false
  default:
    return state
  }
}

const goals = nonInteractable(defaults.goals)
const boxes = nonInteractable(defaults.boxes)
const players = (state = defaults.players, action) => {
  let [{ x, y, rot }] = state

  switch (action.type) {
  case types.LEFT:
    x -= v
    rot -= vR
    break
  case types.RIGHT:
    x += v
    rot += vR
    break
  case types.FALL:
    y += g
    break
  case types.RESET:
    return defaults.players
  default:
    return state
  }
  return [{ x, y, rot }]
}
const firstTick = (state = defaults.firstTick, action) => {
  switch(action.type) {
  case types.RESET:
    return defaults.firstTick
  case types.FIRST_TICK:
    return false
  default:
    return state
  }
}

export default {
  firstTick,
  inGame,
  success,
  players,
  goals,
  boxes,
}
