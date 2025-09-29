const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const dist = path.resolve(__dirname, "dist");

module.exports = {
  mode: "production",
  entry: {
    index: "./js/index.js",
  },
  output: {
    path: dist,
    filename: "[name].js",
  },
  devServer: {
    static: dist, // new in webpack-dev-server v4
  },
  experiments: {
    asyncWebAssembly: true, // enable native WASM support
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: "webassembly/async",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, "static"), to: dist }],
    }),

    new WasmPackPlugin({
      crateDirectory: __dirname,
    }),
  ],
};
