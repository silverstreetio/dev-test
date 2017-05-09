import CanvasComponent from '../Base'

export default class Box extends CanvasComponent {
  constructor(args) {
    super(args)
    this.radius = 30
  }

  render(state) {
    // Draw
    const radius = this.radius
    const context = state.context
    const position = this.getRelativePosition()

    context.save()
    context.translate(position.x, position.y)
    context.rotate(this.rotation * Math.PI / 180)
    context.strokeStyle = '#ffffff'
    context.fillStyle = '#000000'
    context.lineWidth = 2
    context.beginPath()
    context.lineTo(radius, radius)
    context.lineTo(radius, -radius)
    context.lineTo(-radius, -radius)
    context.lineTo(-radius, radius)
    context.closePath()
    context.fill()
    context.stroke()
    context.restore()
  }
}
