import React,{Component} from 'react';
import {View, Text, Button, TextInput, Alert, StyleSheet,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {Login as logReg} from '../store/actions';
import utils from  '../utils'
import CusTextIput from './CusTextInput'
// import SplashScreen from 'rn-splash-screen';


class LoginView extends Component{
    constructor(){
        super(...arguments);
        this.loginBtn=this.loginBtn.bind(this);
        // if(this.props.val2.CurrentUser){
        //     debugger
        //     this.props.navigation.navigate('HomePage');
        // }
        this.state={
            userNameText:'',
            PwdText:''
        }

    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.val.logResult.UserID) {
            this.props.navigation.navigate('HomePage');
        }
        // SplashScreen.hide();
    }


    loginBtn(){
        // this.props.nextClick();
        // this.props.navigation.navigate('HomePage');

        this.props.login({
            // LoginName:this.state.userNameText,
            // LoginPwd:this.state.PwdText
            Tel:this.state.userNameText,
            Pwd:this.state.PwdText,
            DeviceID:null,
            Model:null
        });
    }


    render(){
        return (
            <View style={styles.container}>
                <CusTextIput
                    name='用户：'
                    txtHide='请输入用户名或邮箱'
                    imgUrl={require("../imgs/logIcon/login_icon_sj.png")}
                    ispassword={false}
                    getValue={(v) => {
                        this.setState({
                            userNameText:v
                        })
                    }}
                />
                <CusTextIput
                    name='密码：'
                    txtHide='请输入密码'
                    imgUrl={require("../imgs/logIcon/login_icon_mm.png")}
                    ispassword={true}
                    getValue={(v) => {
                        this.setState({
                            PwdText:v
                        })
                    }}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.loginBtn}
                >
                    <Text style={styles.buttonText}>登录</Text>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: 45,
        width: utils.SCREENWIDTH*0.85,
        borderRadius: 6,
        backgroundColor: utils.COLORS.theme,
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    }
});

const mapStateToProps = (state) => {
    const val=state.userInfo;
    return {
        val
    };
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        login: (obj) => {
            dispatch(logReg(obj))
        }
    }
}




export default connect(mapStateToProps,mapDispatchToProps)(LoginView);