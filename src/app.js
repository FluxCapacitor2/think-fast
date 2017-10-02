import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import Bounce from 'bounce.js';

import App from 'components/app.vue';
import Leaderboard from 'components/leaderboard.vue';
import GameOver from 'components/game-over.vue';

Vue.use(Vuetify);
Vue.use(VueRouter);

require('./style.sass');

const routes = [
  {path: '/', component: App},
  {path: '/leaderboard', component: Leaderboard},
  {path: '*', component: App}
]

const router = new VueRouter({
  mode: 'hash',
  routes: routes
});

const v = new Vue({
  router: router,
  el: '#app',
  data: {
    window: window,
    //Audio Player
    MUSIC_PLAYING: false,
    AUDIO_SOURCES: [/*See tracks.json*/],
    AUDIO_TITLES: [/*Also loaded from tracks.json*/],
    TRACK_RIGHTS: [/*Also loaded from tracks.json*/],
    CURRENT_SONG: 0,
    AUDIO_EL: undefined,
    MUSIC_VOLUME: 100,

    app: {
      name: '<span class="think-fast">ThinkFast!</span>'
    }, loading: {
      reload : false
    }
  }, methods: {
    reload() {
      this.loading.reload = true;
      window.location.reload(true);
    }, prevSong() {
      //console.log('Prev song');
      this.CURRENT_SONG--;
      if(this.AUDIO_SOURCES[this.CURRENT_SONG]) {
        //CURRENT_SONG--; ^^
      } else {
        this.CURRENT_SONG = this.AUDIO_SOURCES.length - 1;
      }
      this.MUSIC_PLAYING = false;
    }, nextSong() {
      //console.log('Next song');
      this.CURRENT_SONG++;
      console.log(this.AUDIO_SOURCES[this.CURRENT_SONG]);
      if(this.AUDIO_SOURCES[this.CURRENT_SONG]) {
        //CURRENT_SONG++; ^^
      } else {
        this.CURRENT_SONG = 0;
      }
      this.MUSIC_PLAYING = false;
    }, updatePlayStatus() {
      this.MUSIC_PLAYING = isPlaying(this.audio);
    }
  }, created() {
    //Load tracks.json for track info
    var that = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var tracks = JSON.parse(this.responseText).tracks,
              authors = JSON.parse(this.responseText).authors;
          for(var i in tracks) {
            //console.log(tracks[i]);
            that.AUDIO_SOURCES.push(tracks[i].file);
            that.AUDIO_TITLES.push(tracks[i].author + ' - ' + tracks[i].track);
            that.TRACK_RIGHTS.push(tracks[i].rights);
          }
        }
    };
    xhttp.open("GET", "music/tracks.json", true);
    xhttp.send();
  }, mounted() {
    this.audio = this.$el.querySelectorAll('audio')[0];
    this.$watch('MUSIC_PLAYING', function(e) {
      if(e == true) {
        //Play audio
        this.audio.play();
      } else if(e == false) {
        this.audio.pause();
      }
    });
    /*
    this.$watch('MUSIC_VOLUME', function(e) {
      //Update volume
      this.audio.volume = e / 100;
    });
    */
    this.$watch('CURRENT_SONG', function(e) {
      this.audio.src = this.AUDIO_SOURCES[this.CURRENT_SONG];
    });
    /*
    var that = this;
    addListenerMulti(this.audio, 'play pause', function(event) {
      that.updatePlayStatus();
    });
    */
  }
});

function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}
function isPlaying(a) {
  var b = a.playing && !a.paused && a.currentTime >= 0 && a.readyState >= 2;
  b = a !== undefined;
  console.log(a, b);
  return b;
}

var b = new Bounce()
.scale({
  from: {x:1.2, y:1.5},
  to: {x:3,y:3}
})
.translate({
  from: {x:0,y:0},
  to: {x:0,y:25}
})
.define('bounce-pulse');
