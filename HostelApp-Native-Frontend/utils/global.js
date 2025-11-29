import { Dimensions as deviceDimension, Platform } from 'react-native';

const Wwidth = deviceDimension.get('window').width;
const Wheight = deviceDimension.get('window').height;
const Activity_Opacity = 0.9;
const Activity_Opacity2 = 0.4;
const rippleColor = 'rgba(0 0 0 / 0.323)';

const isPlatformIOS = Platform.OS == 'ios';
const defaultRotation = isPlatformIOS ? '0deg' : '90deg';
const hexToRgba = (hex, alpha = 1) => {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export {
  Wwidth,
  Wheight,
  Activity_Opacity,
  Activity_Opacity2,
  rippleColor,
  hexToRgba,
  isPlatformIOS,
  defaultRotation,
};
