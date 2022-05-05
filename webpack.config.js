// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/, 
        exclude: '/node_modules/',
        loader: "ts-loader" }
    ]
  }
};


// const config = {
//     entry: './src/index.ts',
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: 'bundle.js'
//     },
//     devServer: {
//         open: true,
//         host: 'localhost',
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: 'index.html',
//         }),

//         // Add your plugins here
//         // Learn more about plugins from https://webpack.js.org/configuration/plugins/
//     ],
//     module: {
//         rules: [
//             {
//                 test: /\.(ts|tsx)$/i,
//                 loader: 'ts-loader',
//                 exclude: ['/node_modules/'],
//                 include: [path.resolve(__dirname, 'src')]
//             },
//             {
//                 test: /\.css$/i,
//                 exclude: ['/node_modules/'],
//                 use: [stylesHandler,'css-loader'],
//             },
//             {
//                 test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
//                 exclude: ['/node_modules/'],
//                 type: 'asset',
//             },

//             // Add your rules for custom modules here
//             // Learn more about loaders from https://webpack.js.org/loaders/
//         ],
//     },
//     resolve: {
//         extensions: [ '.ts', '.tsx', ".js", ".json"],
//     },
// };

// module.exports = () => {
//     if (isProduction) {
//         config.mode = 'production';
        
        
//     } else {
//         config.mode = 'development';
//     }
//     return config;
// };
