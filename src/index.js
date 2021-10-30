import Phaser from 'phaser'
import { globalvariables } from './util/globalvariables'
import { isMobile } from 'mobile-device-detect'
import PreLoader from './states/Preloader'
import Level from './states/Level'
import Game from './states/Game'
import Score from './states/Score'
import Complete from './states/Complete'


globalvariables.displaypixelratio = 1
let defaultwd = 1242
let defaultht = 2208
globalvariables.isMobile = isMobile

const config = {
  fullscreenTarget: document.getElementById('gameDiv'),
  type: isMobile ? Phaser.CANVAS : Phaser.CANVAS,
  transparent: false,
  scale: {
    parent: 'gameDiv',
    mode: globalvariables.isMobile ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: defaultwd,
    height: defaultht,
    transparent: true,
  },
  dom: {
    createContainer: true,
  },
  scene: [PreLoader, Level, Game, Score, Complete],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
   
  },
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
  
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
