import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, TouchableOpacity ,ScrollView,DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { Login as logReg, GetCommon } from '../store/actions';
import utils from '../utils'
import CusTextIput from './CusTextInput'
import { NavigationActions } from 'react-navigation'



class LoginView extends Component {
    constructor() {
        super(...arguments);
        this.loginBtn = this.loginBtn.bind(this);
        this.conBtnClick = this.conBtnClick.bind(this);
        this.state = {
            userNameText: '',
            PwdText: ''
        }
    }


    componentWillReceiveProps(nextProps) {

        // if (nextProps.val.ID) {
        //     debugger
        //     //登录成功
        //     this.props.navigation.navigate('HomePage');
        // }
    }


    loginBtn() {

        if (this.state.userNameText === "") {
            Alert.alert("", "请输入用户名或邮箱");
            return;
        }
        if (this.state.PwdText === "") {
            Alert.alert("", "请输入密码");
            return;
        }

        this.props.login({
            LoginName: this.state.userNameText,
            LoginPwd: this.state.PwdText
            //callBack:{this.props.navigation.navigate('HomePage')}
            //传个方法就行了吧   跳转只有一种方法吗。  不知道啊
            // LoginName:"12059999999",//北京测试账户
            // LoginName:"12051111111",//宜昌测试账户
            // LoginPwd:"111111",

            // Tel:this.state.userNameText,
            // Pwd:this.state.PwdText,
            // DeviceID:null,
            // Model:null
        }, () => {
            DeviceEventEmitter.emit('replaceRoute',{isLogin:true});
            // this.props.navigation.navigate('HomePage');
        });
    }

    conBtnClick(type) {
        if (type === 1) {//注册账号
            this.props.navigation.navigate('Regist');
        } else if (type === 2) {//忘记密码
            // Alert.alert("","忘记密码功能暂未开通");
            this.props.navigation.navigate('PwdScreen');
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <CusTextIput
                        txtHide='请输入用户名或邮箱'
                        imgUrl={require("../imgs/logIcon/login_icon_sj.png")}
                        ispassword={false}
                        getValue={(v) => {
                            this.setState({
                                userNameText: v
                            })
                        }}
                    />
                    <CusTextIput
                        txtHide='请输入密码'
                        imgUrl={require("../imgs/logIcon/login_icon_mm.png")}
                        ispassword={true}
                        getValue={(v) => {
                            this.setState({
                                PwdText: v
                            })
                        }}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.loginBtn}
                    >
                        <Text style={styles.buttonText}>登录</Text>
                    </TouchableOpacity>


                    <View style={styles.btnView}>
                        <TouchableOpacity style={styles.button2} onPress={() => this.conBtnClick(1)}>
                            <Text style={styles.btntxt1}>{"注册账号"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button2} onPress={() => this.conBtnClick(2)}>
                            <Text style={styles.btntxt2}>{"忘记密码?"}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    button: {
        height: 45,
        width: utils.SCREENWIDTH * 0.85,
        borderRadius: 6,
        backgroundColor: utils.COLORS.theme,
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },
    btnView: {
        height: 45,
        width: utils.SCREENWIDTH,
        marginTop: 3,
        flexDirection: 'row'
    },
    button2: {
        width: '50%',
        height: '100%',
        justifyContent: 'center'
    },
    btntxt1: {
        marginLeft: utils.SCREENWIDTH * 0.075,
        color: '#666666',
        fontSize: 14,
    },
    btntxt2: {
        marginRight: utils.SCREENWIDTH * 0.075,
        textAlign: 'right',
        color: '#666666',
        fontSize: 14,
    },
});


const mapStateToProps = (state) => {
    const val = state.userInfo.logResult;
    return {
        val,
    };
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        login: (obj, callBack) => {
            dispatch(logReg(obj, callBack))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);