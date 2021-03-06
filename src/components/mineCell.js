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
    Alert,
    Linking,
    DeviceEventEmitter,
} from 'react-native';
import { LogOut } from "../store/actions";
import { connect } from "react-redux";
import getToken from "../request/getToken";
import { fetchPost } from "../request/fetch";
import { CheckVersion } from "../request/requestUrl";

class mineCell extends Component {
    constructor() {
        super(...arguments)
        this.btnClick = this.btnClick.bind(this);
        this.CheckVersion = this.CheckVersion.bind(this);
    }

    btnClick() {
        if (this.props.title === "退出登录") {
            this.props.logOut(() => {
                DeviceEventEmitter.emit('replaceRoute', { isLogin: false });
                // this.props.navigation.navigate('Login');
            });
        } else if (this.props.title === "版本检查") {
            this.CheckVersion();
        } else if (this.props.title === "我的班级") {
            if (this.props.store.userInfo.logResult.Name === null)
                Alert.alert("", "请先编辑姓名！");
            else
                this.props.navigation.navigate('JoinClass', { UserID: this.props.store.userInfo.logResult.ID });
        } else if (this.props.title === "意见建议") {
            this.props.navigation.navigate('Report', { UserID: this.props.store.userInfo.logResult.ID });
        } else if (this.props.title === "修改资料") {
            this.props.navigation.navigate('MineInfo', { Name: this.props.store.userInfo.logResult.Name });
        } else {
            Alert.alert("", "功能暂未开通");
        }
    }

    // 版本检查
    CheckVersion() {
        let version=utils.CurrVersion;
        let paramts = { ClientName: utils.PLATNAME, ClientVersion: version };
        fetchPost(CheckVersion, paramts).then((result) => {
            // alert(JSON.stringify(result));
            if ((result.LastClientVersion > version)) {
                Alert.alert('有新版本', '更新说明：' + result.LastClientText,
                    [
                        { text: "暂不更新", onPress: () => { } },
                        {
                            text: "立即更新", onPress: () => {
                                // Linking.openURL('https://itunes.apple.com/cn/app/%E5%8C%BB%E7%A4%BE%E5%8C%BA/id1260422543?mt=8');  
                                // Linking.openURL('https://fir.im/eheartes');
                                Linking.canOpenURL(result.DownloadUrl).then(supported => {
                                    if (supported) {
                                        Linking.openURL(result.DownloadUrl);
                                    } else {
                                        alert("打不开下载地址哦！");
                                    }
                                })
                            }
                        },
                    ]
                );
            } else {
                Alert.alert("", "当前为最新版本");
            }
        })
    }

    render() {
        let version=utils.CurrVersion;
        return (
            <TouchableOpacity style={styles.container} onPress={() => utils.callOnceInInterval(this.btnClick,1000)}>
                <Image style={styles.image} source={this.props.imgurl} />
                <Text style={styles.title}>{this.props.title}</Text>
                {
                    (this.props.title === "版本检查") ? <Text style={styles.title2}>{"1.0."+version}
                        {
                            (utils.Environmental!==utils.DIS)?utils.Environmental:""
                        }
                    </Text> : <Text style={styles.title2} />
                }
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
        width: utils.SCREENWIDTH,
        height: utils.SCREENRATE*48,
        borderWidth: 0.7,
        borderColor: utils.COLORS.background1
    },
    image: {
        marginLeft: utils.SCREENRATE*20,
        width: utils.SCREENRATE*18,
        height: utils.SCREENRATE*18
    },
    title: {
        marginLeft: utils.SCREENRATE*20,
        color: utils.COLORS.theme1,
        fontSize: utils.SCREENRATE*16,
        width: "50%",
    },
    title2: {
        // marginLeft: 20,
        color: "#999999",
        fontSize: utils.SCREENRATE*14,
        position: "absolute",
        right: utils.SCREENRATE*40,
        textAlign:"right",
    },
    arrow: {
        width: utils.SCREENRATE*18,
        height: utils.SCREENRATE*18,
        position: "absolute",
        right: utils.SCREENRATE*15,
    }
});

const mapStateToProps = (state) => {
    let store = state;
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

export default connect(mapStateToProps, mapDispatchToProps)(mineCell);