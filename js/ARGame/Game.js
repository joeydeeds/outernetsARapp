'use strict'

import React, { Component } from 'react'
import { StyleSheet } from 'react-native'

import {
  ViroARScene,
  ViroText,
  Viro360Image,
  ViroMaterials,
  ViroBox,
  ViroQuad,
  Viro3DObject,
  ViroOmniLight,
  ViroController,
  ViroNode,
  ViroARPlane,
  ViroFlexView,
  ViroAmbientLight,
  ViroLightingEnvironment,
  ViroSphere,
  ViroPolygon
} from 'react-viro'
const TimerMixin = require('react-timer-mixin')

class ARGame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      foundPlane: false,
      planePosition: [0, 0, 0],
      planeRotation: [0, 0, 0],
      totalSpheres: 0,
      score: -3
    }
    this.onAnchorFound = this.onAnchorFound.bind(this)
    this.addSphere = this.addSphere.bind(this)
    this.renderSpheres = this.renderSpheres.bind(this)
    this.updateScore = this.updateScore.bind(this)
  }

  render() {
    return (
      <ViroARScene
        physicsWorld={{
          gravity: [0, -9.81, 0],
          drawBounds: this.state.showCollisionBox
        }}
      >
        <ViroAmbientLight color="#FFFFFF" intensity={10} />
        <ViroLightingEnvironment source={require('./res/ibl_envr.hdr')} />
        <ViroARPlane
          key="firstPlane"
          onAnchorFound={this.onAnchorFound}
          ref={component => {
            this.arPlane = component
          }}
        >
          {this.getPhysicsGroup()}
        </ViroARPlane>
      </ViroARScene>
    )
  }

  onAnchorFound(anchorMap) {
    if (anchorMap.type !== 'plane') {
      return
    }

    const centerPosition = [
      anchorMap.position[0] + anchorMap.center[0],
      anchorMap.position[1] + anchorMap.center[1],
      anchorMap.position[2] + anchorMap.center[2]
    ]
    this.arPlane.setNativeProps({ pauseUpdates: true })
    this.setState({
      foundPlane: true,
      planePosition: centerPosition,
      planeRotation: anchorMap.rotation
    })
  }

  getPhysicsGroup() {
    if (!this.state.foundPlane) {
      return
    }

    return (
      <ViroNode position={this.state.planePosition}>
        {this.getHUDControl()}
        {this.renderSpheres()}

        <ViroQuad
          position={[0, 0, 0]}
          scale={[2.5, 8.0, 1.0]}
          rotation={[-90, 0, 0]}
          physicsBody={{ type: 'Static', restitution: 0.5 }}
          materials="ground"
          opacity={1}
        />
        <ViroBox
          scale={[0.2, 0.6, 0.1]}
          position={[0, 0, -3]}
          rotation={[0, 0, 0]}
          physicsBody={{
            type: 'Dynamic',
            mass: 25,
            enabled: true,
            useGravity: true,
            restitution: 0.35,
            friction: 0.75
          }}
          materials="cube_color"
          onCollision={this.updateScore}
          ref={component => {
            this.peg1 = component
          }}
        />
        <ViroBox
          scale={[0.2, 0.6, 0.1]}
          position={[0.25, 0, -3]}
          rotation={[0, 0, 0]}
          physicsBody={{
            type: 'Dynamic',
            mass: 25,
            enabled: true,
            useGravity: true,
            restitution: 0.35,
            friction: 0.75
          }}
          materials="cube_color"
          onCollision={this.updateScore}
          ref={component => {
            this.peg2 = component
          }}
        />
        <ViroBox
          scale={[0.2, 0.6, 0.1]}
          position={[-0.25, 0, -3]}
          rotation={[0, 0, 0]}
          physicsBody={{
            type: 'Dynamic',
            mass: 25,
            enabled: true,
            useGravity: true,
            restitution: 0.35,
            friction: 0.75
          }}
          materials="cube_color"
          onCollision={this.updateScore}
          ref={component => {
            this.peg3 = component
          }}
        />
      </ViroNode>
    )
  }

  updateScore() {
    this.setState(prevState => ({
      score: prevState.score + 1
    }))
  }

  getHUDControl() {
    return (
      <ViroNode
        position={[0, 1.5, -7.75]}
        transformBehaviors={['billboardX', 'billboardY']}
      >
        <ViroFlexView
          style={{ flexDirection: 'column' }}
          width={1}
          height={0.8}
          materials="hud_text_bg"
          position={[-0.25, 0, 0]}
        >
          <ViroText
            style={styles.hud_text}
            text={'Score: ' + this.state.score}
          />
        </ViroFlexView>
        <ViroFlexView
          style={{ flexDirection: 'column' }}
          width={1}
          height={0.8}
          materials="hud_text_bg"
          position={[1, 0, 0]}
          onClick={this.addSphere}
        >
          <ViroText style={styles.hud_text} text="Add Sphere" />
        </ViroFlexView>
      </ViroNode>
    )
  }

  renderSpheres() {
    const views = []
    for (let i = 0; i < this.state.totalSpheres; i++) {
      const sphereKey = 'SphereTag_' + i
      views.push(
        <ViroSphere
          scale={[0.1, 0.1, 0.1]}
          position={[0, 1, 1]}
          rotation={[1, 1, 1]}
          physicsBody={{
            type: 'Dynamic',
            mass: 300,
            enabled: true,
            useGravity: true,
            restitution: 1,
            friction: 0.1
          }}
          materials="cube_color"
          key={sphereKey}
          onDrag={() => {}}
        />
      )
    }
    return views
  }

  addSphere() {
    this.setState({ totalSpheres: this.state.totalSpheres + 1 })
  }
}

const styles = StyleSheet.create({
  hud_text: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: '#0000ff',
    flex: 1
  }
})

ViroMaterials.createMaterials({
  hud_text_bg: {
    diffuseColor: '#00ffff'
  },
  ground: {
    diffuseColor: '#007CB6E6'
  },
  ground_hit: {
    diffuseColor: '#008141E6'
  },
  cube_color: {
    diffuseColor: '#0021cbE6'
  }
})

module.exports = ARGame
