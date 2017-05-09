
export default class CanvasComponent {
  constructor(args) {
    this.position = args.position
    this.center = args.center
  }

  getRelativePosition() {
    const { center, position } = this

    return ({
      x: center.x + position.x,
      y: center.y - position.y,
    })
  }

  recenter(center) {
    this.center = center
  }

  destroy() {
    this.delete = true
  }
}
