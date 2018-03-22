import React, { Component } from 'react';
import utils from '../utils';

import {
    Text,
    Image,
    Button,
    StyleSheet,
    View,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';
import {LogOut} from "../store/actions";
import {connect} from "react-redux";
import getToken from "../request/getToken";

class mineCell extends Component {
    constructor() {
        super(...arguments)
        this.btnClick=this.btnClick.bind(this);
    }

    btnClick(){
        if(this.props.title==="退出登录"){
            this.props.logOut(()=>{
                // AsyncStorage.setItem('token', '');
                // getToken(store, (obj)=>{
                //     alert(JSON.stringify(obj));
                // });
                this.props.navigation.navigate('Login');
            });
        }
    }

    render () {
        return(
            <TouchableOpacity style={styles.container} onPress={()=>{this.btnClick()}}>
                <Image style={styles.image} source={this.props.imgurl} />
                <Text style={styles.title}>{this.props.title}</Text>
                <Image style={styles.arrow} source={require("../imgs/cusIcon/icon_enter.png")} />
            </TouchableOpacity>
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
        borderWidth:0.7,
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

const mapStateToProps = (state) => {
    let store=state;
    return {
        store
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        logOut: (callBack) => {
            dispatch(LogOut(callBack))
        },
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(mineCell);