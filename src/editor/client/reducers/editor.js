const initialState = {
  autorun: false
}

export default function (state = initialState, action) {
  const editor = Object.assign({}, state)

  switch (action.type) {
    case 'DISABLE_AUTORUN':
      editor.autorun = false
      return editor

    case 'ENABLE_AUTORUN':
      editor.autorun = true
      return editor

    default:
      return editor
  }
}
