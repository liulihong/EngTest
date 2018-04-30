import React,{Component} from 'react';
import {View, Text, Button, TextInput, Alert, StyleSheet,TouchableOpacity} from 'react-native';
import utils from "../utils";


export default class ProgressButton extends Component {
    render() {
          
        return (
            <View style={[{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor:this.props.isSelect?'white':'#1b77aa',
                width: 590/750*utils.SCREENWIDTH,
                height:46*utils.SCREENRATE,
                borderRadius: 46*utils.SCREENRATE/2,
                marginBottom: 20*utils.SCREENRATE,
            },this.props.backStyle?this.props.backStyle:{}]}>
                <View style={[styles1.signNum,{backgroundColor: this.props.isSelect?utils.COLORS.theme:'white',}]}>
                    <Text style={[styles1.num,{color: this.props.isSelect?'white':utils.COLORS.theme,}]}>{this.props.num}</Text>
                </View>
                <View style={styles1.titleView}><Text style={{
                    fontSize:16*utils.SCREENRATE,
                    color:this.props.isSelect?utils.COLORS.theme:"white",
                    fontWeight:"600",
                }}>{this.props.title}</Text></View>
            </View>
        );
    }
}


const styles1=StyleSheet.create({
    signNum:{
        backgroundColor:utils.COLORS.theme,
        marginLeft:7*utils.SCREENRATE,
        width:32*utils.SCREENRATE,
        height:32*utils.SCREENRATE,
        borderRadius:32*utils.SCREENRATE/2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    num:{
        fontSize:16*utils.SCREENRATE,
        color:"#ffffff",
        fontWeight:"800",
    },
    titleView:{
        width:"74%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // title:{
    //     fontSize:16,
    //     color:this.props.isSelect?utils.COLORS.theme:"white",
    //     fontWeight:"600",
    // }
});