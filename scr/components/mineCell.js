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
                this.props.navigation.navigate('Login');
            });
        } else if (this.props.title === "版本检查") {
            this.CheckVersion();
        } else if (this.props.title === "我的班级") {
            if(this.props.store.userInfo.logResult.Name===null)
                alert("请先编辑姓名！");
            else
                this.props.navigation.navigate('JoinClass', { UserID: this.props.store.userInfo.logResult.ID });
        } else if (this.props.title === "意见建议") {
            this.props.navigation.navigate('Report',{ UserID: this.props.store.userInfo.logResult.ID });
        } else if (this.props.title === "修改资料") {
            this.props.navigation.navigate('MineInfo',{ Name: this.props.store.userInfo.logResult.Name });
        }else {
            alert("功能暂未开通");
        }
    }

    // 版本检查
    CheckVersion() {
        let version = (utils.PLATNAME === "IOS") ? utils.version_ios : utils.version_android;
        let paramts = { ClientName: utils.PLATNAME, ClientVersion: version };
        fetchPost(CheckVersion, paramts).then((result) => {
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
                                Linking.openURL(result.DownloadUrl);
                            }
                        },
                    ]
                );
            } else {
                alert("当前为最新版本");
            }
        })
    }

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={() => { this.btnClick() }}>
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
        width: utils.SCREENWIDTH,
        height: 48,
        borderWidth: 0.7,
        borderColor: utils.COLORS.background1
    },
    image: {
        marginLeft: 20,
        width: 18,
        height: 18
    },
    title: {
        marginLeft: 20,
        color: utils.COLORS.theme1,
        fontSize: 16,
        width: "75%",
    },
    arrow: {
        width: 18,
        height: 18
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