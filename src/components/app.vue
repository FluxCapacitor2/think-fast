<template>
  <div id="game">
    <div id="math-container">

      <v-btn class="pause-btn" v-bind:class="{paused: PAUSED}" icon v-on:click="PAUSED = !PAUSED" v-if="this.started">
        <v-icon v-if="!PAUSED">pause</v-icon>
        <v-icon v-else>play_arrow</v-icon>
      </v-btn>
      <div v-if="!started && !ended">
        <div id="info">
          <div id="name">
            <v-text-field autofocus placeholder="Enter your name..." v-model="NAME"></v-text-field><br>
          </div>
        </div>
        <div id="cat" v-if="!this.started">
          Select a category:
          <v-btn-toggle mandatory v-model="CATEGORY">
            <v-btn v-for="cat in categories" :key="cat">
              {{cat}}
              <v-chip class="cat-chip white--text" small>{{ catOverview[cat] || 'None'}}</v-chip>
              <v-chip class="multi-chip white--text" small>{{ pointMultis[cat] || 'Error' }}</v-chip>
            </v-btn><br>
          </v-btn-toggle>
        </div>
        <v-chip class="cat-chip white--text" small>Number of problems</v-chip>
        <v-chip class="multi-chip white--text" small>Point Multiplier</v-chip>
      </div>
      <v-btn v-if="!this.started && !this.ended" v-on:click="startGame()" id="game-start-btn">START</v-btn>
      <div id="math-game" v-if="this.started">
        <div id="math-problem" v-for="p in math" class="bounce-pulse" v-bind:class="{active: p.current && !PAUSED}" :key="p.problem" v-html="p.problem"></div>
      <div id="points-answer-container">
        <div id="total-points">
          <span v-if="pointsTotal > 1">Earn up to {{pointsTotal}} points!</span>
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
                >
                </v-text-field>
            </div>
            <v-btn id="check-btn" icon v-on:click="checkAnswer()" ref="checkBtn"><v-icon>check</v-icon></v-btn>
          </div>
        </div>
      </div>
      <div id="game-over" ref="gameover" v-if="this.ended">
        <h1>Game over!</h1>
        <h3>{{msg}}! Your final score was <b>{{FINAL_SCORE}}</b>!</h3>
        <span class="subheading" v-if="LB_MSG">{{LB_MSG}}</span>
      </div>
    </div>
    <div id="paused-container" v-if="this.PAUSED">
      <h1>Paused</h1>
    </div>
  </div>
</template>

