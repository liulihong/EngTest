import React,{Component} from 'react';
import {View ,Text ,Button ,TextInput,Alert} from 'react-native';
import {connect} from 'react-redux';
import {Login as logReg} from '../store/actions';
import utils from  '../utils'
import CusTextIput from './CusTextInput'
import SplashScreen from 'rn-splash-screen';


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
        SplashScreen.hide();
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
            <View>
                <CusTextIput
                    name='用户：'
                    txtHide='请输入用户名或邮箱'
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
                    ispassword={true}
                    getValue={(v) => {
                        this.setState({
                            PwdText:v
                        })
                    }}
                />
                {/*<TextInput*/}
                    {/*style={{height: 40,width : utils.SCREENWIDTH/2, borderBottomColor: 'black', borderBottomWidth: 1}}*/}
                    {/*onChangeText={(text) => this.setState({userNameText:text})}*/}
                    {/*value={this.state.userNameText}*/}
                {/*/>*/}
                {/*<TextInput*/}
                    {/*style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 1}}*/}
                    {/*onChangeText={(text) => this.setState({PwdText:text})}*/}
                    {/*value={this.state.PwdText}*/}
                {/*/>*/}
                <Button
                    onPress={this.loginBtn}
                    title="login"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
            </View>
        );
    }
}

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