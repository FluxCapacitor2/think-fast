const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

const extractSass = new ExtractTextPlugin({
  filename: "/dist/[name].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: './src/app.js',

  output: {
    filename: './dist/bundle.js'
  },

  plugins: [
    extractSass
  ],

  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      components: path.resolve('./src/components/')
    }
  },

  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }, {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'vue-loader'
        }
      }, {
        test: /\.css$/,
        use: {
          loader: 'style-loader!css-loader'
        }
      }, {
        test: /\.sass$/,
        use: extractSass.extract({
            use: [
              {loader: "css-loader"},
              {loader: "postcss-loader", options: {config: {path: 'postcss.config.js'}}},
              {loader: "sass-loader"}
            ],
            fallback: "style-loader"
        })
    }
    ]
  }
}
