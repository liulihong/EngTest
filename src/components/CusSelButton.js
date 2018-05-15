import React, { Component } from 'react';
import utils from '../utils'
import {
    Text,
    Image,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export default class CusSelButton extends Component {
    constructor (props) {
        super (props)
    }

    render(){
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.clickEvent}>
                <View style={{width:"68%",alignSelf:"center"}}><Text style={styles.title}>{this.props.title}</Text></View>
                <Image style={styles.img} source={require('../imgs/cusIcon/login_icon_xl.png')} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width:utils.SCREENWIDTH,
        height:50*utils.SCREENRATE,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2*utils.SCREENRATE,
        position:'absolute',
        backgroundColor:"rgba(0,0,0,0.0)",
    },
    title: {
        color:'#666666',
        fontSize:16*utils.SCREENRATE,
        fontWeight:"500",
        // marginLeft:60,
    },
    img: {
        height: 10*utils.SCREENRATE,
        width: 18*utils.SCREENRATE,
        position:'absolute',
        right:30*utils.SCREENRATE,
    },

});