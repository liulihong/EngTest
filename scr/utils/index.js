import {Dimensions} from 'react-native'
import { Platform } from 'react-native'


//屏幕宽高
const deviceH = Dimensions.get('window').height
const deviceW = Dimensions.get('window').width

//平台名
const instructions = Platform.select({
  ios: 'IOS',
  android: 'Android',
});

module.exports = {
    SCREENWIDTH: deviceW,
    SCREENHEIGHT: deviceH,
    PLATNAME:instructions,
}