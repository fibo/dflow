
" Add the following if statement in your .vimrc
"
"    if filereadable('.local.vimrc')
"      so .local.vimrc
"    endif
"""""""""""""""""""""""""""""""""""""""""""""""

" Highly recommended to install plugin https://github.com/elzr/vim-json

" JavaScript Standard Style (standardjs.com)
let b:syntastic_checkers = ['standard']

" Point syntastic checker at locally installed `standard` if it exists.
if executable('node_modules/.bin/standard')
  let b:syntastic_javascript_standard_exec = 'node_modules/.bin/standard'
endif

let g:syntastic_javascript_standard_args = "--global it --global describe"

