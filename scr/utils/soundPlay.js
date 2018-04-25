import React, { Component } from 'react';
import utils from './index';
import Sound from "react-native-sound";
import { Alert } from "react-native";

let sound = null;
let isRealse = false;
let currTime = 0;
// let playNum=0;

module.exports = class MySound {
    constructor() {
        this.soundContinue = this.soundContinue.bind(this);
    }

    // getPlayNum(){
    //     return {playNum,currTime};
    // }

    //初始化
    soundInit(path) {
        // noinspection JSAnnotator
        if (sound !== null) {
            // if(isRealse===false)
                sound.release();
            sound = null;
        }
        isRealse=false;
        sound = new Sound(path, '', (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                // debugger
            }
        });
    }
    //播放
    soundPlay(path) {
        // playNum++;
        
        let loadedTime = 0;//加载次数
        let timeInteval = setInterval(() => {
            if (sound.isLoaded() === true) {
                clearInterval(timeInteval);
                this.soundSetCurrentTime();//设置播放进度
                sound.play((success) => {
                    if (success) {
                        console.log(path);
                        // debugger
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors ');
                        sound.reset();
                    }
                });
            } else {
                loadedTime++;
                if (loadedTime > 200) {
                    clearInterval(timeInteval);
                    Alert.alert("", "加载音频文件失败" + path);
                }
            }
        }, 10);
    }
    //开始播放
    startPlay(path) {
        // debugger
        currTime=0;
        this.soundInit(path);
        this.soundPlay(path);
    }
    soundIsLoaded() {
        return sound.isLoaded();
    }
    //暂停播放
    soundPause() {
        sound.pause();
    }
    //继续播放
    soundContinue(path) {

        if(utils.PLANTNAME === "IOS"){
            this.soundPlay(path);
        }else{
            this.soundInit(path);
            this.soundPlay(path);
        }

    }
    //停止播放
    soundStop() {//这个是播放停止之后 relese
        if (sound !== null) {
            sound.stop();
            // sound.release();
            // sound=null;
            // isRealse=true;
        }
    }
    //释放
    soundRelease() {
        // sound.release();
    }
    //设置播放进度
    soundSetCurrentTime() {
        sound.setCurrentTime(currTime);
    }
    //获取播放时间点 完了
    soundGetCurrentTime(callback) {
        // sound.getCurrentTime(callback);
        sound.getCurrentTime((time, isPlaying)=>{
            currTime=time;
            callback(time,isPlaying);
        });
    }
    //获取音频时长
    soundDuring() {
        if(sound!==null){
            return sound.getDuration();
        }
        return 0;
    }
    //判断是否正在播放
    isPlay() {
        return sound.isPlaying();// 这个方法是判断是否播放吗 恩
    }

    isPaused() {
        return sound.isPaused;
    }
}












// import React, {Component} from 'react';
//keyile en   那你还要改啥
//ni 还需要改啥   我现在没huo    没了昂 挂了啊

// import {
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
//     Platform,
//     AppRegistry
// } from 'react-native';
// const Sound = require('react-native-sound');
// const s=null;
//
// const Button = ({title, onPress}) => (
//     <TouchableOpacity onPress={onPress}>
//         <Text style={styles.button}>{title}</Text>
//     </TouchableOpacity>
// );
//
// const Header = ({children}) => (<Text style={styles.header}>{children}</Text>);
//
// const Feature = ({title, onPress, description, buttonLabel = "PLAY"}) => (
//     <View style={styles.feature}>
//         <Header>{title}123</Header>
//         <Button title={buttonLabel} onPress={onPress}/>
//     </View>);
//
// const requireAudio = require('./advertising.mp3');
//
// export default class App extends Component {
//
//     constructor(props) {
//         super(props);
//
//         Sound.setCategory('Ambient', true); // true = mixWithOthers
//
//         this.playSoundBundle = () => {
//             const s = new Sound('advertising.mp3', Sound.MAIN_BUNDLE, (e) => {
//                 if (e) {
//                     console.log('error', e);
//                 } else {
//                     s.setSpeed(1);
//                     console.log('duration', s.getDuration());
//                     s.play(() => s.release()); // Release when it's done so we're not using up resources
//                 }
//             });
//         };
//
//         this.playSoundLooped = () => {
//             if (this.state.loopingSound) {
//                 return;
//             }
//             const s = new Sound('advertising.mp3', Sound.MAIN_BUNDLE, (e) => {
//                 if (e) {
//                     console.log('error', e);
//                 }
//                 s.setNumberOfLoops(-1);
//                 s.play();
//             });
//             this.setState({loopingSound: s});
//         };
//
//         this.stopSoundLooped = () => {
//             if (!this.state.loopingSound) {
//                 return;
//             }
//
//             this.state.loopingSound
//                 .stop()
//                 .release();
//             this.setState({loopingSound: null});
//         };
//
//         this.playSoundFromRequire = () => {
//             // noinspection JSAnnotator
//             s = new Sound(requireAudio, (e) => {
//                 if (e) {
//                     console.log('error', e);
//                     return;
//                 }
//
//                 s.play(() => s.release());
//             });
//         };
//
//         this.state = {
//             loopingSound: undefined,
//         };
//
//         this.stop=()=>{
//             if(s && s.isPlaying())
//                 s.stop(() => s.release());
//         }
//     }
//
//     renderiOSOnlyFeatures() {
//         return [
//             <Feature key="require" title="Audio via 'require' statement" onPress={this.playSoundFromRequire}/>,
//         ]
//     }
//
//     render() {
//         return <View style={styles.container}>
//             <Feature title="Main bundle audio" onPress={this.playSoundBundle} buttonLabel={'重置'}/>
//             {this.state.loopingSound
//                 ? <Feature title="Main bundle audio (looped)" buttonLabel={'暂停'} onPress={this.stopSoundLooped}/>
//                 : <Feature title="Main bundle audio (looped)" buttonLabel={'播放'} onPress={this.playSoundLooped}/>
//             }
//             { Platform.OS === 'ios' ? this.renderiOSOnlyFeatures() : null }
//
//             <Button title="停止" onPress={this.stop}/>
//         </View>
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     button: {
//         fontSize: 20,
//         backgroundColor: 'silver',
//         padding: 5,
//     },
//     header: {
//         borderBottomWidth: 1,
//         borderBottomColor: 'black',
//     },
//     feature: {
//         padding: 20,
//         alignSelf: 'stretch',
//     }
// });
