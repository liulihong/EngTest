import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import utils from '../utils';
import download from '../utils/download';
import { hostUrl, examPackage } from '../request/requestUrl';
import { saveDownInfo, saveDownUrl, saveExamPath } from "../store/actions";
import { connect } from "react-redux";
import { fetchPost } from "../request/fetch";

class VideoCard extends Component {



    constructor(props) {
        super(props);
        this.downLoad = this.downLoad.bind(this);
        this.prepareDown = this.prepareDown.bind(this);
        this.cardClick = this.cardClick.bind(this);
        this.state = {
            clickCardID: "",
        }
    }

    prepareDown() {
        const { DownPath: path, ID: docName } = this.props.cardDic;

        if (this.state.clickCardID === docName) return;//如果已经点击过下载就返回

        //如果正在下载其他的试题包
        if (this.props.downLoadInfo && this.props.downLoadInfo !== undefined && this.props.downLoadInfo.status === "downloading") {
            Alert.alert("", "下载中请稍后");
            return;
        }

        //检查网络
        if (this.props.netInfo !== undefined && this.props.netInfo.isConnected === false) {
            Alert.alert("", "请检查网络！");
            return;
        }
        //流量提醒
        if (this.props.netInfo !== undefined && this.props.netInfo.connectionInfo.type !== "wifi") {
            Alert.alert('温馨提示', '当前网络为非wifi环境确定下载？',
                [
                    { text: "取消", onPress: () => { } },
                    { text: "确定", onPress: () => { this.downLoad() } },
                ]
            );
            return;
        }
        this.downLoad();
    }

    downLoad() {
        let docName=this.props.cardDic.ID;
        //加入下载列表
        this.setState({
            clickCardID: docName
        });
        this.props.saveDownInfo({"path":"","docName":docName,"status":"prePare","progress":"..."});
        
        //获取试卷下载地址
        fetchPost(examPackage, { EnumDownType: 0, ID: this.props.cardDic.ID }).then((result) => {
            if(result.Url&&result.Url!==undefined){//获取地址成功
                let path=result.Url;
                download(path, docName, (obj) => {
                    this.props.saveDownInfo(obj);
                    if (obj.status === "success") {
                        this.props.saveUrl(obj);
                        this.setState({
                            clickCardID: "",
                        });
                    } else if (obj.status === "faild") {
                        Alert.alert("", this.props.cardDic.SecTitle + "下载失败！");
                        // this.props.downFaild();
                        // this.props.saveDownInfo(obj);
                        this.setState({
                            clickCardID: ""
                        });
                    }
                }).download();
            }else{
                Alert.alert("", result.ErrorMessage);
                // this.props.downFaild();
                // this.props.saveDownInfo(obj);
                this.setState({
                    clickCardID: ""
                });
            }
        })


    }

    cardClick() {

        if (this.props.isDown) {
            let taskId = this.props.cardDic.TaskID;
            let url = utils.DOWNLOADDOCUMENTPATH + "/" + this.props.cardDic.ID;
            this.props.savePath(url, taskId);

            let ishome = this.props.ishome;
            this.props.navigation.navigate('TestStart', { ID: this.props.cardDic.ID, ishome, isFinish: this.props.isFinish });
        } else {
            Alert.alert("", "请下载试题包");
        }
    }

    componentWillReceiveProps(nextProps) {

    }


    render() {
        let BackImg = this.props.isDown ? require("../imgs/testIcon/ks_sj_bg.png") : require("../imgs/testIcon/ks_s_bg_ls.png");
        // let scoreRecord=this.props.isDown?"":"未下载";
        // let scoreRecord="";
        return (
            <TouchableOpacity style={styles1.contain1} onPress={() => this.cardClick()}>
                <ImageBackground style={styles1.backImg} source={BackImg} >
                    {/* <Text style={styles1.scoreText}>{scoreRecord}</Text> */}
                    <Text style={styles1.titleText}>{this.props.cardDic.PriTitle + "\n" + this.props.cardDic.SecTitle + "\n" + this.props.cardDic.Title}</Text>
                    {
                        (this.props.isDown === undefined || this.props.isDown === false) ? <TouchableOpacity
                            style={styles1.button}
                            onPress={() => this.prepareDown()}
                        >
                            {
                                (this.state.clickCardID === this.props.cardDic.ID) ? <Text style={styles1.loading}>{this.props.downLoadInfo && this.props.downLoadInfo !== undefined && this.props.downLoadInfo.progress}</Text> : <ImageBackground style={styles1.xzImg} source={require("../imgs/testIcon/ks_xz_icon.png")} />
                            }
                        </TouchableOpacity> : <View style={styles1.button} />
                    }
                </ImageBackground>
            </TouchableOpacity>

        )
    }
}

const styles1 = StyleSheet.create({
    contain1: {
        // flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "red",
        width: utils.SCREENWIDTH * 0.3,
        height: utils.SCREENWIDTH * 0.3 / 22 * 25,
        margin: utils.SCREENWIDTH * 0.01,
        borderRadius: 5,
    },
    backImg: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        // margin:utils.SCREENWIDTH*0.01,
        // borderRadius: 3,
    },
    scoreText: {
        marginTop: 10,
        color: 'white',
        // fontWeight:"800",
        fontSize: 12,
    },
    titleText: {
        marginTop: 10,
        color: 'white',
        fontWeight: "700",
        fontSize: 15,
        textAlign: "center",
    },
    button: {
        marginTop: 10,
        // backgroundColor:"red",
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: "100%",
        height: "40%",
    },
    xzImg: {
        marginRight: 15,
        width: 24,
        height: 24,
    },
    loading: {
        fontSize: 12,
        color: "white",
        marginRight: 15,
    }
});

const mapStateToProps = (state) => {
    const netInfo = state.userInfo.netInfo;
    const downLoadInfo = state.videoList.downLoadInfo;
    return {
        downLoadInfo,
        netInfo,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveUrl: (obj) => {
            dispatch(saveDownUrl(obj))
        },
        // startDown: () => {
        //     dispatch(startDown({}))
        // },
        // downFaild: () => {
        //     dispatch(downFaild({}))
        // },
        saveDownInfo: (obj) => {
            dispatch(saveDownInfo(obj));
        },
        savePath: (url, taskId) => {
            dispatch(saveExamPath(url, taskId));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoCard);