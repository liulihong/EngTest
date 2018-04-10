import React, { Component } from 'react';
import { View, Text, Button, Image, Alert, StyleSheet, TouchableOpacity, Picker, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { } from '../store/actions';
import utils from '../utils'
import CusTextIput from './CusTextInput'
import { NavigationActions } from 'react-navigation'
import { fetchPost } from "../request/fetch";
import { getCode, getArea, regist } from "../request/requestUrl"
import CusSelBtn from "./CusSelButton"
import { adressPicker as AdressPicker } from "./PickerCom"


class RegistView extends Component {
    constructor() {
        super(...arguments);
        this.registBtn = this.registBtn.bind(this);
        this.getVerCode = this.getVerCode.bind(this);
        this.userProtocal = this.userProtocal.bind(this);
        this.getAdressInfo = this.getAdressInfo.bind(this);

        this.state = {

            userNameText: '',
            verCodeText: '',
            passwordText: '',
            passText2: '',
            classObj: { "Title": "请选择年级", "ID": "" },
            adressObj: { "Title": "请选择地址", "ID": "" },
            isAgree: true,
            adressDataArr: [],
            classDataArr: [{ 'Title': '六年级', 'ID': '0' }, { 'Title': '七年级', 'ID': '7' },
            { 'Title': '八年级', 'ID': '8' }, { 'Title': '九年级', 'ID': '9' }],
            pickerType: 3,//默认不显示PickerView
        }

        this.getAdressInfo();
    }

    //store 数据更新
    componentWillReceiveProps(nextProps) {

        // if (nextProps.val.ID) {
        //     debugger
        //     //登录成功
        //     this.props.navigation.navigate('HomePage');
        // }
    }

    //获取地址信息
    getAdressInfo() {
        fetchPost(getArea, {}).then((result) => {
            // alert(JSON.stringify(result));
            this.setState({
                adressDataArr: result.Items,
            });
        }, (error) => {
            alert(error);
        })
    }

    //获取验证码
    getVerCode() {
        if (this.state.userNameText === "") {
            Alert.alert("", "请输入手机号");
            return;
        }
        fetchPost(getCode, { "Key": this.state.userNameText, "VerifyFor": 0 }).then((res) => {
            // alert(JSON.stringify(res));
            if (res.success === true) {
                Alert.alert("", "验证码已发出，请注意查收");
            } else {
                Alert.alert("", utils.findErrorInfo(res));
            }
        }, (error) => {
            Alert.alert("", error);
        })
    }

    //注册按钮
    registBtn() {

        //检查用户协议
        if (this.state.isAgree === false) {
            Alert.alert("", "请同意用户协议");
            return;
        }
        //检查必填项
        if (this.state.userNameText === "") {
            Alert.alert("", "用户名不能为空");
            return;
        }
        if (this.state.verCodeText === "") {
            Alert.alert("", "请输入验证码");
            return;
        }
        if (this.state.passwordText === "") {
            Alert.alert("", "请输入密码");
            return;
        }
        if (this.state.passText2 === "") {
            Alert.alert("", "请再次输入密码");
            return;
        }
        if (this.state.passwordText !== this.state.passText2) {
            Alert.alert("", "密码输入不一致");
            return;
        }
        if (this.state.classObj.ID === "") {
            Alert.alert("", "请选择年级");
            return;
        }
        if (this.state.adressObj.ID === "") {
            Alert.alert("", "请选择城市");
            return;
        }

        let obj = {
            "LoginName": this.state.userNameText,
            "Name": "",
            "Pwd": this.state.passwordText,
            "Grade": this.state.classObj.ID,
            "School": "",
            "Phone": "",
            "City": this.state.adressObj.ID,
            "Code": this.state.verCodeText,
        };

        fetchPost(regist, obj).then((res) => {
            if (res.ErrorCode !== undefined) {
                Alert.alert("", utils.findErrorInfo(res));
            } else {
                Alert.alert("", "注册成功，请登录");
                //返回首页方法
                this.props.navigation.goBack();
            }
        }, (error) => {
            Alert.alert("", error);
        });
    }

    //用户协议
    userProtocal(type) {
        if (type === 1) {
            this.setState({
                isAgree: !this.state.isAgree,
            });
        } else if (type === 2) {
            // alert("用户协议编写中");
            this.props.navigation.navigate("WebViewScreen");
        }
    }

    //得到地址ID
    getAdressClassID(type, tempObj) {
        if (type === 1) {
            this.setState({
                classObj: tempObj,
            });
        } else if (type === 2) {
            this.setState({
                adressObj: tempObj,
            });
        }
        this.setState({
            pickerType: 3,
        });
    }

    render() {
        let proImg = this.state.isAgree ? require("../imgs/logIcon/zc_icon_click.png") : require("../imgs/logIcon/zc_icon_mr.png")
        return (
            <ScrollView>
                <View style={styles.container}>

                    <CusTextIput
                        name='用户：'
                        txtHide='请输入手机号或邮箱地址'
                        imgUrl={require("../imgs/logIcon/login_icon_sj.png")}
                        ispassword={false}
                        getValue={(text) => {
                            this.setState({
                                userNameText: text
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
                                    verCodeText: text
                                })
                            }}
                        />
                        <TouchableOpacity
                            style={{ backgroundColor: utils.COLORS.theme, borderRadius: 3, position: 'absolute', right: 28, top: 8 }}
                            onPress={this.getVerCode}
                        >
                            <Text style={{ color: 'white', margin: 10, fontSize: 14, fontWeight: '600' }}>{"获取验证码"}</Text>
                        </TouchableOpacity>
                    </View>

                    <CusTextIput
                        txtHide='请输入密码 (不少于6位)'
                        imgUrl={require("../imgs/logIcon/login_icon_mm.png")}
                        ispassword={true}
                        getValue={(text) => {
                            this.setState({
                                passwordText: text
                            })
                        }}
                    />

                    <CusTextIput
                        txtHide='请再次输入密码'
                        imgUrl={require("../imgs/logIcon/login_icon_mm.png")}
                        ispassword={true}
                        getValue={(text) => {
                            this.setState({
                                passText2: text
                            })
                        }}
                    />

                    <View>
                        <CusTextIput
                            txtHide=''
                            imgUrl={require("../imgs/logIcon/zc_icon_nj.png")}
                        />
                        <CusSelBtn title={this.state.classObj.Title} clickEvent={() => { this.setState({ pickerType: 1, }) }} />
                    </View>

                    <View>
                        <CusTextIput
                            txtHide=''
                            imgUrl={require("../imgs/logIcon/zc_icon_dz.png")}
                        />
                        <CusSelBtn title={this.state.adressObj.Title} clickEvent={() => { this.setState({ pickerType: 2, }) }} />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.registBtn}
                    >
                        <Text style={styles.buttonText}>注册</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                        <TouchableOpacity style={{ padding: 12 }} onPress={() => this.userProtocal(1)}>
                            <Image source={proImg} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 12, paddingLeft: 0 }} onPress={() => this.userProtocal(2)}>
                            <Text style={{ fontSize: 14, color: "#777777" }}>{"我已经阅读并接受"}
                                <Text style={{ fontSize: 14, color: utils.COLORS.theme }}>{"《用户协议》"}</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>



                    <AdressPicker
                        adressDataArr={this.state.adressDataArr}
                        classDataArr={this.state.classDataArr}
                        type={this.state.pickerType}
                        setAdressID={(type, tempObj) => this.getAdressClassID(type, tempObj)}
                    />

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
        marginTop: 30,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
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
        regist: (obj, callBack) => {
            // dispatch(logReg(obj,callBack))
        },
        getVerCode: (obj, callBack) => {
            dispatch(GetCode(obj, callBack))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistView);
