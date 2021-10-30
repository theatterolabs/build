import { globalvariables } from '../util/globalvariables'
import { scalecanvas } from '../util/scalecanvas'

export default class Score extends Phaser.Scene {
  constructor() {
    super({ key: 'Score' })
  }

  init() {}
  onProgress(v) {}
  preload() {}
  create() {
    scalecanvas.call(this, true)
    let y = 3/* this.getRandomInt(4) */
    if (y == 4) {
      y = 3
    }

    if (
      Math.floor(y) > globalvariables.starsArray[globalvariables.level - 1] &&
      Math.floor(y) != 4
    ) {
      globalvariables.starsArray[globalvariables.level - 1] = Math.floor(y)
    }

    if (globalvariables.starsArray[globalvariables.level - 1] == 3) {
      globalvariables.starsArray[globalvariables.level] = 0
    }

    if (typeof Storage !== 'undefined') {
      window.localStorage.setItem('level', globalvariables.level)
      window.localStorage.setItem('array', globalvariables.starsArray)
      /* window.localStorage.setItem(
        'levelarrayscore',
        globalvariables.levelarrayscore
      ) */
    }


    /* console.log(globalvariables.starsArray, 'globalvariables.starsArray') */

    this.play2btn = this.add
      .sprite(this._canvaswidth * 0.5, this._canvasheight * 0.5, 'playbtn2')
      .setScale(1)
      .setDepth(20)
      .setInteractive()
      .on('pointerdown', this.gotoplay2.bind(this))
  }
  abc() {
    /* globalvariables.level = 1 */
    if (typeof Storage !== 'undefined') {
      window.localStorage.setItem('level', globalvariables.level)
      window.localStorage.setItem('array', globalvariables.starsArray)
      window.localStorage.setItem(
        'levelarrayscore',
        globalvariables.levelarrayscore
      )
    }

    let sum = 0
    for (let i = 0; i < globalvariables.levelarrayscore.length; i++) {
      /* console.log(parseInt(globalvariables.levelarrayscore[i])) */
      sum += globalvariables.levelarrayscore[i]
    }

    this.blackbg345 = this.add
      .sprite(this._canvaswidth * 0.5, this._canvasheight * 0.5, 'blackbg')
      .setDepth(20)

    this.cardborder = this.add
      .sprite(this._canvaswidth * 0.5, this._canvasheight * 0.5, 'cardborder')
      .setDepth(20)
      .setScale(this.scaling * 1)

    this.star3txt = this.add
      .sprite(
        this.cardborder.x + this.cardborder.displayWidth * 0.18,
        this.cardborder.y - this.cardborder.displayHeight * 0.35,
        'star1txt'
      )
      .setDepth(20)
      .setScale(this.scaling * 1)

    if (globalvariables.starsArray[globalvariables.level - 1] < 2) {
      this.star3txt.setTexture('star1txt')
    } else {
      this.star3txt.setTexture(
        'star' + globalvariables.starsArray[globalvariables.level - 1] + 'txt'
      )
    }

    let winloosetxt = ''
    if (globalvariables.starsArray[globalvariables.level - 1] == 3) {
      winloosetxt = 'win'
    } else {
      winloosetxt = 'loose'
    }
    mixpanel.track('Level Completed', {
      'Level Number': globalvariables.level,
      'Level Status': winloosetxt,
    })

    this.stareeee = this.add
      .sprite(
        this._canvaswidth * 0.5,
        this.cardborder.y - this.cardborder.displayHeight * 0.12,
        'star' + (globalvariables.starsArray[globalvariables.level - 1] + 1)
      )
      .setDepth(20)
      .setScale(this.scaling * 0.5)

    this.scoreboard = this.add
      .sprite(
        this._canvaswidth * 0.5,
        this.stareeee.y - this.stareeee.displayHeight,
        'scoreboard'
      )
      .setDepth(20)
      .setScale(this.scaling * 0.8)

    this.scoreboard.y =
      this.stareeee.y -
      this.stareeee.displayHeight +
      this.scoreboard.displayHeight * 0.8

    this.fbshare = this.add
      .sprite(
        this._canvaswidth * 0.5,
        this.scoreboard.y + this.scoreboard.displayHeight * 0.8,
        'fbsharebtn'
      )
      .setScale(1.4)
      .setDepth(20)

    this.sharebtnLabel = document.getElementById('fb-share')
    this.sharebtnLabel.style.width =
      String(
        ((((this.fbshare.width * 0.98 * this.fbshare.scaleX) /
          this.game.canvas.width) *
          document.getElementsByTagName('canvas')[0].clientWidth) /
          window.innerWidth) *
          100
      ) + '%'
    this.sharebtnLabel.style.height =
      String(
        ((((this.fbshare.height * 0.7 * this.fbshare.scaleY) /
          this.game.canvas.height) *
          document.getElementsByTagName('canvas')[0].clientHeight) /
          window.innerHeight) *
          100
      ) + '%'

    this.sharebtnLabel.style.top =
      'calc(' +
      String(
        ((this.fbshare.y + (this.topspace / 2) * this.fbshare.scaleY) /
          this.game.canvas.height) *
          100
      ) +
      '% - ' +
      String(
        ((parseInt(this.sharebtnLabel.style.height) / 2) * window.innerHeight) /
          100
      ) +
      'px)'

    this.sharebtnLabel.style.left =
      'calc(51% - ' +
      String(
        (parseInt(this.sharebtnLabel.style.width) * window.innerWidth -
          window.innerWidth * 2) /
          180
      ) +
      'px)'

    /* .setInteractive()
      .on('pointerdown', this.fbshareopen.bind(this)) */

    this.play2btn = this.add
      .sprite(
        this._canvaswidth * 0.5,
        this.fbshare.y + this.scoreboard.displayHeight * 0.8,
        'playbtn2'
      )
      .setScale(1)
      .setDepth(20)
      .setInteractive()
      .on('pointerdown', this.gotoplay2.bind(this))

    this.leader = this.add
      .sprite(
        this._canvaswidth * 0.28,
        this.fbshare.y + this.scoreboard.displayHeight * 0.8,
        'leader'
      )
      .setScale(1.2)
      .setDepth(20)
      .setAlpha(0.5)
      .setInteractive()
      .on('pointerdown', this.gotoleader.bind(this))

    this.replay = this.add
      .sprite(
        this._canvaswidth * 0.72,
        this.fbshare.y + this.scoreboard.displayHeight * 0.8,
        'replay'
      )
      .setScale(1.2)
      .setDepth(20)
      .setInteractive()
      .on('pointerdown', this.playagain.bind(this))

    this.totalScore = this.add
      .text(
        this.scoreboard.x + this.scoreboard.displayWidth * 0.2,
        this.scoreboard.y - this.scoreboard.displayHeight * 0.19,
        sum,
        {
          fontFamily: 'Arial',
          fontSize: 64,
          color: '#F8D28C',
        }
      )
      .setOrigin(0.5)
      .setDepth(20)

    this.highScore = this.add
      .text(
        this.scoreboard.x + this.scoreboard.displayWidth * 0.2,
        this.scoreboard.y + this.scoreboard.displayHeight * 0.17,
        '8000',
        {
          fontFamily: 'Arial',
          fontSize: 64,
          color: '#F8D28C',
        }
      )
      .setOrigin(0.5)
      .setDepth(20)

    var scoreAPI =
      'https://8btazx6thc.execute-api.ap-south-1.amazonaws.com/getscores?skip=0&limit=1'
    fetch(scoreAPI)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        /* console.log(data.length) */
        this.highScore.text = data[0].score
      })
  }

  fbshareopen() {
    mixpanel.track('CTAs', {
      Element: 'Share',
    })
    /* FB.ui(
      {
        method: 'share',
        href: 'https://happu.zee5.com/',
        image: 'https://happu.zee5.com/FbImg.png',
        description: 'Play Happu Ki Nikli Savaari',
        title: 'Happu Ki Nikli Savaari',
      },
      function (response) {
        if (response && response.post_id) {
          alert('Post was published.')
          gtag('event', 'Shared_To_FB')
        } else {
          alert('Post was not published.')
          gtag('event', 'Did_Not_Share')
        }
      }
    ) */
  }

  getRandomInt(max) {
    var num = Math.floor(Math.random() * Math.floor(max))
    if (num == 0) {
      this.getRandomInt(max)
    } else {
      return num.toString()
    }
  }

  gotoplay2() {
    mixpanel.track('CTAs', {
      Element: 'Play Next',
    })
    globalvariables.buttonpress.play()
    this.scene.start('Level')
  }

  gotoleader() {
    mixpanel.track('CTAs', {
      Element: 'Leaderboard',
    })
    globalvariables.buttonpress.play()
    this.scene.start('Complete')
  }

  playagain() {
    mixpanel.track('CTAs', {
      Element: 'Play Again',
    })

    globalvariables.buttonpress.play()
    this.scene.start('Game')
  }
}
