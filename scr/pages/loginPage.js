import React,{ Compnents, Component } from 'react';
import { View ,Text, StyleSheet,Platform,BackHandler } from 'react-native';
import Login from '../components/login';
import NavBar from '../components/navBar';
import utils from "../utils";

export default class LoginScreen extends Component{

    constructor(props){
        super(props);
        // this.onBackAndroid=this.onBackAndroid.bind(this);
    }
    // componentWillMount() {
    //     if (Platform.OS === 'android') {
    //         BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    // }
    // onBackAndroid = () => {
    //     if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
    //         BackHandler.exitApp()
    //         return false;
    //       }
    //       this.setState({
    //         lastBackPressed:Date.now(),
    //       });
    //       this.lastBackPressed = Date.now();
    //       return true;
    // };
    // //组件卸载 播放停止
    // componentWillUnmount() {
    //     this.onBackAndroid();
    //     if (Platform.OS === 'android') {
    //         BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    // }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.contain}>
                <NavBar navtitle="英语听说考" />
                <Login navigation={this.props.navigation} />
            </View>
        );
    }

    // // 控制跳转
    // endClick() {
    //     const { navigate } = this.props.navigation;
    //     navigate('HomePage')
    // }
}

const styles=StyleSheet.create({
    contain: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor:"#ffffff"
    },
});