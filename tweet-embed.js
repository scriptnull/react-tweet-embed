import React from 'react'
import PropTypes from 'prop-types'

const callbacks = []

function addScript (src, cb) {
  if (callbacks.length === 0) {
    callbacks.push(cb)
    var s = document.createElement('script')
    s.setAttribute('src', src)
    s.onload = () => callbacks.forEach((cb) => cb())
    document.body.appendChild(s)
  } else {
    callbacks.push(cb)
  }
}

class TweetEmbed extends React.Component {
  renderTweet (id) {
    window.twttr.ready().then(({ widgets }) => {
      // createTweetEmbed appends the widget as child to the container
      // So, delete the children of the container before creating the widget
      if (this._div) { this._div.innerHTML = '' }

      const { options, onTweetLoadSuccess, onTweetLoadError } = this.props
      widgets
        .createTweetEmbed(id, this._div, options)
        .then(onTweetLoadSuccess)
        .catch(onTweetLoadError)
    })
  }
  componentDidMount () {
    if (!window.twttr) {
      const isLocal = window.location.protocol.indexOf('file') >= 0
      const protocol = isLocal ? this.props.protocol : ''

      addScript(`${protocol}//platform.twitter.com/widgets.js`, this.renderTweet)
    } else {
      this.renderTweet(this.props.id)
    }
  }
  componentWillUpdate (nextProps, nextState) {
    this.renderTweet(nextProps.id)
  }
  render () {
    return <div className={this.props.className} ref={(c) => {
      this._div = c
    }} />
  }
}

TweetEmbed.propTypes = {
  id: PropTypes.string,
  options: PropTypes.object,
  protocol: PropTypes.string,
  onTweetLoadSuccess: PropTypes.func,
  onTweetLoadError: PropTypes.func,
  className: PropTypes.string
}

TweetEmbed.defaultProps = {
  protocol: 'https:',
  options: {},
  className: null
}

export default TweetEmbed
