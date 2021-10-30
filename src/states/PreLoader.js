import { globalvariables } from '../util/globalvariables'
import { scalecanvas } from '../util/scalecanvas'
export default class PreLoader extends Phaser.Scene {
  constructor() {
    super({ key: 'PreLoader' })
  }

  init() {}
  onProgress(v) {}
  preload() {
    /* console.log('preload') */
    let _url = '.' //'https://snktcodes.github.io/Match-3-RPG-Puzzle-Game'
    /* console.log(_url, ' ?') */
    this.load.image('tilebg', _url + '/assets/Tile_Background.png')
    this.load.image('floorstrip', _url + '/assets/Floor_Strip.png')
    this.load.image('gamefloor', _url + '/assets/Game_Floor.png')
    this.load.image('backdrop3', _url + '/assets/BackDropLevel1012.png')
    this.load.image('characters', _url + '/assets/Characters.png')
    this.load.image('logo', _url + '/assets/Logo.png')
    this.load.image('pillarleft', _url + '/assets/Pillar_Left.png')
    this.load.image('pillarright', _url + '/assets/Pillar_Right.png')
  }
  create() {
    /* console.log('create') */
    /* this.scene.start('Loader') */
    scalecanvas.call(this, true)

    let gameDiv = document.getElementById('gameDiv')

    gameDiv.style.display = 'flex'

    if (typeof Storage !== 'undefined') {
      if (
        window.localStorage.length > 0 &&
        window.localStorage.getItem('level') != undefined &&
        window.localStorage.getItem('array') != undefined &&
        window.localStorage.getItem('levelarrayscore') != undefined &&
        window.localStorage.getItem('leveltutorial') != undefined &&
        window.localStorage.getItem('gametutorial') != undefined
      ) {
        let arr1 = window.localStorage.getItem('array').split(',')

        let arr2 = []
        let index = 0

        let arr3 = window.localStorage.getItem('levelarrayscore').split(',')

        let arr4 = []

        globalvariables.istutorialdone =
          window.localStorage.getItem('leveltutorial')

        /* console.log(window.localStorage.getItem('leveltutorial'))

        console.log(window.localStorage.getItem('gametutorial')) */

        globalvariables.isgametutorialdone =
          window.localStorage.getItem('gametutorial')

        for (var t = 0; t < arr1.length; t++) {
          arr2.push(parseInt(arr1[t]))
          if (arr1[t] != '4') {
            index++
          }
        }

        for (var t = 0; t < arr3.length; t++) {
          arr4.push(parseInt(arr3[t]))
          /* if (arr3[t] != '4') {
            index++
          } */
        }

        globalvariables.levelarrayscore = arr4
        globalvariables.starsArray = arr2

        /* console.log(globalvariables.starsArray)
        console.log(globalvariables.levelarrayscore) */

        globalvariables.level = index
      } else {
        /* window.localStorage.setItem('leveltutorial',false)
        window.localStorage.setItem('gametutorial',false) */
      }
    }

    this.brickbg = this.add.sprite(
      this._canvaswidth * 0.5,
      this._canvasheight,
      'tilebg'
    )
    this.brickbg.setOrigin(0.5, 1).setDepth(1)
    this.brickbg.setScale(this.scaling * 0.7)

    this.gamefloor = this.add.sprite(
      this._canvaswidth * 0.5,
      this._canvasheight * 0.38,
      'gamefloor'
    )
    this.gamefloor.setOrigin(0.5, 0).setDepth(4)
    this.gamefloor.setScale(this.scaling * 1)

    this.bg = this.add.sprite(
      this._canvaswidth * 0.5,
      this._canvasheight * 0.5,
      'backdrop3'
    )
    this.bg.setOrigin(0.5, 0.5).setDepth(4)
    this.bg.setScale(this.scaling * 1.2)

    this.gamefloor.y = this.bg.y + this.bg.displayHeight * 0.45

    this.floorstrip = this.add.sprite(
      this._canvaswidth * 0.5,
      this._canvasheight * 0.4,
      'floorstrip'
    )
    this.floorstrip.setOrigin(0.5, 0.5).setDepth(4)
    this.floorstrip.setScale(this.scaling * 1)

    this.floorstrip.y = this.gamefloor.y + this.gamefloor.displayHeight * 1

    this.characters = this.add.sprite(
      this._canvaswidth * 0.45,
      this._canvasheight * 0.5,
      'characters'
    )
    this.characters.setOrigin(0.5).setDepth(4)
    this.characters.setScale(this.scaling * 0.8)

    this.characters.y = this.gamefloor.y - this.gamefloor.displayHeight * 1

    this.logo = this.add.sprite(
      this._canvaswidth * 0.5,
      this._canvasheight * 0,
      'logo'
    )
    this.logo.setOrigin(0.5, 0).setDepth(4)
    this.logo.setScale(this.scaling * 0.8)

    this.pillarleft = this.add.sprite(0, this._canvasheight, 'pillarleft')
    this.pillarleft.setOrigin(1, 0).setDepth(1)
    this.pillarleft.setScale(this.scaling * 1)
    this.pillarright = this.add.sprite(0, this._canvasheight, 'pillarright')
    this.pillarright.setOrigin(0, 0).setDepth(1)
    this.pillarright.setScale(this.scaling * 1)

    this.pillarleft.x = this.pillarleft.displayWidth + this.leftspace
    this.pillarleft.y = this.floorstrip.y + this.floorstrip.displayHeight * 0.5

    this.pillarright.x =
      this._canvaswidth - this.pillarright.displayWidth - this.leftspace
    this.pillarright.y = this.floorstrip.y + this.floorstrip.displayHeight * 0.5

    this.progresstxt = this.add.text(
      this._canvaswidth * 0.5,
      this._canvasheight * 0.9,
      '',
      {
        fontFamily: 'font2',
        fontSize: 100,
        color: '#0000ff',
      }
    )
    this.progresstxt.setOrigin(0.5)
    this.progresstxt.setDepth(5)

    let ty = setTimeout(() => {
      clearTimeout(ty)
      this.loadrest()
    }, 1000)
  }

