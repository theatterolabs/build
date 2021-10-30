import { globalvariables } from '../util/globalvariables'
import { scalecanvas } from '../util/scalecanvas'
import $ from 'jquery'
export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {}
  onProgress(v) {}
  preload() {}
  create() {
    scalecanvas.call(this, true)
    this.newEnemy = false
    this.matchescompleted = false
    this.checkforUpdateBool = false
    /* globalvariables.level = 15 */

    if (globalvariables.level == 1 && !globalvariables.isgametutorialdone) {
      window.localStorage.setItem('gametutorial', true)
      globalvariables.isgametutorialdone = true

      document.getElementById('tutorialboard').style.opacity = 1
      document.getElementById('tutorialboard').style.zIndex = 100

      document
        .getElementById('nextbtnId')
        .addEventListener('click', function (e) {
          globalvariables.buttonpress.play()
          document.getElementById('p1').innerHTML = 'Use Booster Gems'
          document.getElementById('p2').innerHTML = 'To Deal More Damage'
          document.getElementById('tutorialimg').src = './assets/tutorial2.png'
          document.getElementById('nextbtnId').style.display = 'none'
          document.getElementById('donebtnId').style.display = 'block'
        })

      document
        .getElementById('donebtnId')
        .addEventListener('click', function (e) {
          globalvariables.buttonpress.play()
          document.getElementById('tutorialboard').style.opacity = 0
          document.getElementById('tutorialboard').style.zIndex = -1
        })
    }

    /* globalvariables.level = 1 */
    if (this.topspace > 150) {
      this.heightVal = 0.45
      this.rowVal = 8
    } else {
      this.heightVal = 0.5
      this.rowVal = 9
    }
    this.currentlevelscore = 0

    this.enemytotalHealth = 0

    globalvariables.totalEnemy =
      globalvariables.enemyArray[globalvariables.level - 1]
    globalvariables.lvlbgtrack.play()

    this.noOfEnemiesDestroyed = 0
    this.scaleValue = 1
    this.levelOver = false
    this.powerupcount = 0
    this.isdraggedGem = false
    this.destroyScore = 0
    this.shootcount = 0
    this.enemycount = 1
    this.enemyDied = false
    this.playerDied = false
    this.nextreadybool = false
    this.globalgraphics = this.add.graphics({
      fillStyle: { color: 0xffff00, alpha: 0 },
    })

    this.topgraphics = this.add.graphics()

    this.topgraphics.fillStyle(0x000000, 1)
    this.topgraphics.fillRect(
      0,
      0,
      this._canvaswidth,
      this._canvasheight * 0.35
    )
    this.topgraphics.setDepth(4)

    this.rect = new Phaser.Geom.Rectangle(
      this._canvaswidth * 0.1,
      this._canvasheight * this.heightVal,
      this._canvaswidth * 0.8,
      this._canvasheight * 0.6
    )

    this.globalgraphics.fillRectShape(this.rect)

    this.brickbg = this.add.sprite(
      this._canvaswidth * 0.5,
      this._canvasheight,
      'tilebg'
    )
    this.brickbg.setOrigin(0.5, 1).setDepth(1)
    this.brickbg.setScale(this.scaling * 1)

    this.backgrodnum = 0

    if (
      globalvariables.level === 1 ||
      globalvariables.level === 2 ||
      globalvariables.level === 3
    ) {
      this.backgrodnum = 0
    } else if (
      globalvariables.level === 4 ||
      globalvariables.level === 5 ||
      globalvariables.level === 6
    ) {
      this.backgrodnum = 1
    } else if (
      globalvariables.level === 7 ||
      globalvariables.level === 8 ||
      globalvariables.level === 9
    ) {
      this.backgrodnum = 2
    } else if (
      globalvariables.level === 10 ||
      globalvariables.level === 11 ||
      globalvariables.level === 12
    ) {
      this.backgrodnum = 3
    } else if (
      globalvariables.level === 13 ||
      globalvariables.level === 14 ||
      globalvariables.level === 15
    ) {
      this.backgrodnum = 4
    }

    this.gamefloor = this.add.sprite(
      this._canvaswidth * 0.5,
      this._canvasheight * 0.38,
      'gamefloor'
    )
    this.gamefloor.setOrigin(0.5, 0).setDepth(4)
    this.gamefloor.setScale(this.scaling * 1)

    this.bg = this.add.sprite(
      this._canvaswidth * 0.5,
      this._canvasheight * 0.4,
      'backdrop' + this.backgrodnum
    )
    this.bg.setOrigin(0.5, 1).setDepth(4)
    this.bg.setScale(this.scaling * 1.2)

    this.bg.y = this._canvasheight * 0.42

    this.floorstrip = this.add.sprite(
      this._canvaswidth * 0.5,
      this._canvasheight * 0.4,
      'floorstrip'
    )
    this.floorstrip.setOrigin(0.5, 0.5).setDepth(4)
    this.floorstrip.setScale(this.scaling * 1)

    this.floorstrip.y = this.gamefloor.y + this.gamefloor.displayHeight * 0.8

    this.pillarleft = this.add.sprite(0, this._canvasheight, 'pillarleft')
    this.pillarleft.setOrigin(1, 0).setDepth(2)
    this.pillarleft.setScale(this.scaling * 0.7)
    this.pillarleft.x = this.pillarleft.displayWidth
    this.pillarleft.y = this.floorstrip.y + this.floorstrip.displayHeight * 0.5

    this.pillarright = this.add.sprite(0, this._canvasheight, 'pillarright')
    this.pillarright.setOrigin(0, 0).setDepth(2)
    this.pillarright.setScale(this.scaling * 0.7)
    this.pillarright.x = this._canvaswidth - this.pillarright.displayWidth
    this.pillarright.y = this.floorstrip.y + this.floorstrip.displayHeight * 0.5

    this.soundoff = this.add.sprite(0, 0, 'soundon')
    this.soundoff.setOrigin(0).setDepth(5)
    this.soundoff.setScale(this.scaling * 1)

    this.soundoff.name = 'on'
    this.soundoff.setInteractive().on('pointerdown', this.clicksound.bind(this))

    this.soundoff.x = this._canvaswidth * 0.05 + this.leftspace
    this.soundoff.y = this._canvaswidth * 0.05 + this.topspace

    this.star = this.add
      .sprite(
        this._canvaswidth * 0.5,
        this._canvasheight * 0.5,
        'star' + (globalvariables.starsArray[globalvariables.level - 1] + 1)
      )
      .setOrigin(1, 0)
      .setScale(this.scaling * 0.5)
      .setDepth(5)

    this.star.x =
      this._canvaswidth * 0.95 -
      this.leftspace /* -this.soundoff.displayWidth * 0.3 */
    this.star.y = this.soundoff.displayWidth * 0.3 + this.topspace

    this.kills = this.add
      .sprite(this._canvaswidth * 0.5, this._canvasheight * 0.5, 'kills')
      .setOrigin(1, 0.5)
      .setScale(this.scaling * 1)
      .setDepth(5)

    this.kills.x = this._canvaswidth - this.soundoff.displayWidth * 0.3
    this.kills.y = this.star.y + this.star.displayHeight * 1.6 + this.topspace

    this.wd = this._canvaswidth * 0.1
    this.hd = this._canvasheight * this.heightVal

    this.canPick = false
    this.dragging = false
    globalvariables.gemSize =
      (this._canvaswidth * 0.8) / globalvariables.fieldSize
    this.drawField()
    this.selectedGem = null
    this.initialTime = 60
    this.bannerBool = false
    this.score = 0

    this.input.on('pointerdown', this.gemSelect, this)
    this.input.on('pointermove', this.startSwipe, this)
    this.input.on('pointerup', this.stopSwipe, this)

    this.addCharacters()
    this.addScoreValue(100, 100, 100)

    this.hiteffect = this.add
      .sprite(
        this._canvaswidth * 5,
        this._canvasheight * 0.5,
        'hitenemyeffect',
        'LayerHitEnemy1.png'
      )
      .setScale(this.scaling * 1)
      .setOrigin(0.5)
      .setDepth(5)

    this.anims.create({
      key: 'hitting',
      frames: this.anims.generateFrameNames('hitenemyeffect', {
        prefix: 'LayerHitEnemy',
        start: 1,
        end: 4,
        zeroPad: 1,
        suffix: '.png',
      }),
      repeat: 0,
    })

    this.hiteffecthero = this.add
      .sprite(
        this._canvaswidth * 5,
        this._canvasheight * 0.5,
        'hitheroeffect',
        'LayerHitHero1.png'
      )
      .setScale(this.scaling * 1)
      .setOrigin(0.5)
      .setDepth(5)

    this.anims.create({
      key: 'hittinghero',
      frames: this.anims.generateFrameNames('hitheroeffect', {
        prefix: 'LayerHitHero',
        start: 1,
        end: 6,
        zeroPad: 1,
        suffix: '.png',
      }),
      repeat: 0,
    })

    this.thundereffect = this.add
      .sprite(
        this._canvaswidth * 5,
        this._canvasheight * 0.5,
        'atlas',
        'bolt_ball_0001.png'
      )
      .setScale(this.scaling * 5)
      .setOrigin(0.5)
      .setDepth(10)

    this.anims.create({
      key: 'thunderHit',
      frames: this.anims.generateFrameNames('atlas', {
        prefix: 'bolt_ball_',
        start: 1,
        end: 10,
        zeroPad: 4,
        suffix: '.png',
      }),
      repeat: 2,
    })

    this.anims.create({
      key: 'thunderStrike',
      frames: this.anims.generateFrameNames('atlas', {
        prefix: 'bolt_strike_',
        start: 1,
        end: 10,
        zeroPad: 4,
        suffix: '.png',
      }),
      repeat: 2,
    })

    this.anims.create({
      key: 'thunderSizzle',
      frames: this.anims.generateFrameNames('atlas', {
        prefix: 'bolt_sizzle_',
        start: 1,
        end: 10,
        zeroPad: 4,
        suffix: '.png',
      }),
      repeat: 2,
    })

    this.levelOver = true
    /* this.thundereffect.play('thunderSizzle') */

    /* this.hiteffect.play('thunder') */
  }

  getRandomInt(max) {
    var num = Math.floor(Math.random() * Math.floor(max))
    if (num == 0) {
      this.getRandomInt(max)
    } else {
      return num.toString()
    }
  }

  clicksound() {
    globalvariables.buttonpress.play()
    if (this.soundoff.name == 'off') {
      this.soundoff.name = 'on'
      globalvariables.lvlbgtrack.play()
    } else if (this.soundoff.name == 'on') {
      this.soundoff.name = 'off'
      globalvariables.lvlbgtrack.pause()
    }
    this.soundoff.setTexture('sound' + this.soundoff.name)
  }

  getRandomIntRange(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  formatTime(seconds) {
    // Minutes
    var minutes = Math.floor(seconds / 60)
    // Seconds
    var partInSeconds = seconds % 60
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2, '0')
    // Returns formated time
    return `${partInSeconds}`
  }

  drawField() {
    this.gameArray = []
    this.poolArray = []
    this.gemGroup = this.add.group()
    for (let i = 0; i < globalvariables.fieldSize; i++) {
      this.gameArray[i] = []
      for (let j = 0; j < globalvariables.fieldSize; j++) {
        let gem = this.add.sprite(
          globalvariables.gemSize * j +
            globalvariables.gemSize / 2 /* + this._canvaswidth * 0.1 */,
          globalvariables.gemSize * i +
            globalvariables.gemSize / 2 /* + this._canvasheight * 0.4 */,
          'gem1'
        )
        gem.setOrigin(0.5).setDepth(3)

        gem.x =
          globalvariables.gemSize * j + globalvariables.gemSize / 2 + this.wd
        gem.y =
          globalvariables.gemSize * i + globalvariables.gemSize / 2 + this.hd
        this.gemGroup.add(gem)
        do {
          let randomColor = Phaser.Math.Between(
            0,
            globalvariables.gemColors - 1
          )

          gem.setTexture(this.getTextureName(gem, randomColor))

          gem.setScale(this.scaleValue)
          this.gameArray[i][j] = {
            gemColor: randomColor,
            gemSprite: gem,
            isEmpty: false,
          }
        } while (this.isMatch(i, j))
      }
    }
  }
  isMatch(row, col) {
    return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col)
  }
  isHorizontalMatch(row, col) {
    return (
      this.gemAt(row, col).gemColor == this.gemAt(row, col - 1).gemColor &&
      this.gemAt(row, col).gemColor == this.gemAt(row, col - 2).gemColor
    )
  }
  isVerticalMatch(row, col) {
    return (
      this.gemAt(row, col).gemColor == this.gemAt(row - 1, col).gemColor &&
      this.gemAt(row, col).gemColor == this.gemAt(row - 2, col).gemColor
    )
  }
  gemAt(row, col) {
 

    if (
      row < 0 ||
      row >= globalvariables.fieldSize ||
      col < 0 ||
      col >= globalvariables.fieldSize
    ) {
      return -1
    }
    return this.gameArray[row][col]
  }
  gemSelect(pointer) {
    if (this.canPick && this.rect.contains(pointer.x, pointer.y)) {

      this.dragging = true
      let row = Math.floor(pointer.y / globalvariables.gemSize) - this.rowVal
      let col = Math.floor(pointer.x / globalvariables.gemSize) - 1

      let pickedGem = this.gemAt(row, col)

      if (pickedGem != -1) {

        if (this.selectedGem == null) {

          pickedGem.gemSprite.setScale(this.scaleValue * 1.3)
          pickedGem.gemSprite.setDepth(3)
          this.selectedGem = pickedGem
        } else {

          if (this.areTheSame(pickedGem, this.selectedGem)) {
            this.selectedGem.gemSprite.setScale(this.scaleValue)
            this.selectedGem = null
          } else {

            if (this.areNext(pickedGem, this.selectedGem)) {

              this.selectedGem.gemSprite.setScale(this.scaleValue)
              this.swapGems(this.selectedGem, pickedGem, true)
            } else {

              this.selectedGem.gemSprite.setScale(this.scaleValue)
              pickedGem.gemSprite.setScale(this.scaleValue * 1.3)
              this.selectedGem = pickedGem
            }
          }
        }
      }
    }
  }
  startSwipe(pointer) {

    if (this.dragging && this.selectedGem != null) {
      let deltaX = pointer.downX - pointer.x
      let deltaY = pointer.downY - pointer.y
      let deltaRow = 0
      let deltaCol = 0
      if (
        deltaX > globalvariables.gemSize / 2 &&
        Math.abs(deltaY) < globalvariables.gemSize / 4
      ) {
        deltaCol = -1
      }
      if (
        deltaX < -globalvariables.gemSize / 2 &&
        Math.abs(deltaY) < globalvariables.gemSize / 4
      ) {
        deltaCol = 1
      }
      if (
        deltaY > globalvariables.gemSize / 2 &&
        Math.abs(deltaX) < globalvariables.gemSize / 4
      ) {
        deltaRow = -1
      }
      if (
        deltaY < -globalvariables.gemSize / 2 &&
        Math.abs(deltaX) < globalvariables.gemSize / 4
      ) {
        deltaRow = 1
      }
      if (deltaRow + deltaCol != 0) {
        let pickedGem = this.gemAt(
          this.getGemRow(this.selectedGem) + deltaRow,
          this.getGemCol(this.selectedGem) + deltaCol
        )
        /* console.log(pickedGem, 'opinion') */
        if (pickedGem != -1) {
          /* console.log(pickedGem, 'opinion') */
          this.selectedGem.gemSprite.setScale(this.scaleValue)
          this.swapGems(this.selectedGem, pickedGem, true)
          this.dragging = false
        }
      }
    }
  }
  stopSwipe() {
    /* console.log('stopSwipe') */
    this.dragging = false
  }
  areTheSame(gem1, gem2) {
    /* console.log('areTheSame') */
    return (
      this.getGemRow(gem1) == this.getGemRow(gem2) &&
      this.getGemCol(gem1) == this.getGemCol(gem2)
    )
  }
  getGemRow(gem) {
    /* console.log('getGemRow', Math.floor(gem.gemSprite.y / globalvariables.gemSize)) */
    return Math.floor(gem.gemSprite.y / globalvariables.gemSize) - this.rowVal
  }
  getGemCol(gem) {
    /* console.log('getGemCol', Math.floor(gem.gemSprite.x / globalvariables.gemSize) - 1) */
    return Math.floor(gem.gemSprite.x / globalvariables.gemSize) - 1
  }
  areNext(gem1, gem2) {
    return (
      Math.abs(this.getGemRow(gem1) - this.getGemRow(gem2)) +
        Math.abs(this.getGemCol(gem1) - this.getGemCol(gem2)) ==
      1
    )
  }
  swapGems(gem1, gem2, swapBack) {
    this.swappingGems = 2
    this.canPick = false
    let fromColor = gem1.gemColor
    let fromSprite = gem1.gemSprite
    let toColor = gem2.gemColor
    let toSprite = gem2.gemSprite
    let gem1Row = this.getGemRow(gem1)
    let gem1Col = this.getGemCol(gem1)
    let gem2Row = this.getGemRow(gem2)
    let gem2Col = this.getGemCol(gem2)
    /* console.log(gem1Row, gem1Col, gem2Row, gem2Col) */
    this.gameArray[gem1Row][gem1Col].gemColor = toColor
    this.gameArray[gem1Row][gem1Col].gemSprite = toSprite
    this.gameArray[gem2Row][gem2Col].gemColor = fromColor
    this.gameArray[gem2Row][gem2Col].gemSprite = fromSprite
    this.tweenGem(gem1, gem2, swapBack)
    this.tweenGem(gem2, gem1, swapBack)
  }
  tweenGem(gem1, gem2, swapBack) {
    let row = this.getGemRow(gem1)
    let col = this.getGemCol(gem1)
    this.tweens.add({
      targets: this.gameArray[row][col].gemSprite,
      x:
        col * globalvariables.gemSize +
        globalvariables.gemSize / 2 +
        this._canvaswidth * 0.1,
      y:
        row * globalvariables.gemSize +
        globalvariables.gemSize / 2 +
        this._canvasheight * this.heightVal,
      duration: globalvariables.swapSpeed,
      callbackScope: this,
      onComplete: function () {
        this.swappingGems--
        if (this.swappingGems == 0) {
          if (!this.matchInBoard() && swapBack) {
            globalvariables.switchfail.play()
            this.swapGems(gem1, gem2, false)
          } else {
            globalvariables.switchsuccess.play()
            if (this.matchInBoard()) {
              this.isdraggedGem = true

              this.handleMatches()
            } else {
              this.isdraggedGem = false
              this.canPick = true
              this.selectedGem = null
            }
          }
        }
      },
    })
  }
  matchInBoard() {
    for (let i = 0; i < globalvariables.fieldSize; i++) {
      for (let j = 0; j < globalvariables.fieldSize; j++) {
        if (this.isMatch(i, j)) {
          return true
        }
      }
    }
    return false
  }
  handleMatches() {
    this.removeMap = []
    for (let i = 0; i < globalvariables.fieldSize; i++) {
      this.removeMap[i] = []
      for (let j = 0; j < globalvariables.fieldSize; j++) {
        this.removeMap[i].push(0)
      }
    }
    this.markMatches(globalvariables.HORIZONTAL)
    this.markMatches(globalvariables.VERTICAL)
    this.score += 10

    this.destroyGems()
  }

  markMatches(direction) {
    for (let i = 0; i < globalvariables.fieldSize; i++) {
      let colorStreak = 1
      let currentColor = -1
      let startStreak = 0
      let colorToWatch = 0
      for (let j = 0; j < globalvariables.fieldSize; j++) {
        if (direction == globalvariables.HORIZONTAL) {
          colorToWatch = this.gemAt(i, j).gemColor
        } else {
          colorToWatch = this.gemAt(j, i).gemColor
        }
        if (colorToWatch == currentColor) {
          colorStreak++
        }
        if (
          colorToWatch != currentColor ||
          j == globalvariables.fieldSize - 1
        ) {
          if (colorStreak >= 3) {
            for (let k = 0; k < colorStreak; k++) {
              if (direction == globalvariables.HORIZONTAL) {
                this.removeMap[i][startStreak + k]++
              } else {
                this.removeMap[startStreak + k][i]++
              }
            }
          }
          startStreak = j
          colorStreak = 1
          currentColor = colorToWatch
        }
      }
    }
  }
  destroyGems() {
    let destroyed = 0
    let countdestroyedgems = 0
    for (let i = 0; i < globalvariables.fieldSize; i++) {
      for (let j = 0; j < globalvariables.fieldSize; j++) {
        if (this.removeMap[i][j] > 0) {
          destroyed++
          countdestroyedgems++
          this.tweens.add({
            targets: this.gameArray[i][j].gemSprite,
            alpha: 0.5,
            duration: globalvariables.destroySpeed,
            callbackScope: this,
            onComplete: function () {
              destroyed--
              this.gameArray[i][j].gemSprite.visible = false
              this.poolArray.push(this.gameArray[i][j].gemSprite)
              /* console.log(this.gameArray[i][j].gemSprite.powerupname , " O") */
              if (this.gameArray[i][j].gemSprite.powerupname != '') {
                this.powerupcount++
                /* console.log(this.powerupcount , "this.powerupcount") */
              }

              if (destroyed == 0) {
                if (this.powerupcount > 0) {
                  globalvariables.boostercrush.play()
                  this.thundereffect.x = this.gameArray[i][j].gemSprite.x
                  this.thundereffect.y = this.gameArray[i][j].gemSprite.y
                  let yyyy = this.thundereffect.play(
                    Math.random() < 0.5 ? 'thunderStrike' : 'thunderSizzle'
                  )
                  yyyy.on(
                    'animationcomplete',
                    function () {
                      this.thundereffect.x = this._canvaswidth * 5
                    }.bind(this)
                  )
                } else {
                  globalvariables.crush.play()
                }

                this.currentlevelscore +=
                  (countdestroyedgems - this.powerupcount) * 5 +
                  this.powerupcount * 10

                this.destroyScore =
                  countdestroyedgems * 2 +
                  globalvariables.heroAttack +
                  this.powerupcount * 25
                /* console.log(this.destroyScore , "this.destroyScore") */
                this.setValue(
                  this.gameArray[i][j].gemSprite.x,
                  this.gameArray[i][j].gemSprite.y,
                  this.destroyScore,
                  this.powerupcount,
                  countdestroyedgems
                )

                this.powerupcount = 0
                this.makeGemsFall()
                this.replenishField()
                console.log(this.enemyDied, this.char2score)
                if (!this.enemyDied) this.shootBullet()
              }
            },
          })
          this.gameArray[i][j].isEmpty = true
        }
      }
    }
  }
  makeGemsFall() {
    globalvariables.gemfall.play()
    for (let i = globalvariables.fieldSize - 2; i >= 0; i--) {
      for (let j = 0; j < globalvariables.fieldSize; j++) {
        if (!this.gameArray[i][j].isEmpty) {
          let fallTiles = this.holesBelow(i, j)
          if (fallTiles > 0) {
            this.tweens.add({
              targets: this.gameArray[i][j].gemSprite,
              y:
                this.gameArray[i][j].gemSprite.y +
                fallTiles * globalvariables.gemSize,
              duration: globalvariables.fallSpeed * fallTiles,
            })
            this.gameArray[i + fallTiles][j] = {
              gemSprite: this.gameArray[i][j].gemSprite,
              gemColor: this.gameArray[i][j].gemColor,
              isEmpty: false,
            }
            /* console.log(
              this.gameArray[i][j].gemColor,
              ' this.gameArray[i][j].gemColor'
            ) */
            this.gameArray[i][j].isEmpty = true
          }
        }
      }
    }
  }

  addScoreValue(x, y, num) {
    this.scoreVal = this.add.text(x, y, '', {
      fontFamily: 'font2',
      fontSize: 100,
      color: '#ffffff',
    })
    this.scoreVal.setDepth(3)
  }

  setValue(x, y, num, power, collection) {
    clearTimeout(this.checktmr)
    this.scoreVal.text = '+' + num
    this.scoreVal.x = x
    this.scoreVal.y = y

    this.checktmr = setTimeout(() => {
      clearTimeout(this.checktmr)
      this.scoreVal.text = ''
    }, 500)
  }

  holesBelow(row, col) {
    let result = 0
    for (let i = row + 1; i < globalvariables.fieldSize; i++) {
      if (this.gameArray[i][col].isEmpty) {
        result++
      }
    }
    return result
  }
  replenishField() {
    let replenished = 0
    for (let j = 0; j < globalvariables.fieldSize; j++) {
      let emptySpots = this.holesInCol(j)
      if (emptySpots > 0) {
        for (let i = 0; i < emptySpots; i++) {
          replenished++
          let randomColor = null
          /* if (Math.random() > 0.5) {
            randomColor =
              Phaser.Math.Between(0, globalvariables.gemColors - 1) + globalvariables.gemColors
          } else { */
          randomColor = Phaser.Math.Between(0, globalvariables.gemColors - 1)
          /* } */

          this.gameArray[i][j].gemColor = randomColor
          this.gameArray[i][j].gemSprite = this.poolArray.pop()
          /* console.log(randomColor, 'randomColor2') */
          this.gameArray[i][j].gemSprite.setTexture(
            this.getTextureName(this.gameArray[i][j].gemSprite, randomColor)
          )
          this.gameArray[i][j].gemSprite.visible = true
          this.gameArray[i][j].gemSprite.x =
            globalvariables.gemSize * j + globalvariables.gemSize / 2 + this.wd
          this.gameArray[i][j].gemSprite.y =
            globalvariables.gemSize / 2 -
            (emptySpots - i) * globalvariables.gemSize
          this.gameArray[i][j].gemSprite.alpha = 1
          this.gameArray[i][j].isEmpty = false
          this.tweens.add({
            targets: this.gameArray[i][j].gemSprite,
            y:
              globalvariables.gemSize * i +
              globalvariables.gemSize / 2 +
              this.hd,
            duration: globalvariables.fallSpeed * 2 * emptySpots,
            callbackScope: this,
            onComplete: function () {
              replenished--
              if (replenished == 0) {
                if (this.matchInBoard()) {
                  this.time.addEvent({
                    delay: 250,
                    callback: this.handleMatches(),
                  })
                } else {
                  this.canPick = true
                  this.selectedGem = null
                  /* console.log(
                    'attacck complete',
                    this.char2score,
                    this.newEnemy,
                    this.playerDied
                  ) */

                  this.newEnemy = false
                  setTimeout(() => {
                    /* console.log(this.char2score) */
                    if (!this.enemyDied && !this.newEnemy) {
                      if (this.char2score <= 0) {
                        /* this.nextenemy() */
                      } else {
                        this.moveenemy()
                      }
                    }
                  }, 1000)

                  /* if (!this.enemyDied) {
                    this.moveenemy()
                  } else if (this.enemyDied) {
                    this.nextenemy()
                  } */
                  /* this.checkAttackBool = true */
                  /* console.log(
                    'check dead',
                    this.char2score,
                    this.enemyDied,
                    this.char2score
                  ) */
                }
              }
            },
          })
        }
      }
    }
  }

  getTextureName(spr, num) {
    let gemspr = ''
    if (Math.random() < 0.9) {
      spr.powerupname = ''
      gemspr = 'gem' + num
    } else {
      if (
        globalvariables.level === 1 ||
        globalvariables.level === 2 ||
        globalvariables.level === 3
      ) {
        if (num == 3) {
          spr.powerupname = 'bow'
          gemspr = 'powerup0'
        } else {
          spr.powerupname = ''
          gemspr = 'gem' + num
        }
      } else if (
        globalvariables.level === 4 ||
        globalvariables.level === 5 ||
        globalvariables.level === 6
      ) {
        if (num == 1) {
          spr.powerupname = 'bow'
          gemspr = 'powerup1'
        } else {
          spr.powerupname = ''
          gemspr = 'gem' + num
        }
      } else if (
        globalvariables.level === 7 ||
        globalvariables.level === 8 ||
        globalvariables.level === 9
      ) {
        if (num == 2) {
          spr.powerupname = 'bow'
          gemspr = 'powerup2'
        } else {
          spr.powerupname = ''
          gemspr = 'gem' + num
        }
      } else if (
        globalvariables.level === 10 ||
        globalvariables.level === 11 ||
        globalvariables.level === 12
      ) {
        if (num == 0) {
          spr.powerupname = 'bow'
          gemspr = 'powerup3'
        } else {
          spr.powerupname = ''
          gemspr = 'gem' + num
        }
      } else if (
        globalvariables.level === 13 ||
        globalvariables.level === 14 ||
        globalvariables.level === 15
      ) {
        /* console.log('>>>>>>>>>>>') */
        if (num == 2) {
          spr.powerupname = 'bow'
          gemspr = 'powerup4'
        } else {
          spr.powerupname = ''
          gemspr = 'gem' + num
        }
      }
    }
    /* console.log(gemspr) */
    return gemspr
  }

  holesInCol(col) {
    var result = 0
    for (let i = 0; i < globalvariables.fieldSize; i++) {
      if (this.gameArray[i][col].isEmpty) {
        result++
      }
    }
    return result
  }

  /////////////////////////////////////////////////////CHARACTERS//////////////////////////////////////////////////////////////////////////////////////

  addCharacters() {
    this.addBullet()

    this.addRakshas()
  }

  addBullet() {
    this.bullet = this.add.sprite(
      this._canvaswidth * 0.5,
      this._canvasheight * 0.5,
      'bullet'
    )
    this.bullet.setScale(this.scaling * 0.8)
    this.bullet.setOrigin(0.5, 0.5)
    this.bullet.setDepth(5)
  }

  addRakshas() {
    this.currentrakshas = this.getRakshasAccordingtoLevel()
    if (this.currentrakshas == 6) {
      this.currentrakshas = 5
    }
    this.endframewalk = 4
    this.endframeattack = 4
    this.char2 = this.add
      .sprite(
        this._canvaswidth * 0.5,
        this._canvasheight * 0.5,
        'rakshas',
        'Rakshas_' + this.currentrakshas + '_Idle.png'
      )
      .setScale(this.scaling * 1.3)
      .setOrigin(0.5, 1)
      .setDepth(5)

    if (this.currentrakshas == 1) {
      this.endframewalk = 4
      this.endframeattack = 6
    } else {
      this.endframewalk = 4
      this.endframeattack = 4
    }

    this.anims.create({
      key: 'attackRakshas' + this.currentrakshas,
      frames: this.anims.generateFrameNames('rakshas', {
        prefix: 'Rakshas_' + this.currentrakshas + '_Attack_',
        start: 1,
        end: this.endframeattack,
        zeroPad: 1,
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: 0,
    })

    this.anims.create({
      key: 'walkRakshas' + this.currentrakshas,
      frames: this.anims.generateFrameNames('rakshas', {
        prefix: 'Rakshas_' + this.currentrakshas + '_Walk_',
        start: 1,
        end: this.endframewalk,
        zeroPad: 1,
        suffix: '.png',
      }),
      frameRate: 5,
      repeat: -1,
    })

    this.addHero()
  }

  addHero() {
    this.char1 = this.add
      .sprite(
        this._canvaswidth * 0.5,
        this._canvasheight * 0.5,
        'hero',
        'Boy_Idle.png'
      )
      .setScale(this.scaling * 0.2)
      .setOrigin(0.5, 1)
      .setDepth(5)

    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNames('hero', {
        prefix: 'Boy_Attack_',
        start: 1,
        end: 8,
        zeroPad: 1,
        suffix: '.png',
      }),
      repeat: 0,
    })

    this.char2.x = this._canvaswidth * -0.2
    this.char2.y = this.gamefloor.y + this.gamefloor.displayHeight * 0.3

    this.char1.x = this._canvaswidth * 0.8
    this.char1.y = this.gamefloor.y + this.gamefloor.displayHeight * 0.3

    this.bullet.scaleX *= -1
    this.bullet.x = this._canvaswidth * 0.8
    this.bullet.y = this.gamefloor.y - this.gamefloor.displayHeight * 0.8

    this.addHealth()
  }

  getRakshasAccordingtoLevel() {
    if (
      globalvariables.level == 1 ||
      globalvariables.level == 2 ||
      globalvariables.level == 3 ||
      globalvariables.level == 4 ||
      globalvariables.level == 5
    ) {
      return this.getRandomIntRange(1, 3)
    } else if (
      globalvariables.level == 6 ||
      globalvariables.level == 7 ||
      globalvariables.level == 8 ||
      globalvariables.level == 9 ||
      globalvariables.level == 10
    ) {
      return this.getRandomIntRange(2, 4)
    } else if (
      globalvariables.level == 11 ||
      globalvariables.level == 12 ||
      globalvariables.level == 13 ||
      globalvariables.level == 14
    ) {
      return this.getRandomIntRange(3, 4)
    } else if (globalvariables.level == 15) {
      return 5
    }
  }

  addHealth() {
    this.char1score = globalvariables.heroHealth
    /* this.char2score = globalvariables.enemyHealth */
    /* console.log(globalvariables.level, 'globalvariables.level') */

    this.char2score = this.getRandomIntRange(
      globalvariables.enemyHealth[globalvariables.level - 1],
      globalvariables.enemyHealth[globalvariables.level]
    )
    this.enemytotalHealth = this.char2score

    this.backblack = this.add.sprite(0, this._canvasheight, 'backblack')
    this.backblack.setOrigin(0).setDepth(5)
    this.backblack.setScale(this.scaling * 0.7)

    this.backblack2 = this.add.sprite(0, this._canvasheight, 'backblack')
    this.backblack2.setOrigin(0).setDepth(5)
    this.backblack2.setScale(this.scaling * 0.7)

    this.red = this.add.sprite(0, this._canvasheight, 'red')
    this.red.setOrigin(0).setDepth(5)
    this.red.displayWidth = this.backblack.displayWidth

    this.green = this.add.sprite(0, this._canvasheight, 'green')
    this.green.setOrigin(0).setDepth(5)
    this.green.displayWidth = this.backblack2.displayWidth

    this.char1health = this.add.text(100, 200, this.char1score, {
      fontFamily: 'font2',
      fontSize: 64,
      color: '#ffffff',
    })
    this.char1health.setOrigin(0.5)
    this.char1health.setDepth(5)
    this.char2health = this.add.text(100, 200, this.char2score, {
      fontFamily: 'font2',
      fontSize: 64,
      color: '#ffffff',
    })
    this.char2health.setOrigin(0.5)
    this.char2health.setDepth(5)

    this.char1health.x = this.char1.x
    this.char2health.x = this.char2.x
    this.char1health.y = this.char1.y - this.char1.displayHeight
    this.char2health.y = this.char2.y - this.char1.displayHeight

    this.backblack.x = this.char1health.x - this.backblack.displayWidth / 2

    this.backblack.y = this.char1.y - this.char1.displayHeight * 1.2

    this.backblack2.x =
      this.char2health.x - this.backblack2.displayWidth / 2 /* -
    this.char2health.displayWidth +
    (this.backblack.displayWidth - this.char2.displayWidth) */
    this.backblack2.y = this.char2.y - this.char2.displayHeight * 1.2
    this.green.x = this.backblack.x
    this.green.y = this.backblack.y
    this.red.x = this.backblack2.x
    this.red.y = this.backblack2.y

    this.enemynumber = this.add.text(
      this._canvaswidth * 0.5,
      this._canvasheight * 0.05,
      /* 'LEVEL ' +
        globalvariables.level +
        ' : ENEMY ' + */
      this.enemycount + '/' + globalvariables.totalEnemy,
      {
        fontFamily: 'font2',
        fontSize: 64,
        color: '#ffffff',
      }
    )
    this.enemynumber.setOrigin(0.5)
    this.enemynumber.setDepth(5)

    this.enemynumber.x =
      this._canvaswidth * 0.95 -
      this.leftspace -
      this.enemynumber.displayWidth / 2
    this.enemynumber.y = this.star.y + this.star.displayHeight * 2

    this.kills.x = this.enemynumber.x - this.enemynumber.displayWidth * 0.8
    this.kills.y =
      this.star.y +
      this.star.displayHeight *
        2 /* this.enemynumber.y - this.enemynumber.displayHeight *.4 */

    this.destroyvalEnemy = this.add.text(
      this.char2.x + this.char2.displayWidth,
      this.char2.y - this.char2.displayHeight,
      '',
      {
        fontFamily: 'font2',
        fontSize: 54,
        color: '#ff0000',
      }
    )
    this.destroyvalEnemy.setOrigin(0.5)
    this.destroyvalEnemy.setDepth(5)
    this.destroyvalHero = this.add.text(
      this.char1.x + this.char1.displayWidth,
      this.char1.y - this.char1.displayHeight,
      '',
      {
        fontFamily: 'font2',
        fontSize: 54,
        color: '#ff0000',
      }
    )
    this.destroyvalHero.setOrigin(0.5)
    this.destroyvalHero.setDepth(5)

    this.char1health.y = this.char1.y - this.char1.displayHeight * 1.4
    this.char2health.y = this.char2.y - this.char2.displayHeight * 1.4

    this.char2.play('walkRakshas' + this.currentrakshas)

    this.tweenRakshas()
  }

  tweenRakshas() {
    this.canPick = false
    let tween = this.tweens.add({
      targets: this.char2,
      x: this._canvaswidth * 0.2,
      ease: 'Power1',
      duration: 2000,
      yoyo: false,
      repeat: 0,
      delay: 1000,
      onComplete: function () {
        tween.stop()
        globalvariables.rakshasentry.play()
        this.char2.stop('walkRakshas' + this.currentrakshas)
        this.char2.setFrame('Rakshas_' + this.currentrakshas + '_Idle.png')
        this.canPick = true
      }.bind(this),
    })
  }

  draw(width1, width2, spr, color1, color2, bar) {
    bar.clear()

    //  BG
    bar.fillStyle(color1)
    bar.fillRect(
      spr.x - spr.displayWidth * 0.55,
      spr.y - spr.displayHeight * 1.2,
      width1,
      30
    )

    //  Health

    bar.fillStyle(color2)
    bar.fillRect(
      spr.x + 2 - spr.displayWidth * 0.55,
      spr.y - spr.displayHeight * 1.2 + 2,
      width2,
      25
    )
  }

  shootBullet() {
    this.char1.play('attack')

    /* console.log('shootBullet', this.char2score, this.enemyDied) */

    let tween = this.tweens.add({
      targets: this.bullet,
      x: this.char2.x + this.char2.displayWidth * 0.2,
      ease: 'Power1',
      duration: 500,
      yoyo: false,
      repeat: 0,
      onComplete: function () {
        tween.stop()
        if (this.char2score > 1) {
          this.char2score -= this.destroyScore
          globalvariables.rakshashit.play()
          this.hiteffect.x = this.bullet.x
          this.hiteffect.y = this.bullet.y
          this.hiteffect.play('hitting')

          if ((this.char2score / this.enemytotalHealth).toFixed(1) > 0) {
            this.red.displayWidth =
              this.backblack.displayWidth *
              (this.char2score / this.enemytotalHealth).toFixed(1)
          } else {
            this.red.displayWidth = 0
            this.char2score = 0
            this.enemyDied = true
            this.killenemy()
            /* console.log('enemykilled') */
          }
          this.char2health.text = this.char2score
          this.bullet.x = this.char1.x
          if (this.isdraggedGem) {
            this.isdraggedGem = false

            /* if (!this.enemyDied || !this.playerDied) this.moveenemy() */
          }
          this.destroyvalEnemy.text = '-' + this.destroyScore

          let y = setTimeout(() => {
            clearTimeout(y)
            this.destroyvalEnemy.text = ''
            this.hiteffect.x = this._canvaswidth * 5
            /* console.log('canpick', this.canPick) */
          }, 200)
        }
      }.bind(this),
    })
  }

  shootBulletEnemy() {
    this.char2.play('attackRakshas' + this.currentrakshas)
    let rr = setTimeout(() => {
      clearTimeout(rr)
      this.char1score -= globalvariables.enemyAttack
      this.destroyvalHero.text = '-' + globalvariables.enemyAttack
      if (this.char1score < 0) {
        this.char1score = 0
      }
      globalvariables.boyhit.play()
      this.char1health.text = this.char1score
      if ((this.char1score / 100).toFixed(1) > 0) {
        this.green.displayWidth =
          this.backblack2.displayWidth * (this.char1score / 100).toFixed(1)
      } else {
        this.green.displayWidth = 0
        this.playerDied = true
        this.playplayeranimation()
      }
      this.hiteffecthero.x = this.char1.x
      this.hiteffecthero.y = this.bullet.y
      this.hiteffecthero.play('hittinghero')
      /* this.draw(
        this.herovalue,
        this.herovalue2 * (this.char1score / 100).toFixed(1),
        this.char2,
        0xffffff,
        0xff0000,
        this.bar2
      ) */
      this.canPick = true
      let y = setTimeout(() => {
        clearTimeout(y)
        this.destroyvalHero.text = ''
        this.hiteffecthero.x = this._canvaswidth * 5
      }, 500)
    }, 500)
  }

  moveenemy() {
    this.shootcount++
    this.canPick = false
    /* console.log(this.shootcount, 'shootcount') */
    if (this.shootcount <= 3) {
      /* console.log('moveenemy', this.char2score) */
      this.char2.play('walkRakshas' + this.currentrakshas)

      let tween = this.tweens.add({
        targets: this.char2,
        x: this.char2.x + this._canvaswidth * 0.15,
        ease: 'Power1',
        duration: 1000,
        yoyo: false,
        repeat: 0,
        onComplete: function () {
          tween.stop()

          this.char2.stop('walkRakshas' + this.currentrakshas)
          this.char2.setFrame('Rakshas_' + this.currentrakshas + '_Idle.png')
          this.canPick = true
          /* console.log('moveenemycomplete', this.char2score) */
        }.bind(this),
      })
    } else {
      /*  console.log(this.playerDied, this.enemyDied) */
      if (!this.playerDied && !this.enemyDied) this.shootBulletEnemy()
    }
  }

  nextenemy() {
    /* console.log('nextenemy') */
    this.newEnemy = true
    /* console.log(this.enemycount, globalvariables.enemyArray[globalvariables.level - 1], ':BEFORE') */
    this.noOfEnemiesDestroyed++
    if (
      this.enemycount < globalvariables.enemyArray[globalvariables.level - 1]
    ) {
      this.playerDied = false

      this.enemycount++
      this.char2score = this.getRandomIntRange(
        globalvariables.enemyHealth[globalvariables.level - 1],
        globalvariables.enemyHealth[globalvariables.level]
      )
      this.enemytotalHealth = this.char2score
      this.red.displayWidth = this.backblack2.displayWidth

      this.char2.x = this._canvaswidth * -0.2

      this.char2health.text = this.char2score
      this.char2health.x = this.char2.x
      this.backblack2.x = this.char2health.x - this.backblack2.displayWidth / 2
      this.red.x = this.backblack2.x
      this.shootcount = 0
      this.char2health.text = this.char2score
      this.enemynumber.text = this.enemycount + '/' + globalvariables.totalEnemy

      this.char2.play('walkRakshas' + this.currentrakshas)

      this.setstars = 0

      if (globalvariables.totalEnemy == 3) {
        if (this.noOfEnemiesDestroyed == 1) {
          globalvariables.lvlfail.play()
          this.setstars = 1
        } else if (this.noOfEnemiesDestroyed == 2) {
          globalvariables.lvlfail.play()
          this.setstars = 2
        } else if (this.noOfEnemiesDestroyed == 3) {
          globalvariables.lvlcomplete.play()
          this.setstars = 3
        }
      }

      if (globalvariables.totalEnemy == 4) {
        if (this.noOfEnemiesDestroyed == 1) {
          globalvariables.lvlfail.play()
          this.setstars = 0
        } else if (this.noOfEnemiesDestroyed == 2) {
          globalvariables.lvlfail.play()
          this.setstars = 1
        } else if (this.noOfEnemiesDestroyed == 3) {
          globalvariables.lvlfail.play()
          this.setstars = 2
        } else if (this.noOfEnemiesDestroyed == 4) {
          globalvariables.lvlcomplete.play()
          this.setstars = 3
        }
      }

      if (globalvariables.totalEnemy == 5) {
        if (this.noOfEnemiesDestroyed == 1) {
          globalvariables.lvlfail.play()
          this.setstars = 0
        } else if (this.noOfEnemiesDestroyed == 2) {
          globalvariables.lvlfail.play()
          this.setstars = 1
        } else if (this.noOfEnemiesDestroyed == 3) {
          globalvariables.lvlfail.play()
          this.setstars = 1
        } else if (this.noOfEnemiesDestroyed == 4) {
          globalvariables.lvlfail.play()
          this.setstars = 2
        } else if (this.noOfEnemiesDestroyed == 5) {
          globalvariables.lvlcomplete.play()
          this.setstars = 3
        }
      }
      
      this.star.setTexture('star' + (this.setstars + 1))

      let tween = this.tweens.add({
        targets: this.char2,
        x: this._canvaswidth * 0.2,
        ease: 'Power1',
        duration: 2000,
        yoyo: false,
        repeat: 0,
        delay: 1000,
        onComplete: function () {
          tween.stop()
          this.enemyDied = false
          globalvariables.rakshasentry.play()
          this.char2.stop('walkRakshas' + this.currentrakshas)
          this.char2.setFrame('Rakshas_' + this.currentrakshas + '_Idle.png')
          this.canPick = true
        }.bind(this),
      })
    } else {
      this.showBanner()
    }
  }

  playplayeranimation() {
    globalvariables.lvlfail.play()
    let that = this
    let tween = this.tweens.add({
      targets: this.char1,
      angle: 90,
      alpha: 0,
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      onComplete: function () {
        tween.stop()
        that.showBanner()
      },
    })
  }

  showBanner() {
    globalvariables.lvlbgtrack.stop()
    this.levelOver = false

    if (globalvariables.totalEnemy == 3) {
      if (this.noOfEnemiesDestroyed == 1) {
        globalvariables.lvlfail.play()
        this.checklevelval = 1
      } else if (this.noOfEnemiesDestroyed == 2) {
        globalvariables.lvlfail.play()
        this.checklevelval = 2
      } else if (this.noOfEnemiesDestroyed == 3) {
        globalvariables.lvlcomplete.play()
        this.checklevelval = 3
      }
    }

    if (globalvariables.totalEnemy == 4) {
      if (this.noOfEnemiesDestroyed == 1) {
        globalvariables.lvlfail.play()
        this.checklevelval = 0
      } else if (this.noOfEnemiesDestroyed == 2) {
        globalvariables.lvlfail.play()
        this.checklevelval = 1
      } else if (this.noOfEnemiesDestroyed == 3) {
        globalvariables.lvlfail.play()
        this.checklevelval = 2
      } else if (this.noOfEnemiesDestroyed == 4) {
        globalvariables.lvlcomplete.play()
        this.checklevelval = 3
      }
    }

    if (globalvariables.totalEnemy == 5) {
      if (this.noOfEnemiesDestroyed == 1) {
        globalvariables.lvlfail.play()
        this.checklevelval = 0
      } else if (this.noOfEnemiesDestroyed == 2) {
        globalvariables.lvlfail.play()
        this.checklevelval = 1
      } else if (this.noOfEnemiesDestroyed == 3) {
        globalvariables.lvlfail.play()
        this.checklevelval = 1
      } else if (this.noOfEnemiesDestroyed == 4) {
        globalvariables.lvlfail.play()
        this.checklevelval = 2
      } else if (this.noOfEnemiesDestroyed == 5) {
        globalvariables.lvlcomplete.play()
        this.checklevelval = 3
      }
    }

    if (
      this.checklevelval >
        globalvariables.starsArray[globalvariables.level - 1] &&
      this.checklevelval != 4
    ) {
      globalvariables.starsArray[globalvariables.level - 1] = this.checklevelval
    }

    if (
      globalvariables.starsArray[globalvariables.level - 1] == 3 ||
      (globalvariables.starsArray[globalvariables.level - 1] == 2 &&
        globalvariables.starsArray[globalvariables.level] == 4)
    ) {
      globalvariables.starsArray[globalvariables.level] = 0
    }

    if (typeof Storage !== 'undefined') {
      window.localStorage.setItem('level', globalvariables.level)
      window.localStorage.setItem('array', globalvariables.starsArray)
      window.localStorage.setItem(
        'levelarrayscore',
        globalvariables.levelarrayscore
      )
    }

    this.star.setTexture(
      'star' + (globalvariables.starsArray[globalvariables.level - 1] + 1)
    )

    if (
      globalvariables.levelarrayscore[globalvariables.level - 1] <
      this.currentlevelscore
    ) {
      globalvariables.levelarrayscore[globalvariables.level - 1] =
        this.currentlevelscore
    }
    this.currentlevelscore = 0

    /* console.log(this.currentlevelscore, '   ...this.currentlevelscore') */
    /* 

    if (
      globalvariables.starsArray[globalvariables.level] == 4 &&
      globalvariables.starsArray[globalvariables.level - 1] == 3 &&
      globalvariables.level < globalvariables.starsArray.length
    ) {
      globalvariables.starsArray[globalvariables.level] = 0
    } */
    clearTimeout(this.checktmr)
    if (
      globalvariables.level == 15 &&
      globalvariables.starsArray[globalvariables.level - 1] == 3
    ) {
      this.showfinalvictory()
    } else {
      this.loadscorecard()
    }
    this.char1.alpha = 1
    this.char1.angle = 0
  }
  inRange(x, min, max) {
    return (x - min) * (x - max) <= 0
  }

  update() {
    if (this.levelOver == true) {
      if (this.checkforUpdateBool && this.canPick) {
        this.checkforUpdateBool = false
        this.nextenemy()
      }

      if (this.backblack2 && this.char2health && this.red) {
        this.backblack2.x =
          this.char2health.x - this.backblack2.displayWidth / 2
        this.red.x = this.backblack2.x
      }

      if (this.backblack2 && this.char2health && this.char2 && this.red) {
        this.char2health.x = this.char2.x

        /* this.bar2.x = this.char2.x - this.char2.displayWidth * 1.2 */
      }

      if (this.destroyvalEnemy && this.char2) {
        this.destroyvalEnemy.x = this.char2.x - this.char2.displayWidth
      }

      if (this.char1score <= 0) {
        this.playerDied = true
      }

      /* if (this.playerDied) {
        this.playerDied = false
        this.canPick = false
        this.playplayeranimation()
      } */
      /* if (this.canPick && this.enemyDied) {
        this.canPick = false
        let u = setTimeout(() => {
          clearTimeout(u)
          this.killenemy()
        }, 0)
      } */
      /* if (this.canPick && !this.enemyDied) {
        this.canPick = false
        this.moveenemy()
      } else {
        this.canPick = false
        this.killenemy()
      } */
      /*  if (this.checkAttackBool) {
        this.checkAttackBool = false
        
      } */
    }
  }

  killenemy() {
    /* this.char2.angle = Phaser */
    /* console.log('killenemy') */
    this.backblack2.setVisible(false)
    this.red.setVisible(false)
    this.char2health.setVisible(false)
    var that = this
    let tween = this.tweens.add({
      targets: this.char2,
      angle: -90,
      alpha: 0,
      /* x: this._canvaswidth * 0.2, */
      ease: 'Linear',
      duration: 500,
      yoyo: false,
      repeat: 0,
      onComplete: function () {
        tween.stop()
        that.char2.x = that._canvaswidth * -0.2
        that.char2.alpha = 1
        that.char2.angle = 0

        that.currentrakshas = that.getRakshasAccordingtoLevel()
        if (that.currentrakshas == 6) {
          that.currentrakshas = 5
        } /* this.char2.setTexture(''+) */

        that.anims.create({
          key: 'attackRakshas' + that.currentrakshas,
          frames: that.anims.generateFrameNames('rakshas', {
            prefix: 'Rakshas_' + that.currentrakshas + '_Attack_',
            start: 1,
            end: that.endframeattack,
            zeroPad: 1,
            suffix: '.png',
          }),
          frameRate: 10,
          repeat: 0,
        })

        that.anims.create({
          key: 'walkRakshas' + that.currentrakshas,
          frames: that.anims.generateFrameNames('rakshas', {
            prefix: 'Rakshas_' + that.currentrakshas + '_Walk_',
            start: 1,
            end: that.endframewalk,
            zeroPad: 1,
            suffix: '.png',
          }),
          frameRate: 5,
          repeat: -1,
        })

        that.char2.setFrame('Rakshas_' + that.currentrakshas + '_Idle.png')

        that.backblack2.setVisible(true)
        that.red.setVisible(true)
        that.char2health.setVisible(true)

        /* console.log('canPickVal ::::: ', that.canPick, that.checkforUpdateBool) */

        /* if (this.canPick == true) {
          this.canPick = false
          if (this.newEnemy == false) this.nextenemy()
        } else { */

        /*  if (that.checkforUpdateBool == false) */
        that.checkforUpdateBool = true
        /* this.checkinterval = setInterval(
            function () {
              if (this.canPick == true) {
                clearInterval(this.checkinterval)
                this.canPick = false
                this.nextenemy()
              }
            }.bind(this),
            1000
          ) */
        /* this.timedEvent = this.time.addEvent({
            delay: 0,
            callback: this.onEvent.bind(this),
            callbackScope: this,
            loop: true,
          }) */
        //this.timedEvent = this.time.addEvent({ delay: 0, callback: this.onEvent, callbackScope: this, loop: true });
      },

      /* this.checkAttackBool = true */
      /* this.nextenemy() */
      /*  let u = setTimeout(() => {
          this.char2
        }, 500); */
      /* this.char2.stop('walkRakshas1')
        this.char2.setFrame('Rakshas_1_Idle.png')
        this.canPick = true */
      /* }.bind(this), */
    })
  }

  onEvent() {
    if (this.canPick == true) {
      if (this.timedEvent) {
        this.timedEvent.destroy()
        this.timedEvent = null
      }
      this.canPick = false
      this.nextenemy()
    }
  }

  showfinalvictory() {
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

    this.victorydialog = this.add
      .sprite(
        this._canvaswidth * 0.5,
        this._canvasheight * 0.5,
        'victorydialog'
      )
      .setDepth(20)
      .setScale(this.scaling * 0.8)

    this.leader = this.add
      .sprite(
        this._canvaswidth * 0.5,
        this.victorydialog.y + this.victorydialog.displayHeight * 0.29,
        'leader'
      )
      .setScale(1.2)
      .setDepth(20)
      .setInteractive()
      .on('pointerdown', this.gotoleader.bind(this))
  }

  loadscorecard() {
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
        this.star.y - this.star.displayHeight,
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
    this.sharebtnLabel.style.zIndex = 100
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

    this.play2btn = this.add
      .sprite(
        this._canvaswidth * 0.5,
        this.fbshare.y + this.scoreboard.displayHeight * 0.9,
        'playbtn2'
      )
      .setScale(1)
      .setDepth(20)
      .setInteractive()
      .on('pointerdown', this.gotoplay2.bind(this))

    this.leader = this.add
      .sprite(
        this._canvaswidth * 0.28,
        this.fbshare.y + this.scoreboard.displayHeight * 0.9,
        'leader'
      )
      .setScale(1.2)
      .setDepth(20)
      /* .setAlpha(0.5) */
      .setInteractive()
      .on('pointerdown', this.gotoleader.bind(this))

    this.replay = this.add
      .sprite(
        this._canvaswidth * 0.72,
        this.fbshare.y + this.scoreboard.displayHeight * 0.9,
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
          fontSize: 60,
          color: '#F8D28C',
        }
      )
      .setOrigin(0.5)
      .setDepth(20)

    /* document.getElementById('setcheckfont').innerHTML = sum */

    this.highScore = this.add
      .text(
        this.scoreboard.x + this.scoreboard.displayWidth * 0.2,
        this.scoreboard.y + this.scoreboard.displayHeight * 0.17,
        '0',
        {
          fontFamily: 'Arial',
          fontSize: 60,
          color: '#F8D28C',
        }
      )
      .setOrigin(0.5)
      .setDepth(20)

    this.highScore.text = globalvariables.highscore
  }
  gotoplay2() {
    this.sharebtnLabel.style.zIndex = -1
    mixpanel.track('CTAs', {
      Element: 'Play Next',
    })
    globalvariables.buttonpress.play()
    this.scene.start('Level')
  }

  gotoleader() {
    this.sharebtnLabel.style.zIndex = -1
    mixpanel.track('CTAs', {
      Element: 'Leaderboard',
    })
    globalvariables.buttonpress.play()
    this.scene.start('Complete')
  }

  playagain() {
    this.sharebtnLabel.style.zIndex = -1
    mixpanel.track('CTAs', {
      Element: 'Play Again',
    })
    globalvariables.buttonpress.play()
    this.scene.start('Game')
  }
}
