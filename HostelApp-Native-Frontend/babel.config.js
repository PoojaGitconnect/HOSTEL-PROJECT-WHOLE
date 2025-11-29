

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Must be first
    'nativewind/babel',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