  loadrest() {
    mixpanel.track('Screen View', {
      'Page Name': 'Splash Screen',
    })
    /* console.log('LOADREST') */
    document.querySelector('.containerr').style.opacity = 1
    const bars = document.querySelectorAll('.bar')
    const progress = document.querySelectorAll('.progress')

    this.load.once('complete', this.subLoadCompleted, this)
    this.load.on(
      'progress',
      function (value) {
        /* console.log(value) */
        this.progresstxt.text = '' /* Math.floor(value * 100) + '%' */
        bars.forEach((bar, index) => {
          const randomWidth = Math.floor(value * 100)
          bar.style.width = `${randomWidth}%`

          progress[index].addEventListener('mouseover', () => {
            const randomTiming = Math.floor(Math.random() * 2 + 2)
            /* console.log(randomTiming) */
            bar.style.transitionDuration = `${randomTiming}s`
            bar.style.width = '100%'
          })
        })
      }.bind(this)
    )
    let _url = '.' //'https://snktcodes.github.io/Match-3-RPG-Puzzle-Game'

    this.load.image('blackbg', _url + '/assets/blackbg.png')

    this.load.image('star1', _url + '/assets/star1.png')
    this.load.image('star2', _url + '/assets/star2.png')
    this.load.image('star3', _url + '/assets/star3.png')
    this.load.image('star4', _url + '/assets/star4.png')

    this.load.image('leader', _url + '/assets/leader.png')
    this.load.image('replay', _url + '/assets/replay.png')
    this.load.image('playbtn2', _url + '/assets/playbtn2.png')
    /* this.load.image('leaderbox', _url + '/assets/leaderbox.png') */

    for (var p = 0; p < globalvariables.gemColors; p++) {
      this.load.image('gem' + p, _url + '/assets/gem' + (p + 1) + '.png')
    }

    for (var p = 0; p < globalvariables.powerups; p++) {
      this.load.image(
        'powerup' + p,
        _url + '/assets/powerup' + (p + 1) + '.png'
      )
    }

    this.load.image('bullet', _url + '/assets/bullet.png')

    /* this.load.spritesheet('game', _url + '/assets/game.png', {
      frameWidth: 200,
      frameHeight: 80,
    }) */

    //bg

    this.load.image('kills', _url + '/assets/Kills.png')
    this.load.image('startbtn', _url + '/assets/startbtn.png')
    this.load.image('soundoff', _url + '/assets/Sound_Off.png')
    this.load.image('soundon', _url + '/assets/Sound_On.png')
    this.load.image('backdrop0', _url + '/assets/BackDropLevel13.png')
    this.load.image('backdrop1', _url + '/assets/BackDropLevel46.png')
    this.load.image('backdrop2', _url + '/assets/BackDropLevel79.png')

    this.load.image('backdrop4', _url + '/assets/BackDropLevel1315.png')

    this.load.image('backblack', _url + '/assets/backblack.png')
    this.load.image('red', _url + '/assets/red.png')
    this.load.image('green', _url + '/assets/green.png')
    this.load.image('victorydialog', _url + '/assets/victorydialog.png')

    this.load.atlas(
      'hero',
      _url + '/assets/hero.png',
      _url + '/assets/hero.json'
    )

    this.load.atlas(
      'hitenemyeffect',
      _url + '/assets/hitenemyeffect.png',
      _url + '/assets/hitenemyeffect.json'
    )

    this.load.atlas(
      'hitheroeffect',
      _url + '/assets/hitheroeffect.png',
      _url + '/assets/hitheroeffect.json'
    )

    this.load.audio('audiomsg1', _url + '/assets/Welcome_Message_1.mp3')
    this.load.audio('audiomsg2', _url + '/assets/Welcome_Message_2.mp3')
    this.load.audio('audiomsg3', _url + '/assets/Welcome_Message_3.mp3')
    this.load.audio('audiomsg4', _url + '/assets/Welcome_Message_4.mp3')
    this.load.audio('gamebg', _url + '/assets/Game_Background.mp3')
    this.load.audio('boostercrush', _url + '/assets/Booster_Crush.mp3')
    this.load.audio('boyhit', _url + '/assets/Boy_Hit.mp3')
    this.load.audio('buttonpress', _url + '/assets/button_Press.mp3')
    this.load.audio('crush', _url + '/assets/Crush.mp3')
    this.load.audio('gemfall', _url + '/assets/Gems_Falling.mp3')
    this.load.audio('lvlbgtrack', _url + '/assets/Level_Background_Track.mp3')
    this.load.audio('lvlcomplete', _url + '/assets/level_completed.mp3')
    this.load.audio('lvlfail', _url + '/assets/Level_fail.mp3')
    this.load.audio('rakshashit', _url + '/assets/Rakshas_Hit.mp3')
    this.load.audio('rakshasentry', _url + '/assets/Rakshas_Entry.mp3')

    this.load.audio('switchfail', _url + '/assets/switch_Tile_Fail.mp3')
    this.load.audio('switchsuccess', _url + '/assets/switch_Tile_Success.mp3')

    this.load.image('bgmap', _url + '/assets/Map.png')
    this.load.image('lamp', _url + '/assets/Lamp.png')
    this.load.spritesheet('levels', _url + '/assets/levels.png', {
      frameWidth: globalvariables.thumbWidth,
      frameHeight: globalvariables.thumbHeight,
    })
    this.load.image('dialog', _url + '/assets/dialog.png')
    this.load.image('close', _url + '/assets/close.png')
    this.load.image('playbtn', _url + '/assets/playbtn.png')
    this.load.image('levelwoodbg', _url + '/assets/levelwoodbg.png')
    this.load.image('leveltxt', _url + '/assets/leveltxt.png')
    this.load.image('killrakshastext', _url + '/assets/killrakshastext.png')
    this.load.image('rakshasicon', _url + '/assets/rakshasicon.png')
    this.load.image('levelwoodbg', _url + '/assets/levelwoodbg.png')

    this.load.image('clientlogo', _url + '/assets/clientlogo.png')

    this.load.image('dialogenemy3', _url + '/assets/dialogenemy3.png')
    this.load.image('dialogenemy4', _url + '/assets/dialogenemy4.png')
    this.load.image('dialogenemy5', _url + '/assets/dialogenemy5.png')
    this.load.atlas(
      'atlas',
      _url + '/assets/atlas.png',
      _url + '/assets/atlas.json'
    )

    this.load.image('scoreboard', _url + '/assets/scoreboard.png')
    this.load.image('cardborder', _url + '/assets/Card_Border.png')
    this.load.image('star1txt', _url + '/assets/star1txt.png')
    this.load.image('star2txt', _url + '/assets/star2txt.png')
    this.load.image('star3txt', _url + '/assets/star3txt.png')

    this.load.image('fbsharebtn', _url + '/assets/fbsharebtn.png')
    this.load.image('blackbgtutorial1', _url + '/assets/blackbg1.png')
    this.load.image('blackbgtutorial2', _url + '/assets/blackbg2.png')

    this.load.image('blackbgtutorial3', _url + '/assets/blackbg3.png')
    this.load.image('host', _url + '/assets/Host.png')
    this.load.image('message1', _url + '/assets/message1.png')
    this.load.image('message2', _url + '/assets/message2.png')
    this.load.image('message3', _url + '/assets/message3.png')
    this.load.image('message4', _url + '/assets/message4.png')
    this.load.image('handicon', _url + '/assets/Hand_Icon.png')

    this.load.image('tutorialcard', _url + '/assets/Tutorial_Card.png')

    this.load.image('tutorial2', _url + '/assets/tutorial2.png')

    this.load.image('nextbtn', _url + '/assets/nextbtn.png')
    this.load.image('donebtn', _url + '/assets/donebtn.png')

    this.load.image('visitnow', _url + '/assets/visitnow.png')
    /* this.load.image('zeefivebtn', _url + '/assets/zeefivebtn.png') */

    this.load.atlas(
      'rakshas',
      _url + '/assets/rakshas.png',
      _url + '/assets/rakshas.json'
    )

    this.load.start()
  }

