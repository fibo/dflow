export default function typeOfNode (node) {
  if (node.text === 't') return 'ToggleNode'

  return 'DefaultNode'
}
