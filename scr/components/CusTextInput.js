import React, { Component } from 'react';
import utils from '../utils'

import {
    Text,
    TextInput,
    View,
    StyleSheet,
    ToastAndroid
} from 'react-native'

class TextInputLogin extends Component {
    // static propTypes = {
    //     name: '',
    //     txtHide: '',
    //     ispassword: false
    // }

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
                    <Text style={styles.txtName}>{name}</Text>
                    <TextInput
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
        alignItems: 'center',
        flexDirection: 'row',
        width:utils.SCREENWIDTH*0.7,
        marginTop: 18,
    },
    txtBorder: {
        height: 50,
        flex: 1,
        borderWidth: 1,
        borderColor: '#51A7F9',
        // marginLeft: 50,
        // marginRight: 50,
        borderRadius: 25,
        flexDirection: 'row'
    },
    txtName: {
        height: 50,
        // width: '30%',
        marginLeft: 20,
        justifyContent: 'center',
        fontSize: 16,
        marginTop: 17,
        color: '#51A7F9',
        // marginRight: 10,
    },
    textInput: {
        height: 50,
        width: '65%'
    }
});

module.exports = TextInputLogin;