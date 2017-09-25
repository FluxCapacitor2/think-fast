<template>
  <div id="game-over">
    <h1>Game over!</h1>
    <h4>{{msg}}</h4>
    <p></p>
  </div>
</template>


<script>

  var msgs = ['Nice job!', 'Well done!', 'Great work!', 'You made it!'];

  export default {
    props: ['points'],
    data() {
      return {
        /*Component Data*/
        //points: this.props.points,
        msg: msgs[Math.floor(Math.random()*msgs.length)]
      }
    }
  }
</script>
