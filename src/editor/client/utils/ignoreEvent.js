export default function ignoreEvent (e) {
  console.log(e)
  e.preventDefault()
  e.stopPropagation()
  return false
}
