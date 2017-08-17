import regexSubgraph from '../../../engine/regex/subgraph'

/**
 * Get type of node.
 *
 * @param {Object} node
 * @returns {String} nodeType
 */

export default function typeOfNode (node) {
  if (node.error) return 'InvalidNode'

  if (regexSubgraph.test(node.text)) return 'SubgraphNode'

  switch (node.text) {
    case 't':
      return 'ToggleNode'
    default:
      return 'DefaultNode'
  }
}
