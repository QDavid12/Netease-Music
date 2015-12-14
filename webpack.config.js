var webpack = require('webpack');
module.exports = {
    entry: [
      "./js/app.js"
    ],
    output: {
        path: './build',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            { test: /\.css$/, loader: "style!css" },
            { test: /\.less/,loader: 'style-loader!css-loader!less-loader'}
        ],
        noParse: [/Action/]
    },
    resolve:{
        extensions:['','.js','.json']
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ],
    watch: true
};
/*'webpack/hot/only-dev-server',*/
