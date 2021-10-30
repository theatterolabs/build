import { globalvariables } from '../util/globalvariables'
import { scalecanvas } from '../util/scalecanvas'

import $ from 'jquery'

export default class Level extends Phaser.Scene {
  constructor() {
    super({ key: 'Level' })
  }

  init() {}
  onProgress(v) {}
  preload() {}
  create() {
    scalecanvas.call(this, true)
    /* localStorage.clear(); */
    globalvariables.gamebg.play()
    this.bg = this.add
      .sprite(this._canvaswidth * 0.5, this._canvasheight * 0.5, 'bgmap')
      .setScale(1.2)

    this.levelThumbsGroup = this.add.group()

    var levelThumb1 = this.add.sprite(
      offsetX + j * (globalvariables.thumbWidth + globalvariables.thumbSpacing),
      offsetY +
        i * (globalvariables.thumbHeight + globalvariables.thumbSpacing),
      'levels'
    )
    /* levelThumb1.setOrigin(0.5) */
    levelThumb1.setScale(1)

    var levelLength =
      levelThumb1.displayWidth * globalvariables.thumbCols +
      globalvariables.thumbSpacing * (globalvariables.thumbCols - 1) /* +
      levelThumb1.displayWidth / 2 */
    var levelHeight =
      levelThumb1.displayHeight * globalvariables.thumbRows +
      globalvariables.thumbSpacing * (globalvariables.thumbRows - 1)

    levelThumb1.destroy()
    for (var l = 0; l < 1; l++) {
      var offsetX =
        (this._canvaswidth - levelLength) / 2 + this._canvaswidth * l
      var offsetY = 20
      for (var i = 0; i < globalvariables.thumbRows; i++) {
        for (var j = 0; j < globalvariables.thumbCols; j++) {
          /* console.log(levelNumber, globalvariables.starsArray.length) */

          var levelNumber =
            i * globalvariables.thumbCols +
            j +
            l * (globalvariables.thumbRows * globalvariables.thumbCols)
          if (levelNumber < globalvariables.starsArray.length) {
            var levelThumb = this.add.sprite(
              offsetX +
                j * (globalvariables.thumbWidth + globalvariables.thumbSpacing),
              offsetY +
                i *
                  (globalvariables.thumbHeight + globalvariables.thumbSpacing),
              'levels'
            )
            levelThumb.powerup = ''

            levelThumb.name = globalvariables.starsArray[levelNumber]
            levelThumb.setScale(1)
            levelThumb.setOrigin(0.5)

            levelThumb.x = this.getX(levelNumber)
            /* offsetX +
              j * (levelThumb.displayWidth + globalvariables.thumbSpacing) +
              levelThumb.displayWidth / 2 */
            levelThumb.y = this.getY(levelNumber)
            /* offsetY +
              i * (levelThumb.displayHeight + globalvariables.thumbSpacing) +
              levelThumb.displayHeight * 2 */
            if (levelThumb.powerup != '') {
              this.addpowerup(levelThumb.powerup, levelThumb.x, levelThumb.y)
            }
            levelThumb
              .setInteractive()
              .on('pointerdown', this.thumbClicked.bind(this, levelThumb))

            levelThumb.setFrame(globalvariables.starsArray[levelNumber])
            levelThumb.nameFrame = globalvariables.starsArray[levelNumber]
            levelThumb.levelNumber = levelNumber + 1

            this.levelThumbsGroup.add(levelThumb)

            /* if (globalvariables.starsArray[levelNumber] < 4) { */
            var style = {
              font: '60px font2',
              fill: '#ffffff',
            }
            var levelText = this.add.text(
              levelThumb.x,
              levelThumb.y + 5,
              levelNumber + 1,
              style
            )
            levelText.setOrigin(0.5, 0.25)
            levelText.x = levelThumb.x
            levelText.y =
              levelThumb.y /* +levelThumb.displayHeight * 0.01 */ /* - levelThumb.displayHeight * 0.2 */
            /* levelText.setShadow(2, 2, 'rgba(0,0,0,0.5)', 1) */
            this.levelThumbsGroup.add(levelText)
            /* } */
          }
        }
      }
    }
    /* this.levelThumbsGroup.x = this.currentPage * this._canvaswidth * -1
    if (this.currentPage == this.pages - 1) {
      this.rightArrow.alpha = 0.3
      this.levelThumbsGroup.children.iterate(
        function (itm) {
          itm.x = itm.x - this._canvaswidth
        }.bind(this)
      )
    } */

    /* this.value = 100;
    this.value2 =80;
    this.bar = this.add.graphics()
    this.draw(105,100); */
    this.lamp = this.add
      .sprite(this._canvaswidth * 0.96, this._canvasheight * 0, 'lamp')
      .setScale(1)
      .setOrigin(1, 0)

    /* globalvariables.istutorialdone = true */

    if (!globalvariables.istutorialdone) {
      mixpanel.track('Screen View', {
        'Page Name': 'Context Screen',
      })
      window.localStorage.setItem('leveltutorial', true)
      globalvariables.istutorialdone = true
      this.blackbgtutoril = this.add
        .sprite(
          this._canvaswidth * 0.5,
          this._canvasheight * 0.5,
          'blackbgtutorial1'
        )
        .setScale(1.2)
      globalvariables.audiomsg1.play()
      this.host = this.add
        .sprite(this._canvaswidth * 0.5, this._canvasheight * 0.2, 'host')
        .setOrigin(0.5)
      this.message1 = this.add
        .sprite(
          this.host.x - this.host.displayWidth * 0.1,
          this.host.y + this.host.displayHeight * 0.1,
          'message1'
        )
        .setOrigin(0, 0.5)

      this.ssss = this.add
        .text(
          this.host.x + this.host.displayWidth * 0.5,
          this.host.y + this.host.displayHeight * 0.5,
          'Continue',
          {
            fontFamily: 'font2',
            fontSize: 64,
            color: '#fff',
          }
        )
        .setOrigin(1.1, 0)
        .setInteractive()
        .on('pointerdown', this.gotonexttut.bind(this))
    }

    var scoreAPI =
      'https://8btazx6thc.execute-api.ap-south-1.amazonaws.com/getscores?skip=0&limit=1'
    fetch(scoreAPI)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        /* console.log(data.length) */
        globalvariables.highscore = data[0].score
      })

    /* console.log(
      globalvariables.levelarrayscore,
      'globalvariables.levelarrayscore'
    ) */
  }

  gotonexttut() {
    globalvariables.buttonpress.play()
    this.ssss.disableInteractive()
    this.ssss.destroy()
    globalvariables.audiomsg1.stop()
    this.blackbgtutoril.setTexture('blackbgtutorial3')
    this.message1.setTexture('message2')
    globalvariables.audiomsg2.play()
    this.ssss = this.add
      .text(
        this.host.x + this.host.displayWidth * 0.5,
        this.host.y + this.host.displayHeight * 0.5,
        'Continue',
        {
          fontFamily: 'font2',
          fontSize: 64,
          color: '#fff',
        }
      )
      .setOrigin(1.1, 0)
      .setInteractive()
      .on('pointerdown', this.gotonexttut2.bind(this))
  }

  gotonexttut2() {
    mixpanel.track('Tutorial Completed')
    globalvariables.buttonpress.play()
    this.ssss.disableInteractive()
    this.ssss.destroy()
    globalvariables.audiomsg2.stop()
    this.blackbgtutoril.setTexture('blackbgtutorial1')
    this.message1.setTexture('message3')
    globalvariables.audiomsg3.play()
    this.ssss = this.add
      .text(
        this.host.x + this.host.displayWidth * 0.5,
        this.host.y + this.host.displayHeight * 0.5,
        'Continue',
        {
          fontFamily: 'font2',
          fontSize: 64,
          color: '#fff',
        }
      )
      .setOrigin(1.1, 0)
      .setInteractive()
      .on('pointerdown', this.gotonexttut3.bind(this))
  }
  gotonexttut3() {
    globalvariables.buttonpress.play()
    this.ssss.disableInteractive()
    this.ssss.destroy()
    globalvariables.audiomsg3.stop()
    this.blackbgtutoril.setTexture('blackbgtutorial2')
    this.message1.setTexture('message4')
    globalvariables.audiomsg4.play()

    this.handicon = this.add
      .sprite(this.getX(0), this.getY(0), 'handicon')
      .setScale(1.2)
      .setOrigin(0.5, 0)
      .setInteractive()
      .on('pointerdown', this.gotonexttut4.bind(this))
    this.handicon.levelNumber = 1
    this.handicon.nameFrame = globalvariables.starsArray[0]
    this.handicon.y = this.getY(0) - this.handicon.displayHeight * 0.9

    this.tween = this.tweens.add({
      targets: this.handicon,
      props: {
        y: {
          value: this.getY(0) - this.handicon.displayHeight * 0.6,
          delay: 0,
        },
      },
      ease: 'Power2',
      duration: 700,
      yoyo: true,
      paused: false,
      repeat: -1,
    })

    /* this.ssss = this.add
      .text(
        this.host.x + this.host.displayWidth * 0.5,
        this.host.y + this.host.displayHeight * 0.5,
        'Continue',
        {
          fontFamily: 'font2',
          fontSize: 64,
          color: '#fff',
        }
      )
      .setOrigin(1.1, 0)
      .setInteractive()
      .on('pointerdown', this.gotonexttut4.bind(this)) */
  }

  gotonexttut4() {
    mixpanel.track('Screen View', {
      'Page Name': 'Map Screen',
    })
    this.tween.stop()
    globalvariables.buttonpress.play()
    /* this.tween.destroy() */
    this.handicon.setVisible(false)
    this.ssss.disableInteractive()
    globalvariables.audiomsg4.stop()
    globalvariables.istutorialdone = true
    this.blackbgtutoril.destroy()
    this.message1.destroy()
    this.ssss.destroy()
    this.host.destroy()
    this.thumbClicked(this.handicon)
  }

  getX(num) {
    if (num == 0) {
      return this._canvaswidth * 0.28
    } else if (num == 1) {
      return this._canvaswidth * 0.54
    } else if (num == 2) {
      return this._canvaswidth * 0.81
    } else if (num == 3) {
      return this._canvaswidth * 0.7
    } else if (num == 4) {
      return this._canvaswidth * 0.44
    } else if (num == 5) {
      return this._canvaswidth * 0.26
    } else if (num == 6) {
      return this._canvaswidth * 0.35
    } else if (num == 7) {
      return this._canvaswidth * 0.54
    } else if (num == 8) {
      return this._canvaswidth * 0.75
    } else if (num == 9) {
      return this._canvaswidth * 0.65
    } else if (num == 10) {
      return this._canvaswidth * 0.4
    } else if (num == 11) {
      return this._canvaswidth * 0.15
    } else if (num == 12) {
      return this._canvaswidth * 0.25
    } else if (num == 13) {
      return this._canvaswidth * 0.45
    } else if (num == 14) {
      return this._canvaswidth * 0.65
    }
  }

  getY(num) {
    if (num == 0) {
      return this._canvasheight * 0.82
    } else if (num == 1) {
      return this._canvasheight * 0.77
    } else if (num == 2) {
      return this._canvasheight * 0.75
    } else if (num == 3) {
      return this._canvasheight * 0.66
    } else if (num == 4) {
      return this._canvasheight * 0.61
    } else if (num == 5) {
      return this._canvasheight * 0.58
    } else if (num == 6) {
      return this._canvasheight * 0.48
    } else if (num == 7) {
      return this._canvasheight * 0.45
    } else if (num == 8) {
      return this._canvasheight * 0.42
    } else if (num == 9) {
      return this._canvasheight * 0.29
    } else if (num == 10) {
      return this._canvasheight * 0.25
    } else if (num == 11) {
      return this._canvasheight * 0.25
    } else if (num == 12) {
      return this._canvasheight * 0.13
    } else if (num == 13) {
      return this._canvasheight * 0.09
    } else if (num == 14) {
      return this._canvasheight * 0.09
    }
  }

  addpowerup(name, x, y) {
    this.add.sprite(x, y, name).setScale(1)
  }

  arrowClicked(spr) {
    if (spr.name == 'right' && this.currentPage < this.pages - 1) {
      this.leftArrow.alpha = 1
      this.currentPage++

      if (this.currentPage == this.pages - 1) {
        spr.alpha = 0.3
      }

      this.levelThumbsGroup.children.iterate(
        function (itm) {
          itm.x = itm.x - this._canvaswidth
        }.bind(this)
      )
    }
    if (spr.name == 'left' && this.currentPage > 0) {
      this.rightArrow.alpha = 1
      this.currentPage--
      if (this.currentPage == 0) {
        spr.alpha = 0.3
      }
      this.levelThumbsGroup.children.iterate(
        function (itm) {
          itm.x = itm.x + this._canvaswidth
        }.bind(this)
      )
    }
  }
  thumbClicked(spr) {
    /* console.log(spr.levelNumber,globalvariables.istutorialdone,globalvariables.isvideoOn) */
    if (!globalvariables.dialogopen) {
      mixpanel.track('CTAs', {
        Element: 'Level',
        'Level Number': spr.levelNumber,
      })

      globalvariables.buttonpress.play()
      if (globalvariables.istutorialdone && !globalvariables.isvideoOn) {
        
        globalvariables.level = spr.levelNumber
        globalvariables.dialogopen = true
        this.blackbg = this.add.sprite(
          this._canvaswidth * 0.5,
          this._canvasheight * 0.5,
          'blackbg'
        )

        this.dialog = this.add
          .sprite(this._canvaswidth * 0.5, this._canvasheight * 0.4, 'dialog')
          .setScale(1.2)

        this.closebtn = this.add
          .sprite(
            this.dialog.x + this.dialog.displayWidth * 0.45,
            this.dialog.y - this.dialog.displayHeight * 0.6,
            'close'
          )
          .setScale(0.8)
          .setInteractive()
          .on('pointerdown', this.gotoStop.bind(this))
        if (spr.nameFrame < 4) {
          this.playbtn = this.add
            .sprite(
              this._canvaswidth * 0.5,
              this.dialog.y + this.dialog.displayHeight * 0.25,
              'playbtn'
            )
            .setScale(1)
            .setInteractive()
            .on('pointerdown', this.gotoPlaying.bind(this))
        }
        this.levelwoodbg = this.add
          .sprite(
            this._canvaswidth * 0.5,
            this.dialog.y - this.dialog.displayHeight * 0.35,
            'levelwoodbg'
          )
          .setScale(1)
          .setOrigin(0.5)

        this.leveltxt = this.add
          .sprite(
            this._canvaswidth * 0.48,
            this.dialog.y - this.dialog.displayHeight * 0.35,
            'leveltxt'
          )
          .setScale(1)
          .setOrigin(0.5)

        this.ssss = this.add
          .text(
            this.leveltxt.x + this.leveltxt.displayWidth * 0.8,
            this.leveltxt.y - this.leveltxt.displayHeight * 0.5,
            globalvariables.level,
            {
              fontFamily: 'font2',
              fontSize: 64,
              color: '#fff',
            }
          )
          .setOrigin(0.5, 0.1)

        this.dialogenemy = this.add
          .sprite(
            this._canvaswidth * 0.5,
            this.levelwoodbg.y + this.levelwoodbg.displayHeight,
            'dialogenemy' +
              globalvariables.enemyArray[globalvariables.level - 1]
          )
          .setScale(1.4)
          .setOrigin(0.5, 0)

        this.visitnow = this.add
          .sprite(
            this._canvaswidth * 0.5,
            this.dialog.y + this.dialog.displayHeight * 0.6,
            'visitnow'
          )
          .setScale(1.2)
          .setOrigin(0.5, 0).setInteractive().on('pointerdown', this.fnzeefivebtn.bind(this))

        /* this.zeefivebtn = this.add
          .sprite(
            this.visitnow.x + this.visitnow.displayWidth * 0.23,
            this.visitnow.y + this.visitnow.displayHeight * 0.4,
            'zeefivebtn'
          )
          .setScale(1.2)
          .setInteractive()
          .setOrigin(0.5)
          .on('pointerdown', this.fnzeefivebtn.bind(this)) */
      }
//console.log(globalvariables.starsArray[spr.levelNumber], " ;;;;")
      if ((
        (spr.levelNumber == 3 && !globalvariables.isvideoplayed3) ||
        (spr.levelNumber == 7 && !globalvariables.isvideoplayed7)||
        (spr.levelNumber == 10 && !globalvariables.isvideoplayed10)||
        (spr.levelNumber == 13 && !globalvariables.isvideoplayed13)
      )&& globalvariables.starsArray[spr.levelNumber-1] < 4) {
        this.inittime = 30
        document.getElementById('videoparatag').innerHTML =
          'Level Unlocks in : ' + this.inittime
        document.getElementById('videocontainer').style.opacity = 1
        document.getElementById('videocontainer').style.zIndex = 100
        globalvariables.isvideoOn = true
        globalvariables['isvideoplayed'+spr.levelNumber]= true
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
        globalvariables.lvlbgtrack.pause()
        document.getElementById('my_video_1_html5_api').currentTime = 0
        document.getElementById('my_video_1_html5_api').play()

        document.getElementById('my_video_1_html5_api').onended = function () {
          /* alert("The video has ended"); */
          globalvariables.isvideoOn = false
          globalvariables.lvlbgtrack.play()
          document.getElementById('videocontainer').style.opacity = 0
          document.getElementById('videocontainer').style.zIndex = -1
        }
      }
    }
  }

  onEvent() {
    if (this.inittime == 0) {
      this.timedEvent.destroy();
          this.timedEvent = null
      document.getElementById('videoparatag').innerHTML = 'Skip >>'
      document.getElementById('videoparatag').addEventListener(
        'click',
        function () {
          

          document.getElementById('my_video_1_html5_api').pause()
          document.getElementById('videocontainer').style.opacity = 0
          document.getElementById('videocontainer').style.zIndex = -1
          globalvariables.isvideoOn = false
          globalvariables.lvlbgtrack.play()
        }.bind(this)
      )
    } else {
      this.inittime--
      document.getElementById('videoparatag').innerHTML =
        'Level Unlocks in : ' + this.inittime
    }
  }

  fnzeefivebtn(){
    window.open('https://www.zee5.com/', '_blank').focus();
  }

  gotoStop() {
    if (!globalvariables.isvideoOn) {
      globalvariables.dialogopen = false
      globalvariables.buttonpress.play()
      if (this.zeefivebtn) {
        this.zeefivebtn.disableInteractive()
        this.zeefivebtn.destroy()
      }
      if (this.visitnow) this.visitnow.destroy()

      this.blackbg.destroy()
      this.dialog.destroy()
      this.dialogenemy.destroy()
      this.ssss.destroy()
      if (this.playbtn) this.playbtn.destroy()
      this.closebtn.destroy()
      this.leveltxt.destroy()
      this.levelwoodbg.destroy()
    }
  }

  gotoPlaying() {
    if (!globalvariables.isvideoOn) {
      
      globalvariables.dialogopen = false
      globalvariables.gamebg.stop()
      globalvariables.buttonpress.play()
      if (this.zeefivebtn) {
        this.zeefivebtn.disableInteractive()
        this.zeefivebtn.destroy()
      }
      if (this.visitnow) this.visitnow.destroy()

      this.blackbg.destroy()
      this.dialog.destroy()
      this.dialogenemy.destroy()
      this.ssss.destroy()
      if (this.playbtn) this.playbtn.destroy()
      this.closebtn.destroy()
      this.leveltxt.destroy()
      this.levelwoodbg.destroy()
      this.scene.start('Game')
    }
  }
}
