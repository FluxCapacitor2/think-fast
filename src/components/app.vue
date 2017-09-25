<template>
  <div id="math-container">

    <v-btn icon v-on:click="PAUSED = !PAUSED">
      <v-icon v-if="!PAUSED">pause</v-icon>
      <v-icon v-else>play_arrow</v-icon>
    </v-btn>

    <v-btn v-if="!this.started" v-on:click="startGame()" id="game-start-btn" block>START</v-btn>
    <div id="math-game" v-else>
      <div id="math-problem" v-for="p in math" class="bounce-pulse" v-bind:class="{active: p.current}" v-html="p.problem"></div>
    <div id="points-answer-container">
      <div id="total-points">
        <span v-if="pointsTotal > 0">Earn up to {{pointsTotal}} points!</span>
        <span v-else>No points this time! :(</span>
      </div>
      <v-progress-linear
        style="margin: 0;"
        v-model="this.LOST_PERCENT"
        height="5"
        :warning="this.LOST_PERCENT<this.flashThreshold && Math.round(this.LOST_PERCENT % 10) > 5 && this.LOST_PERCENT>0"
        :error="this.LOST_PERCENT<this.flashThreshold && Math.round(this.LOST_PERCENT % 10) <= 5 && this.LOST_PERCENT>0"
        :secondary="this.LOST_PERCENT<=0"
        ></v-progress-linear>
        <div id="math-answer" v-bind:style="answerStyles">
          <div id="answer-text-field" ref="answerTextField">
            <v-text-field
              autofocus
              v-model="CURRENT_ANSWER"
              placeholder="Your answer..."
              :error="this.answerValidate"
              v-focus="focus"
              v-on:focus="focus = true;"
              v-on:blue="focus = false;"
              >
              </v-text-field>
          </div>
          <v-btn id="check-btn" icon v-on:click="checkAnswer()" ref="checkBtn"><v-icon>check</v-icon></v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import focus from 'vue-focus';

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  var start_points_total = 10000;
  var BG_OPACITY = 0.3

  export default {
    directives: {
      focus: focus
    },
    data() {
      return {
        /*Component Data*/
        TOTAL_POINTS: start_points_total,
        LOSE_POINTS_MS: 100,
        LOSE_POINTS: 1,
        LOST_PERCENT: 0,
        FINAL_SCORE: 0,

        PAUSED: false,
        focus: false,

        answerValidate: false, //For text field
        answerStyles: {
          backgroundColor: 'rgba(0, 0, 0, ' + BG_OPACITY + ')'
        },

        CORRECT_ANSWER: null,
        CURRENT_ANSWER: '',
        PROB_INDEX: -1,

        flashThreshold: 33,
        interval: undefined,

        pointsTotal: start_points_total,
        started: false,

        DOM_EL: document.querySelector('#math-problem.active'), //Current math problem DOM Element

        math: [
          {problem: '\\frac{72}{9}', js: 72/9},
          {problem: '\\frac{9}{3}', js: 9/3},
          {problem: '15\\times(-9)', js:15*(-9)},
          {problem: '-23+78', js:-23+78},
          {problem: '-93\\times12', js: -93*12}
        ]
      }
    }, created() {
      //Shuffle the math problems
      this.math = shuffle(this.math);

      //Loop through all math problems and render them with KaTeX
      for(var i = 0; i < this.math.length; i++) {
        this.math[i].problem = katex.renderToString(this.math[i].problem);
      }
    }, mounted() {
      //When key is pressed, assume it is for the answer text field.
      var that = this;
      window.addEventListener('keypress', function(e) {
        that.focus = true;
        if(e.keyCode === 13) {
          that.checkAnswer();
        }
        that.$refs.answerTextField.focus();
      });
    }, methods: {
      startGame() {
        this.started = true;
        this.reset();
      },
      checkAnswer() {
        if(this.CURRENT_ANSWER == this.CORRECT_ANSWER) {
          this.FINAL_SCORE += this.pointsTotal;
          this.reset(); //New problem
        } else {
          this.answerValidate = true; //Show error
          this.CURRENT_ANSWER = '';
        }
      }, reset() {
        this.PROB_INDEX++;
        if(this.math[this.PROB_INDEX]) {
          this.LOST_PERCENT = 100;
          this.LOSE_POINTS = 1;
          this.pointsTotal = start_points_total;
          this.math[this.PROB_INDEX].current = true;
          this.answerValidate = false;
          if(this.math[this.PROB_INDEX - 1]) {
            this.math[this.PROB_INDEX - 1].current = false;
          }
          this.CORRECT_ANSWER = this.math[this.PROB_INDEX].js;
          this.CURRENT_ANSWER = ''; //Text field
          clearInterval(this.interval);
          this.init();
        } else {
          window.location.href = '#/game-over?score=' + this.FINAL_SCORE;
        }
      }, init() {
        var that = this;
        this.interval = setInterval(function() {
          if(!that.PAUSED) { //Allow pausing functionality
            if((that.pointsTotal % 20) == 0) { //Every 20 points lost, it gets faster.
              that.LOSE_POINTS++;
            }
            that.LOST_PERCENT = (that.pointsTotal / that.TOTAL_POINTS) * 100; //Percent of points that you can get (updates constantly) (goes DOWN)
            that.pointsTotal -= that.LOSE_POINTS;

            if(that.pointsTotal <= 0) {
              that.pointsTotal = 0;
              clearInterval(that.interval);

              console.log(that);
              that.reset();
            }
          }
        }, this.LOSE_POINTS_MS);
      }
    }
  }
</script>
