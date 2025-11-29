import {StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../src/Component/CustomText/CustomText';
import {fonts} from '../src/Component/CustomText/fonts';
import {isPlatformIOS, Wwidth} from './global';

const showToast = (message, type = 'success') => {
  const toastParams = {
    type,
    text1: message,
    visibilityTime: 2000,
    autoHide: true,
    topOffset: isPlatformIOS ? 60 : 20,
    bottomOffset: 20,
  };
  Toast.show(toastParams);
};

const toastConfig = {
  success: ({text1}) => (
    <LinearGradient
      colors={['#C49F47', '#ddd']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={[styles.toastContainer]}>
      <View>
        <CustomText
          numberOfLines={1}
          ellipsizeMode="tail"
          className={'text-md '}
          style={{fontFamily: fonts.Medium}}>
          {text1}
        </CustomText>
      </View>
    </LinearGradient>
  ),
  error: ({text1}) => (
    <LinearGradient
      colors={['#e5a2a2', '#ddd']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={[styles.toastContainer]}>
      <View>
        <CustomText
          numberOfLines={1}
          ellipsizeMode="tail"
          className={'text-md'}
          style={{fontFamily: fonts.Medium}}>
          {text1}
        </CustomText>
      </View>
    </LinearGradient>
  ),
};

export {showToast, toastConfig};

// Styles for the toast
const styles = StyleSheet.create({
  toastContainer: {
    padding: isPlatformIOS ? 0 : 12,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: Wwidth - 35,
  },
});
