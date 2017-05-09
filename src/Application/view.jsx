import * as ComponentTypes from './CanvasComponents'
import { Component, PropTypes as PT, default as React } from 'react'
import { Actions } from './update'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const cTypes = Object.keys(ComponentTypes)

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  A: 65,
  D: 68,
}

class View extends Component {
  constructor() {
    super()
    this.state = {
      screen: global.window ? {
        width: (global.window.innerWidth * 1),
        height: (global.window.innerHeight * 1),
        ratio: 1,
      } : {
        width: 0,
        height: 0,
        ratio: 1,
      },
      collisions: {
        left: 0,
        right: 0,
        down: 0,
        up: 0,
      },
      context: null,
      keys: {
        left: 0,
        right: 0,
      },
    }
    this.players = []
    this.boxes = []
    this.goals = []
  }

  componentDidMount() {
    if (window)
      window.addEventListener('resize', this.handleResize.bind(this, false))

    this.bindCanvas()
    this.startGame()

    requestAnimationFrame(() => { this.update() })
  }

  componentWillUnmount() {
    if (window)
      window.removeEventListener('resize', this.handleResize)
  }

  bindCanvas() {
    this.setState({
      context: this.canvas.getContext('2d'),
    })
  }

  startGame() {
    this.setState({
      inGame: true,
    })
    this.createObjects()
  }

  createObjects() {
    const self = this
    const center = {
      x: this.state.screen.width / 2,
      y: this.state.screen.height / 2,
    }

    cTypes
      .forEach((type) => {
        self[type] = []
        self.props.positions[type].map(
          (position) => new ComponentTypes[type]({
            position,
            center,
          })
        ).forEach((i) => {
          self.createObject(i, type)
        })
      })
  }

  handleResize() {
    if (global.window)
      this.setState({
        screen: {
          width: (global.window.innerWidth * 1),
          height: (global.window.innerHeight * 1),
          ratio: 1,
        }
      }, () => {
        this.recenterAll()
      })
  }

  handleKeys(value, e) {
    const keys = this.state.keys

    if(e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value
    if(e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value
    this.setState({
      keys
    })
  }

  update() {
    const { firstTick, inGame, actions } = this.props
    const context = this.state.context

    context.save()
    context.scale(1, 1)

    // Motion trail
    context.fillStyle = '#000'
    context.globalAlpha = 0.4
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height)
    context.globalAlpha = 1

    if (inGame) { // eslint-disable-line curly
      // Allow one frame to pass after reset
      if (firstTick) {
        this.repositionAll()
        actions.firstTick()
      } else {
        const player = this.players[0]

        // Check for goal collisions
        const hasSucceeded = this.checkCollisionsWithPlayer(player, this.goals)

        if (hasSucceeded) actions.success()
        else if (player.position.y < -300) actions.failure()

        // Check for box collisions
        this.setState({
          collisions: this.checkAllCollisionsWithPlayer(player, this.boxes),
        })

        this.repositionAll()

        // Remove or render
        this.updateObjects(this.players, 'players')
        this.updateObjects(this.goals, 'goals')
        this.updateObjects(this.boxes, 'boxes')
      }
    }

    context.restore()

    // Next frame
    requestAnimationFrame(() => { this.update() })
  }

  repositionAll() {
    const self = this

    cTypes.forEach((type) => {
      const components = self[type]
      const positions = self.props.positions[type]

      components.forEach((c, i) => {
        c.position = positions[i]
      })
    })
  }

  recenterAll() {
    const self = this
    const center = {
      x: this.state.screen.width / 2,
      y: this.state.screen.height / 2,
    }

    cTypes.forEach((type) => {
      const components = self[type]

      components.forEach((c) => {
        c.center = center
      })
    })
  }

  createObject(item, group) {
    this[group].push(item)
  }

  updateObjects(items, group) {
    let index = 0

    for (const item of items) {
      if (item.delete) this[group].splice(index, 1)
      else items[index].render(this.state, this.props.actions)
      index += 1
    }
  }

  checkCollisionsWithPlayer(player, items) {
    for (let b = items.length - 1; b > -1; --b) { // eslint-disable-line no-plusplus
      const item = items[b]
      const collider = this.checkCollision(player, item)

      if (collider) return collider
    }
    return false
  }

  checkAllCollisionsWithPlayer(player, items) {
    const sides = {}

    for (let b = items.length - 1; b > -1; --b) { // eslint-disable-line no-plusplus
      const item = items[b]
      const collider = this.checkCollision(player, item)

      if (collider) sides[collider] = true
    }
    return sides
  }

  checkCollision(player, square) {
    const x1 = player.position.x
    const x2 = square.position.x
    const y1 = player.position.y
    const y2 = square.position.y
    const dx = Math.abs(x1 - x2)
    const dy = Math.abs(y1 - y2)

    // We're assuming square shapes for what we're colliding against
    // It gives us some nice simplifications
    if(Math.max(dx, dy) <= player.radius + square.radius) {
      if (dx > dy) {
        if (x1 > x2) return 'left'
        return 'right'
      }
      if (y1 > y2) return 'down'
      return 'up'
    }
    return false
  }

  render() {
    const { success, inGame, actions } = this.props
    let endgame = null

    if (!inGame) {
      const message = success ? (
        <span style={{ color: '#fff' }} >
          Ball reached goal! Please
          <a
            href='https://github.com/eplatallc/dev-test'
            style={{ paddingLeft: 5, paddingRight: 5 }}
            >
            make a PR
          </a>
          and introduce yourself if you haven't yet!
        </span>
      ) : (
        <span style={{ color: '#fff' }} >
          Ball failed to reach goal. If you
          <a
            href='https://github.com/eplatallc/dev-test'
            style={{ paddingLeft: 5, paddingRight: 5 }}
            >
            fork the code
          </a>
          you can fix it
        </span>
      )

      endgame = (
        <div>
          <span style={{ color: '#fff' }} >
            {message}
          </span>
          <br/>
          <button
            onClick={() => actions.reset()}
            style={{ marginTop: 10 }}
            >
            <p>Try again?</p>
          </button>
        </div>
      )
    }

    return (
      <div
        onKeyDown={(e) => this.handleKeys(true, e)}
        onKeyUp={(e) => this.handleKeys(false, e)}
        tabIndex='0'
        >
        <div
          style={{
            zIndex: 5,
            width: '100%',
            textAlign: 'center',
            position: 'absolute',
            top: 30,
          }}
          >
          {endgame || (
            <span style={{ color: '#fff' }} >
              Welcome to the Eudora Global dev test.
              <br/>
              Roll the ball to the goal!
              <br/>
              Use [A][D] or [←][→] to MOVE
            </span>
          )}
        </div>
        <canvas
          height={this.state.screen.height * this.state.screen.ratio}
          ref={(r) => this.canvas = r}
          width={this.state.screen.width * this.state.screen.ratio}
          />
      </div>
    )
  }
}
View.propTypes = {
  actions: PT.object,
  firstTick: PT.bool,
  inGame: PT.bool,
  success: PT.bool
}


export const view = connect(
  (state) => ({
    firstTick: state.firstTick,
    inGame: state.inGame,
    success: state.success,
    positions: {
      boxes: state.boxes,
      goals: state.goals,
      players: state.players,
    }
  }),
  (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch),
  }),
)(View)
