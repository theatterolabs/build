import { globalvariables } from './globalvariables'

function scalecanvas(isRoot) {
  let dimenson = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
  let _canvaswidth, _canvasheight
  if (isRoot) {
    _canvaswidth = this.game.canvas.width
    _canvasheight = this.game.canvas.height
    this._canvaswidth = this.game.canvas.width
    this._canvasheight = this.game.canvas.height
  } else {
    _canvaswidth = this.scene.game.canvas.width
    _canvasheight = this.scene.game.canvas.height
    this._canvaswidth = this.scene.game.canvas.width
    this._canvasheight = this.scene.game.canvas.height
  }
  this.topspace =
    (Math.abs(
      parseFloat(document.querySelectorAll('canvas')[0].style.marginTop)
    ) /
      dimenson.width) *
      _canvaswidth +
    (globalvariables.isIphone ? 130 : 0)
  this.leftspace =
    (Math.abs(
      parseFloat(document.querySelectorAll('canvas')[0].style.marginLeft)
    ) /
      dimenson.height) *
    _canvasheight
  this.scaling =
    (window.innerHeight / (window.innerWidth + this.leftspace * 2)) * 0.85 //window.innerWidth
  this.moveSteps = 0

  if (!globalvariables.isMobile) {
    this.leftspace = 0
    this.topspace = 0
    this.scaling = 1.4
  }
}

export { scalecanvas }
