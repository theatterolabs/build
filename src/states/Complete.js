import { globalvariables } from '../util/globalvariables'
import { scalecanvas } from '../util/scalecanvas'

export default class Complete extends Phaser.Scene {
  constructor() {
    super({ key: 'Complete' })
  }

  init() {}
  onProgress(v) {}
  preload() {}
  create() {
    scalecanvas.call(this, true)

    mixpanel.track('Screen View', {
      'Page Name': 'Leaderboard Screen',
    })
    /* document.getElementById('gameDiv').style.display = 'none'
    if (globalvariables.isMobile) {
      document.getElementById('flexing').style.width =
        document.querySelector('canvas').style.width
    }else{
      document.getElementById('flexing').style.width = '400px'
    }
    document.getElementById('flexing').style.height = window.innerHeight + 'px'
    document.getElementById('flexing').style.opacity = 1 */

    document.getElementById('leaderboard').style.opacity = 1
    document.getElementById('leaderboard').style.zIndex = 100

    $('#addPlayers').html('')

    var scoreAPI =
      'https://8btazx6thc.execute-api.ap-south-1.amazonaws.com/getscores?skip=0&limit=50'
    fetch(scoreAPI)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        /* console.log(data.length) */
        var topScore = data[0].score
        /* console.log(topScore) */
        for (var i = 0; i < data.length; i++) {
          /* console.log(data[i].firstname, data[i].score, data[i].id) */

          $('#addPlayers').append(
            /* '<div id="photoData"><div id="numberimage"><p>' +
              (i + 1) +
              '</p></div><div><img src="http://graph.facebook.com/' +
              data[i].id +
              '/picture" id="imageval" alt=""/></div><div><p>' +
              data[i].firstname +
              '</p></div><div><p>' +
              data[i].score +
              '</p></div></div>' */

            '<div id="photoData">            <div id="numberimage">              <img src="./assets/form/Rank_Number_BG.png" alt="" style="width: 60%;                  margin-top: 16%;">              <div class="centered">' +
              (i + 1) +
              '</div>            </div>            <div id="numberimage">              <img src="http://graph.facebook.com/' +
              data[i].id +
              '/picture" alt="" style="width: 60%;              margin-top: 12%;">            </div>            <div>              <p>' +
              data[i].firstname +
              '</p>            </div>            <div>              <p>' +
              data[i].score +
              '</p>            </div>          </div>'
          )
          /* $('#addPlayers').append(
            '<div id="photoData"><div><p>' +
              (i + 1) +
              '</p></div><div><img src="' +
              'http://graph.facebook.com/' +
              data[i].id +
              '/picture' +
              '"id="imageval" alt="" /></div><div><p>' +
              data[i].firstname +
              '</p></div><div><p>' +
              data[i].score +
              '</p></div></div>'
          ) */

          /* $('#addPlayers').append(
            '<div id="photoData"><p>' +
              data[i].firstname +
              '</p><p>' +
              data[i].score +
              '</p></div>'
          )
          $('#addPlayers').append(
            '<img src="' +
              'http://graph.facebook.com/' +
              data[i].id +
              '/picture' +
              '" id="imageval" alt="" />'
          ) */
        }

        /* document.getElementById('HighScore').innerHTML = topScore; */
      })
      .catch((error) => {
        /* console.log('Error:', error) */
      })

    let sum = 0
    for (let i = 0; i < globalvariables.levelarrayscore.length; i++) {
      /* console.log(parseInt(globalvariables.levelarrayscore[i])) */
      sum += globalvariables.levelarrayscore[i]
    }
    document.getElementById('setcheckfont').innerHTML = sum

    document.getElementById('homebtn').addEventListener(
      'click',
      function (e) {
        document.getElementById('leaderboard').style.opacity = 0
        document.getElementById('leaderboard').style.zIndex = -1
        document.getElementById('setcheckfont').innerHTML = ''
        this.scene.start('Level')
      }.bind(this)
    )
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

  abc() {}

  gotoHome() {
    this.scene.start('Level')
  }
}
