<template>
  <div id="leaderboard">
    <!-- Leaderboard goes here -->
      <table>
        <thead>
          <tr>
            <td>Rank</td>
            <td>Name</td>
            <td>Score</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in leaderboard" v-bind:style="player.style">
            <td>{{player.rank}}</td>
            <td>{{player.name}}</td>
            <td>{{player.score}}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="LB_ERROR">
        <v-alert error style="display: flex;">Something went wrong!</v-alert>
      </div>
      </div>
  </div>
</template>

<script>
  function map(value, low1, high1, low2, high2) {
    return low2 + (value - low1) * (high2 - low2) / (high1 - low1)
  }
  export default {
    data() {
      return {
        /*Component Data*/
        color: '255, 255, 255', //   54, 106, 188
        leaderboard: [
          /*Loaded on `mounted()`*/
        ],
        LB_ERROR: null
      }
    }, mounted() {
      var xhttp = new XMLHttpRequest();
      var that = this;
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
             // Typical action to be performed when the document is ready:
             that.leaderboard = JSON.parse(this.responseText);
             //console.log(that.leaderboard);
             that.sortLB();
          } else {
            that.LB_ERROR = true;
          }
      };
      xhttp.open("GET", "./src/components/lb.php", true);
      xhttp.send();
    }, methods: {
      sortLB() {
        //Rank players based on score, in order
        this.leaderboard.sort(function(a, b) {
            return b.score - a.score;
        });
        var players = this.leaderboard.length;
        var op;
        var i = 0;

        for(i = 0; i < players; i++) {
          op = 0-i + players;
          this.leaderboard[i].rank = i+1;
          this.leaderboard[i].opacity = map(op, 0, players, 0, 1);
          this.leaderboard[i].style = {backgroundColor:'rgba(' + this.color + ', ' + this.leaderboard[i].opacity + ')'};
          if(this.leaderboard[i].name == '') {
            this.leaderboard[i].name = '(Unnamed)';
          }
        }
      }
    }
  }
</script>

<style>
  table {
    width: 100%;
  }
  table tr td {
    padding: 5px;
    margin: 0;
  }

</style>
