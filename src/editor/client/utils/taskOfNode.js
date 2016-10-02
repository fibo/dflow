export default function taskOfNode (node) {
  if (node.text === 't') return 'toggle'

  return node.text
}

