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

//
const colors  = {
    theme: '#12b7f5',//主题色
    theme1: '#333333',//主题字体颜色
    border: '#d1d1d1',//导航分割线
    border1: '#e8e8e8',//普通分割线
    background: '#f8f8ff',//tabBar navBar 背景色
    background1: '#f0f5f8',//主题背景色
};

module.exports = {
    SCREENWIDTH: deviceW,
    SCREENHEIGHT: deviceH,
    PLATNAME:instructions,
    COLORS:colors,
}