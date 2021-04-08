const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: "./public/assets/js/index.js",
  output: {
    path: __dirname + "/public/dist",
    filename: "bundle.js"
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [new WebpackPwaManifest({
    filename: "manifest.json",
    name: "Budget Tracker",
    short_name: "Budget Tracker",
    inject: false,
    fingerprints: false,
    theme_color: "#ffffff",
    background_color: "#ffffff",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: path.resolve("public/icons/icon-192x192.png"),
        sizes: [96, 128, 192],
      },
      {
        src: path.resolve("public/icons/icon-512x512.png"),
        sizes: [256, 384, 512],
      }
    ],
  })]
};

module.exports = config;
