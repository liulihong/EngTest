import React,{ Compnents, Component } from 'react';
import { View ,Text, StyleSheet ,Image ,ImageBackground} from 'react-native';
import Login from '../components/login';
import { StackNavigator } from 'react-navigation';
import Route from  './router'
import utils from "../utils";

export default class HomeScreen extends Component{

    constructor(props){
        super(props);
        // this.endClick=this.endClick.bind(this);
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.contain}>
                <ImageBackground
                    source={require("../imgs/mineIcon/my_bg.png")}
                    style={styles.headerImg}
                >
                    <Text style={styles.navTitle}>英语听说考</Text>
                </ImageBackground>
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
    headerImg: {
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        width:utils.SCREENWIDTH,
        height:utils.SCREENWIDTH/750*128
    },
    navTitle:{
        marginTop:30,
        color:"#fff",
        fontSize:18,
        fontWeight:"900"
    },
});