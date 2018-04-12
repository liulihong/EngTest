import React,{Component} from 'react';
import {View, Text, Button, TextInput, Alert, StyleSheet,TouchableOpacity} from 'react-native';
import utils from "../utils";


export default class ProgressButton extends Component {
    render() {
          
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: this.props.isSelect?'white':'#1b77aa',
                width: 590/750*utils.SCREENWIDTH,
                height:45,
                borderRadius: 45/2,
                marginBottom:20,
            }}>
                <View style={styles1.signNum}><Text style={styles1.num}>{this.props.num}</Text></View>
                <View style={styles1.titleView}><Text style={{
                    fontSize:16,
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
        marginLeft:7,
        width:31,
        height:31,
        borderRadius:31/2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    num:{
        fontSize:16,
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