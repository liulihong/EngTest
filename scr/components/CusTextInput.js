import React, { Component } from 'react';
import utils from '../utils'

import {
    Text,
    Image,
    TextInput,
    View,
    StyleSheet,
    ToastAndroid,
    DeviceEventEmitter
} from 'react-native'

class TextInputLogin extends Component {

    static defaultProps = {
        name: '用户名：',
        txtHide: '请输入用户名',
        ispassword: false,
    }
    constructor (props) {
        super (props)
        this.state = {
            txtValue: "",
        }
    }

    render () {
        var { style, name, txtHide, ispassword } = this.props
        return(
            <View style={styles.container}>
                <View style={styles.txtBorder}>
                    <Image
                        source={this.props.imgUrl}
                        style={styles.image}
                    />
                    {/*<Text style={styles.txtName}>{name}</Text>*/}
                    <TextInput
                        ref={"textInput"}
                        underlineColorAndroid = {'transparent'}
                        style={styles.textInput}
                        multiline={false}
                        placeholder={txtHide}
                        secureTextEntry={ispassword}
                        onChangeText={(text) => {
                            this.setState({
                                txtValue: text
                            },()=>this.props.getValue(this.state.txtValue))
                        }}
                        value={this.state.txtValue}
                    />
                    <View style={styles.line}/>
                </View>
            </View>
        )
    }
    // getValue () {
    //     return this.state.txtValue
    // }
}

const styles = StyleSheet.create({
    container: {
        width:utils.SCREENWIDTH,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2*utils.SCREENRATE,
    },
    txtBorder: {
        width: "85%",
        height: 51*utils.SCREENRATE,
        flexDirection: 'row',
        alignContent:"center",
        flexWrap: 'wrap',
        alignSelf:"center"
    },
    image: {
        height: 17*utils.SCREENRATE,
        width: 14*utils.SCREENRATE,
        marginLeft: 6*utils.SCREENRATE,
        justifyContent: 'center',
        marginTop: 17*utils.SCREENRATE,
    },
    textInput: {
        marginLeft: 12*utils.SCREENRATE,
        height: 50*utils.SCREENRATE,
        width: '85%',
        fontSize:16*utils.SCREENRATE,
        // backgroundColor:"#ff0000",
    },
    line: {
        height: 1,
        width: '100%',
        backgroundColor:utils.COLORS.border1,

    }
});

module.exports = TextInputLogin;