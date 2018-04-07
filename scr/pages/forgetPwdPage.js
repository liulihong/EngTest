import React,{Component} from 'react';
import {View, Text, Button, Image, Alert, StyleSheet,TouchableOpacity , Picker } from 'react-native';
import {connect} from 'react-redux';
import {  } from '../store/actions';
import utils from  '../utils';
import CusTextIput from '../components/CusTextInput';
import { NavigationActions } from 'react-navigation';
import {fetchPost} from "../request/fetch";
import { getCode , ResetPwd } from "../request/requestUrl";
import NavBar from '../components/navBar';


class PwdScreen extends Component{
    constructor(){
        super(...arguments);
        this.motifyPwdBtn=this.motifyPwdBtn.bind(this);
        this.getVerCode=this.getVerCode.bind(this);
        // this.userProtocal=this.userProtocal.bind(this);
        // this.getAdressInfo=this.getAdressInfo.bind(this);

        this.state={
            userNameText:'',
            verCodeText:'',
            passwordText:'',
            passText2:'',
        }

    }

    //store 数据更新
    componentWillReceiveProps(nextProps) {

        // if (nextProps.val.ID) {
        //     debugger
        //     //登录成功
        //     this.props.navigation.navigate('HomePage');
        // }
    }



    //获取验证码
    getVerCode(){
        if(this.state.userNameText===""){
            Alert.alert("","请输入手机号");
            return;
        }
        fetchPost(getCode,{"Key":this.state.userNameText,"VerifyFor":2}).then((res)=>{
            // alert(JSON.stringify(res));
            if(res.success===true){
                Alert.alert("","验证码已发出，请注意查收");
            }else {
                Alert.alert("",utils.findErrorInfo(res));
            }
        },(error)=>{
            Alert.alert("",error);
        })
    }

    //注册按钮
    motifyPwdBtn(){
        //检查必填项
        if(this.state.userNameText===""){
            Alert.alert("","用户名不能为空");
            return;
        }
        if(this.state.verCodeText===""){
            Alert.alert("","请输入验证码");
            return;
        }
        if(this.state.passwordText===""){
            Alert.alert("","请输入密码");
            return;
        }
        if(this.state.passText2===""){
            Alert.alert("","请再次输入密码");
            return;
        }
        if(this.state.passwordText!==this.state.passText2){
            Alert.alert("","密码输入不一致");
            return;
        }
        

        let obj={
            "LoginName":this.state.userNameText,
            "NewPwd":this.state.passwordText,
            "Code":this.state.verCodeText,
        };

        fetchPost( ResetPwd ,obj ).then((res)=>{
            if(res.ErrorCode!==undefined){
                Alert.alert("",utils.findErrorInfo(res));
            }else {
                Alert.alert("","恭喜重置密码成功，请登录");
                //返回首页方法
                this.props.navigation.goBack();
            }
        },(error)=>{
            Alert.alert("",error);
        });
    }



    render(){
        let proImg=this.state.isAgree?require("../imgs/logIcon/zc_icon_click.png"):require("../imgs/logIcon/zc_icon_mr.png")
        return (
            <View style={styles.container}>

            <NavBar navtitle="注册" isBack={true} navgation={this.props.navigation}/>

                <CusTextIput
                    name='用户：'
                    txtHide='请输入手机号或邮箱地址'
                    imgUrl={require("../imgs/logIcon/login_icon_sj.png")}
                    ispassword={false}
                    getValue={(text) => {
                        this.setState({
                            userNameText:text
                        })
                    }}
                />

                <View>
                    <CusTextIput
                        txtHide='请输入验证码'
                        imgUrl={require("../imgs/logIcon/login_icon_yzm.png")}
                        ispassword={false}
                        getValue={(text) => {
                            this.setState({
                                verCodeText:text
                            })
                        }}
                    />
                    <TouchableOpacity
                        style={{backgroundColor:utils.COLORS.theme,borderRadius:3,position:'absolute',right:28,top:8}}
                        onPress={this.getVerCode}
                    >
                        <Text style={{color:'white',margin:10,fontSize:14,fontWeight:'600'}}>{"获取验证码"}</Text>
                    </TouchableOpacity>
                </View>

                <CusTextIput
                    txtHide='请输入密码 (不少于6位)'
                    imgUrl={require("../imgs/logIcon/login_icon_mm.png")}
                    ispassword={true}
                    getValue={(text) => {
                        this.setState({
                            passwordText:text
                        })
                    }}
                />

                <CusTextIput
                    txtHide='请再次输入密码'
                    imgUrl={require("../imgs/logIcon/login_icon_mm.png")}
                    ispassword={true}
                    getValue={(text) => {
                        this.setState({
                            passText2:text
                        })
                    }}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.motifyPwdBtn}
                >
                    <Text style={styles.buttonText}>确定</Text>
                </TouchableOpacity>
                  
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        // marginTop:10
        flex:1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor:"#ffffff"
    },
    button: {
        height: 45,
        width: utils.SCREENWIDTH*0.85,
        borderRadius: 6,
        backgroundColor: utils.COLORS.theme,
        justifyContent: 'center',
        marginTop: 30,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },

});


const mapStateToProps = (state) => {
    const val=state.userInfo.logResult;
    return {
        val,
    };
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        regist: (obj,callBack) => {
            // dispatch(logReg(obj,callBack))
        },
        getVerCode: (obj,callBack) => {
            dispatch(GetCode(obj,callBack))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PwdScreen);