  subLoadCompleted() {
    globalvariables.boostercrush = this.sound.add('boostercrush', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    globalvariables.boyhit = this.sound.add('boyhit', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    globalvariables.buttonpress = this.sound.add('buttonpress', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    globalvariables.crush = this.sound.add('crush', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    globalvariables.gemfall = this.sound.add('gemfall', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    globalvariables.lvlbgtrack = this.sound.add('lvlbgtrack', {
      mute: false,
      volume: 0.5,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    })

    globalvariables.gamebg = this.sound.add('gamebg', {
      mute: false,
      volume: 0.5,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    })

    globalvariables.lvlcomplete = this.sound.add('lvlcomplete', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    globalvariables.lvlfail = this.sound.add('lvlfail', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    globalvariables.switchfail = this.sound.add('switchfail', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    globalvariables.switchsuccess = this.sound.add('switchsuccess', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    globalvariables.rakshashit = this.sound.add('rakshashit', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    globalvariables.rakshasentry = this.sound.add('rakshasentry', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    globalvariables.audiomsg1 = this.sound.add('audiomsg1', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })
    globalvariables.audiomsg2 = this.sound.add('audiomsg2', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })
    globalvariables.audiomsg3 = this.sound.add('audiomsg3', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })
    globalvariables.audiomsg4 = this.sound.add('audiomsg4', {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0,
    })

    document.querySelector('.containerr').style.zIndex = -1
    /* console.log('Load Complete') */

    this.startbtn = this.add
      .sprite(this._canvaswidth * 0.5, this._canvasheight * 0.9, 'startbtn')
      .setScale(1)
      .setDepth(2)
      .setInteractive()
      .on('pointerdown', this.gotoLevels.bind(this))
    this.setSectionHeight(document.getElementById('tutorialboard'))
    this.setSectionHeight(document.getElementById('videocontainer'))
    this.setSectionHeight(document.getElementById('leaderboard'))
    document.getElementById('leaderboard').style.height = '100%'
    
  }

  setSectionHeight(spr) {
    if (globalvariables.isMobile) {
      spr.style.height = window.innerHeight + 'px'
    } else {
      let wd = document.querySelector('canvas').style.width
      spr.style.width = wd

      let wdval = parseInt(wd.split('px')[0])
      spr.style.marginLeft = window.innerWidth / 2 - wdval / 2 + 'px'
      spr.style.marginTop = document.querySelector('canvas').style.marginTop
      spr.style.height = document.querySelector('canvas').style.height
    }
  }

  gotoLevels() {
    mixpanel.track('CTAs', {
      Element: 'Start',
    })
    globalvariables.buttonpress.play()
    this.startbtn.disableInteractive()
    this.scene.start('Level')
  }
}
