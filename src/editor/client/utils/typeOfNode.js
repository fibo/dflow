export default function typeOfNode (node) {
  if (node.error) return 'InvalidNode'

  if (node.text === 't') return 'ToggleNode'

  return 'DefaultNode'
}
