export default function typeOfNode (node) {
  if (node.error) return 'InvalidNode'

  switch (node.text) {
    case 't':
      return 'ToggleNode'
    case 'canvas':
      return 'CanvasNode'
    default:
      return 'DefaultNode'
  }
}
