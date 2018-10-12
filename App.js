'use strict'

import React, { Component } from 'react'
import { ViroARSceneNavigator } from 'react-viro'

const apiKey = process.env.VIRO_KEY

const arScene = {
  ARGame: require('./js/ARGame/Game.js')
}

class App extends Component {
  render() {
    return (
      <ViroARSceneNavigator
        initialScene={{
          scene: arScene.ARGame
        }}
        apiKey={apiKey}
      />
    )
  }
}

module.exports = App
