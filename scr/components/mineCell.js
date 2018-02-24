import React, { Component } from 'react';
import utils from '../utils';

import {
    Text,
    Image,
    Button,
    StyleSheet,
    View
} from 'react-native';

export default class mineCell extends Component {

    render () {
        var { style, name, txtHide, ispassword } = this.props
        return(
            <View style={styles.container}>
                <Image style={styles.image} source={require("../imgs/mineIcon/my_icon_bj.png")} />
                <Text style={styles.title}>修改资料</Text>
                <Image style={styles.arrow} source={require("../imgs/cusIcon/icon_enter.png")} />
            </View>
        )
    }
    // getValue () {
    //     return this.state.txtValue
    // }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: "#ffffff",
        width:utils.SCREENWIDTH,
        height:48,
        borderWidth:0.5,
        borderColor:utils.COLORS.background1
    },
    image:{
        marginLeft:20,
        width:18,
        height:18
    },
    title:{
        marginLeft:20,
        color:utils.COLORS.theme1,
        fontSize:16,
        width:"75%",
    },
    arrow:{
        width:18,
        height:18
    }
});

// module.exports = mineCell;