import React,{ Compnents, Component } from 'react';
import { View ,Text, StyleSheet } from 'react-native';
import Regist from '../components/regist';
import NavBar from '../components/navBar';
import utils from "../utils";

export default class RegistScreen extends Component{

    constructor(props){
        super(props);
        // this.endClick=this.endClick.bind(this);
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.contain}>
                <NavBar navtitle="注册" isBack={true} navgation={this.props.navigation}/>
                <Regist navigation={this.props.navigation} />
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
