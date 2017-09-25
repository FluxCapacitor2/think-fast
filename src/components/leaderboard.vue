<template>
  <div id="leaderboard">
    <!-- Leaderboard goes here -->
    <ul>
      <div v-for="player in leaderboard" v-bind:style="player.style">
        <li class="player-name">
          <span class="left">{{player.rank}}</span>
          <span class="center">{{player.name}}</span>
          <span class="right">{{player.score}}</span>
      </li>
        <hr>
      </div>

    </ul>
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
          {name: "Testing", score: 1200000},
          {name: "Is a nerd",  score: 1190000},
          {name: "Testing", score: 1200000},
          {name: "Is a nerd",  score: 1190000},
          {name: "Testing", score: 1200000},
          {name: "Is a nerd",  score: 1190000},
          {name: "Testing", score: 1200000},
          {name: "Is a nerd",  score: 1190000}
        ]
      }
    }, created() {
      this.leaderboard.sort(function(a, b) {
          return b.score - a.score;
      });
      var players = this.leaderboard.length;
      var op;
      for(var i = 0; i < players; i++) {
        op = 0-i + players;
        this.leaderboard[i].rank = i+1;
        this.leaderboard[i].opacity = map(op, 0, players, 0, 1);
        this.leaderboard[i].style = {backgroundColor:'rgba(' + this.color + ', ' + this.leaderboard[i].opacity + ')'}
      }
    }
  }
</script>

<style>
  hr {
    border: none;
    border-bottom: 1.5px solid black;
    padding: 10px;
  }
  .player-name {
    text-align: center
  }
  div#leaderboard ul {
    list-style-type: none;
    font-size: 24px;
  }
  body {
    overflow: auto !important;
  }
</style>
