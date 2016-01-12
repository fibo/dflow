var React = require('React')

var UsersCount = React.createClass({
  render: () => {
    return (
      <div class="ui left labeled button" tabindex="0">
        <a class="ui basic label">
          {num}
      </a>
      <div class="ui icon button">
        <i class="users icon"></i>
     </div>
    )
  }
})

module.exports = UsersCount