<script>
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

  var pointMultis = {
    'Integers': 1,
    'Absolute Value': 0.3,
    'Order of Operations': 2,
    'Word Problems': 1
  }


  var start_points_total = 10000,
    ABS_POINTS_TOTAL = pointMultis['Absolute Value'],
    OOO_POINTS_TOTAL = pointMultis['Order of Operations'],
    BG_OPACITY = 0.3;

  export default {
    data() {
      return {
        /*Component Data*/

        TOTAL_POINTS: start_points_total,
        LOSE_POINTS_MS: 100,
        LOSE_POINTS: 1,
        LOST_PERCENT: 0,
        FINAL_SCORE: 0,

        messages: ["You made it", "Nice job", "Nice work", "Wow", "Amazing"],
        LB_MSG: 'Adding up your points...',

        PAUSED: false,

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
        ended: false,
        START_STAGE: 0,
        CATEGORY: 0,
        NAME: '',
        categories: ["Integers", "Order of Operations", "Absolute Value", "Word Problems"],
        categoriesINT: ['ints', 'ooo', 'abs', 'wp'],
        pointMultis: pointMultis,

        //DOM_EL: document.querySelector('#math-problem.active'), //Current math problem DOM Element

        catOverview: {},

        math: [
          /*
            INTEGERS
          */
          {problem: '\\frac{72}{-9}', js: -8, cat: 'ints'},
          {problem: '\\frac{-9}{3}', js: -3, cat: 'ints'},
          {problem: '-65+76*54-87', js: -65+76*54-87, cat: 'ints'},
          {problem: '-57-49', js: -106, cat: 'ints'},
          {problem: '25*-12^2', js: 25*-12^2, cat: 'ints'},
          {problem: '36/2+36', js: 36/2+36, cat: 'ints'},
          {problem: '54(-6)-41', js: 54*(-6)-41, cat: 'ints'},
          /*
            ABSOLUTE VALUE
          */
          {problem: '|7|', js: 7, cat: 'abs'},
          {problem: '-|-34|+45', js: -Math.abs(-34)+45, cat: 'abs'},
          {problem: '-|-5|+6', js: -5+6, cat: 'abs'},
          /*
            ORDER OF OPERATIONS
          */
          {problem: '95(73+54)-63+9^5', js: 95*(73+54)-63+9^5, cat: 'ooo'},
          {problem: '93(-5+7)-73+34', js: 93*(-5+7)-73+34, cat: 'ooo'},
          {problem: '(57*(32-21)-5)', js: 622, cat: 'ooo'},
          {problem: '-5*56*(-8-9)', js: 4760, cat: 'ooo'},
          {problem: '12+5-(-26)+(-2)', js: 12+5-(-26)+(-2), cat: 'ooo'},
        ]
      }
    }, created() {
      for(var i = 0; i < this.math.length; i++) {
        var cat = this.math[i].cat;
        if(cat) {
          if(this.catOverview[cat]) {
            this.catOverview[cat]++;
            this.catOverview[this.categories[this.categoriesINT.indexOf(cat)]]++;
          } else {
            this.catOverview[cat] = 1;
            this.catOverview[this.categories[this.categoriesINT.indexOf(cat)]] = 1;
          }
        } else {
          console.warn('No category specified for ' + this.math[i].problem);
        }
      }
      console.log(this.catOverview);
      //Shuffle the math problems
      this.math = shuffle(this.math);
      this.msg = shuffle(this.messages)[0];

      for(var i = 0; i < this.math.length; i++) {
        //console.log('Parsing ' + this.math[i].problem);
        this.math[i].problem = katex.renderToString(this.math[i].problem);
      }
    }, mounted() {
      //Save NAME field in localStorage (HTML5 API)
      this.$watch('NAME', function(value) {
        if(localStorage && value) {
          localStorage.setItem('tf_name', value);
        }
      });
      this.NAME = (localStorage) ? localStorage.getItem('tf_name') : '';
    }, methods: {
      startGame() {
        window.onbeforeunload = function(event) {
          return confirm("Confirm refresh");
        };
        this.started = true;
        this.reset();
      },
      checkAnswer() {
        if(this.CURRENT_ANSWER == this.CORRECT_ANSWER) {
          this.FINAL_SCORE += this.pointsTotal;
          this.reset(); //New problem
        } else {
          this.answerValidate = true; //Show error
        }
      }, reset() {
        this.PROB_INDEX++;
        if(this.math[this.PROB_INDEX]) {
          var correctCAT = this.categoriesINT[this.CATEGORY];
          var currCAT = this.math[this.PROB_INDEX].cat;
          if(currCAT == correctCAT) {
              this.LOST_PERCENT = 100;
              this.LOSE_POINTS = 1;
              this.pointsTotal = start_points_total; //Starting points
              //If category is absolute value, it will be 3,000 points
              //If category is order of operations, it will be 20,000 points
              if(currCAT == 'abs') {
                this.pointsTotal = ABS_POINTS_TOTAL;
              } else if (currCAT == 'ooo') {
                this.pointsTotal = OOO_POINTS_TOTAL;
              }
              this.TOTAL_POINTS = this.pointsTotal;
              this.answerValidate = false;
              for(var i = 0; i < this.math.length; i++) {
                this.math[i].current = false;
              }
              this.math[this.PROB_INDEX].current = true;
              this.CORRECT_ANSWER = this.math[this.PROB_INDEX].js;
              this.CURRENT_ANSWER = ''; //Text field
              clearInterval(this.interval);
              this.init();
            } else {
            //Find the next problem of the CORRECT category
            this.reset();
          }
        } else {
          var score = this.FINAL_SCORE;
          var name = this.NAME;
          var that = this;

          if(score > 0) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                  that.LB_MSG = 'Check the leaderboard!';
                }
            };
            xhttp.open("POST", "./src/components/lb.php?ins=" + name + '&add=' + score, true);
            xhttp.send();
          } else {
            this.LB_MSG = 'Your score didn\'t change.';
          }
          that.started = false;
          that.ended = true;
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
              that.reset();
            }
          }
        }, this.LOSE_POINTS_MS);
      }
    }
  }
</script>
