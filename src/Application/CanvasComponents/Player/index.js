import CanvasComponent from '../Base'

export default class Player extends CanvasComponent {
  constructor(args) {
    super(args)
    this.rotationSpeed = 6
    this.speed = 0.15
    this.inertia = 0.99
    this.radius = 20
    this.onDie = args.onDie
  }

  destroy() {
    this.delete = true
    this.onDie()
  }

  fallIfOffGround(onGround) {
    if (!onGround) this.props.actions.fall()
  }

  render(state, actions) {
    // Controls
    if (state.keys.left && !state.collisions.left) actions.left()
    if (state.keys.right && !state.collisions.right) actions.right()
    if (!state.collisions.down) actions.fall()

    // Rotation
    if (this.rotation >= 360) this.rotation -= 360
    if (this.rotation < 0) this.rotation += 360

    // Draw
    const context = state.context
    const position = this.getRelativePosition()

    context.save()
    context.translate(position.x, position.y)
    context.rotate(this.rotation * Math.PI / 180)
    context.strokeStyle = '#ffffff'
    context.fillStyle = '#000000'
    context.lineWidth = 2
    context.beginPath()
    context.arc(0, 0, this.radius, 0, 2 * Math.PI, false)
    context.closePath()
    context.fill()
    context.stroke()
    context.restore()
  }
}
