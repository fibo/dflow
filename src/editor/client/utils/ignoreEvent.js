export default function ignoreEvent (e) {
  e.preventDefault()
  e.stopPropagation()
}
