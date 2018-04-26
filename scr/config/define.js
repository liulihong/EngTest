import {Dimensions,Platform} from 'react-native'

//平台名
const instructions = Platform.select({
    ios: 'IOS',
    android: 'Android',
  });

//屏幕宽高
const deviceH = Dimensions.get('window').height
const deviceW = Dimensions.get('window').width
//屏幕宽度与iPhone6比例
const screenRate = deviceW/375;

RNFS = require('react-native-fs');
const downloadDest=(instructions==="IOS"?RNFS.DocumentDirectoryPath:RNFS.ExternalDirectoryPath);

const version_android = 6;
const version_ios = 6;
const currVersion = instructions==="IOS"?version_ios:version_android;

//颜色
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
    CurrVersion : currVersion,
    downloadDest,
    screenRate,
}
