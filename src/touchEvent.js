export default class TouchEvent {
  target = ""
  currentTarget = ""
  touches = []
  targetTouches = []
  changedTouches = []
  preventDefault = function(){}
  stopPropagation = function(){}
  constructor(type) {
    this.type = type
  }
}