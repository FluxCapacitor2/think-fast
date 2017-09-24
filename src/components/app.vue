<template>
  <div id="math-container">
    <div id="math-problem" v-for="p in math" class="bounce-pulse" v-bind:class="{active: p.current}" v-html="p.problem"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        /*Component Data*/
        math: [
          {problem: '\\frac{72}{9}', js: 72/9, current: true},
          {problem: '\\frac{9}{3}', js: 9/3}
        ]
      }
    }, mounted() {
      //Loop through all math problems and render them with KaTeX
      for(var i = 0; i < this.math.length; i++) {
        this.math[i].problem = katex.renderToString(this.math[i].problem);
      }
    }
  }
</script>
