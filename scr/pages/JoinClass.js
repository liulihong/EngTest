import React, { Compnents, Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ValidateTeacher, JoinClass, GetClass, QuitClass } from '../request/requestUrl';
import { fetchPost } from '../request/fetch';
import NavBar from '../components/navBar';
import utils from "../utils";
import CusTextIput from '../components/CusTextInput';
import CusSelBtn from "../components/CusSelButton";
import { adressPicker as AdressPicker } from "../components/PickerCom"
import { REHYDRATE } from 'redux-persist';

let statusDic = { 0: "审核中", 1: "审核通过", 2: "审核失败", 3: "已取消" };

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.getClassID = this.getClassID.bind(this);
        this.getClassData = this.getClassData.bind(this);
        this.applyJoin = this.applyJoin.bind(this);
        this.getMineClasses = this.getMineClasses.bind(this);
        this.exitClasses = this.exitClasses.bind(this);

        this.state = {
            classObj: {},
            userNameText: '',
            classTitle: "请选择班级",
            classDataArr: [],
            pickerType: 3,//默认不显示PickerView

            isJoined: false,//已经加入为否
            mineClassInfo: {},//我的班级信息
        }

        this.getMineClasses();
    }


    //得到我的班级信息
    getMineClasses() {
        fetchPost(GetClass, {}).then((result) => {
            if (result === null) {
                // alert("没有加入任何班级");
                this.setState({
                    isJoined: false,
                    mineClassInfo: {},
                });
            } else {
                this.setState({
                    isJoined: true,
                    mineClassInfo: result,
                });
                // alert(JSON.stringify(result))
            }

        })
    }

    //退出当前班级
    exitClasses() {
        fetchPost(QuitClass, {}).then(() => {
            Alert.alert("", "已退出班级")
            this.setState({
                isJoined: false,
                mineClassInfo: {},
            });
        })
    }

    //获取班级数据
    getClassData() {
        if (this.state.userNameText === '') {
            Alert.alert("", "请输入老师ID或手机号");
            return;
        }
        fetchPost(ValidateTeacher, { Key: this.state.userNameText }).then((res) => {
            if (res.ErrorCode !== undefined) {
                Alert.alert("", utils.findErrorInfo(res));
            } else {
                if (res.Items === undefined || res.Items === null || res.Items.length <= 0) {
                    Alert.alert("", "该老师没有班级信息哦\n请检查老师ID或手机号是否正确");
                    return;
                }
                let classDataArr = [];
                for (let i = 0; i < res.Items.length; i++) {
                    let obj1 = res.Items[i];
                    let obj2 = { ID: obj1.ClassID, Title: obj1.Name }
                    classDataArr.push(obj2);
                }
                this.setState({
                    classDataArr: classDataArr,
                    pickerType: 1,
                });
            }
        })
    }

    //加入班级
    applyJoin() {
        if (this.state.classObj.ID !== undefined && this.state.classObj.ID !== null) {
            // alert("申请加入");
            let paramts = {
                ClassID: this.state.classObj.ID,
                UserID: this.props.navigation.state.params.UserID
            };
            fetchPost(JoinClass, paramts).then((res) => {
                if (res.ErrorCode !== undefined) {
                    Alert.alert("", utils.findErrorInfo(res));
                } else {
                    if (res.Status !== undefined) {
                        let Status = (res.Status === 0) ? "待审核" : (res.Status === 1) ? "审核通过" : "审核失败";
                        Alert.alert("", "申请结果：" + Status);
                    } else {
                        Alert.alert("", JSON.stringify(res));
                    }
                }
            });
        } else {
            Alert.alert("", "请先选择班级");
        }

    }

    //得到班级ID
    getClassID(type, tempObj) {
        if (type === 1) {
            this.setState({
                classObj: tempObj,
                classTitle: tempObj.Title,
            });
        }
        this.setState({
            pickerType: 3,
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            this.state.isJoined === false ? <View style={styles.contain}>
                <NavBar navtitle="加入班级" isBack={true} navgation={this.props.navigation} />

                <View>

                    <ScrollView>
                        <CusTextIput
                            name='用户：'
                            txtHide='请输入老师ID或手机号'
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
                                txtHide=''
                                imgUrl={require("../imgs/logIcon/zc_icon_nj.png")}
                            />
                            <CusSelBtn title={this.state.classTitle} clickEvent={() => { this.getClassData() }} />
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.applyJoin}
                    >
                        <Text style={styles.buttonText}>{"申请加入"}</Text>
                    </TouchableOpacity>

                    <AdressPicker
                        classDataArr={this.state.classDataArr}
                        type={this.state.pickerType}
                        setAdressID={(type, tempObj) => this.getClassID(type, tempObj)}
                    />

                </View>

            </View> : <View style={styles.contain}>
                    <NavBar navtitle="我的班级" isBack={true} navgation={this.props.navigation} />
                    <View style={styles.classInfo}>
                        <Text style={styles.txt}>{"班级名称：" + this.state.mineClassInfo.ClassName}</Text>
                        <Text style={styles.txt}>{"老师名称：" + this.state.mineClassInfo.Name}</Text>
                        <Text style={styles.txt}>{"老师手机号：" + this.state.mineClassInfo.Phone}</Text>
                        <Text style={styles.txt}>{"老师ID：" + this.state.mineClassInfo.TeacherID}</Text>
                        <Text style={styles.txt}>{"审核状态：" + statusDic[this.state.mineClassInfo.Status]}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.exitClasses}
                    >
                        <Text style={styles.buttonText}>{"退出班级"}</Text>
                    </TouchableOpacity>
                </View>
        );
    }

    // // 控制跳转
    // endClick() {
    //     const { navigate } = this.props.navigation;
    //     navigate('HomePage')
    // }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: "#ffffff"
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
    classInfo: {
        // padding:10,
        marginTop: 30,
    },
    txt: {
        lineHeight: 26,
        fontSize: 16,
        color: utils.COLORS.theme1,
    },
});