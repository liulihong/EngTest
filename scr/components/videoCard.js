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

    componentWillReceiveProps(nextProps){
        if(this.state.clickCardID === this.props.cardDic.ID && this.props.downLoadInfo && this.props.downLoadInfo.progress && nextProps.downLoadInfo===undefined){
            Alert.alert("", _this.props.cardDic.SecTitle + "下载异常请重试！");
            // this.props.downFaild();
            // this.props.saveDownInfo(obj);
            _this.setState({
                clickCardID: ""
            });

            this.props.saveDownInfo({ "path": path, "docName": docName, "status": "faild", "progress": "0%" });
        }
    }

    prepareDown() {
        const { DownPath: path, ID: docName } = this.props.cardDic;
        
        if (this.state.clickCardID === docName && this.props.downLoadInfo && this.props.downLoadInfo.progress ) return;//如果已经点击过下载就返回

        //如果正在下载其他的试题包
        if (this.props.downLoadInfo && this.props.downLoadInfo !== undefined && (this.props.downLoadInfo.status === "downloading"||this.props.downLoadInfo.status === "prePare")) {
            Alert.alert("", "下载中请稍后");
            return;
        }

        //检查网络
        if (utils.netInfo.isConnected===false) {
            Alert.alert("", "请检查网络！");
            return;
        }
        //流量提醒
        if (utils.netInfo.connectionInfo.type !== "wifi") {
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
        // if(this.props.downLoadInfo){//如果有下载的话  直接不响应
        //     return;
        // }
        let docName = this.props.cardDic.ID;
        //加入下载列表
        this.setState({
            clickCardID: docName
        });
        this.props.saveDownInfo({ "path": "", "docName": docName, "status": "prePare", "progress": "..." });

        const _this = this;
        //获取试卷下载地址
        fetchPost(examPackage, { EnumDownType: 0, ID: this.props.cardDic.ID }).then((result) => {
            if (result.Url && result.Url !== undefined) {//获取地址成功
                let path = result.Url;
                _this.downLoadObj = download(path, docName, (obj) => {
                    _this.props.saveDownInfo(obj);
                    if (obj.status === "success" && obj.unzip === "success") {
                        _this.props.saveUrl(obj);
                        _this.setState({
                            clickCardID: "",
                        });
                    } else if (obj.status === "faild" || obj.unzip === "faild") {
                        Alert.alert("", _this.props.cardDic.SecTitle + "下载失败！");
                        // this.props.downFaild();
                        // this.props.saveDownInfo(obj);//找一下文档  看看暂停跟继续
                        _this.setState({
                            clickCardID: ""
                        });
                    }else if(obj.progress===""){
                        Alert.alert("", _this.props.cardDic.SecTitle + "下载失败！");
                        // this.props.downFaild();
                        // this.props.saveDownInfo(obj);//找一下文档  看看暂停跟继续
                        _this.setState({
                            clickCardID: ""
                        });
                    }
                }).download();
            } else {
                Alert.alert("", result.ErrorMessage);
                // this.props.downFaild();
                // this.props.saveDownInfo(obj);
                _this.setState({
                    clickCardID: ""
                });
            }
        })
    }

    cardClick() {
        // alert("isConnected="+utils.netInfo.isConnected+"\nconnectionInfo="+JSON.stringify(utils.netInfo.connectionInfo));
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
            <TouchableOpacity style={styles1.contain1} onPress={() => utils.callOnceInInterval(this.cardClick)}>
                <ImageBackground style={styles1.backImg} source={BackImg} >
                    <View style={styles1.titleView}>
                        <Text style={styles1.titleText}>{this.props.cardDic.PriTitle}</Text>
                        <Text style={styles1.titleText}>{this.props.cardDic.SecTitle}</Text>
                        <Text style={styles1.titleText}>{this.props.cardDic.Title}</Text>
                    </View>
                    {
                        (this.props.isDown === undefined || this.props.isDown === false) ? <TouchableOpacity
                            style={styles1.button}
                            onPress={() => utils.callOnceInInterval(this.prepareDown)}
                        >
                            {
                                (this.state.clickCardID === this.props.cardDic.ID && this.props.downLoadInfo && this.props.downLoadInfo.progress) ?
                                    <Text style={styles1.loading}>
                                        {this.props.downLoadInfo.progress}
                                    </Text>
                                    : <ImageBackground style={styles1.xzImg}
                                        source={require("../imgs/testIcon/ks_xz_icon.png")} />
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
        height: utils.SCREENWIDTH * 0.3 / 22 * 28,
        margin: utils.SCREENWIDTH * 0.01,
        borderRadius: 5*utils.SCREENRATE,
    },
    backImg: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    titleView: {
        width: "100%",
        // backgroundColor:"gray",
        padding:utils.SCREENRATE*5,
        paddingTop:utils.SCREENRATE*8,
        paddingBottom:0,
        position:"absolute",
        top:0,
    },
    titleText: {
        color: 'white',
        fontWeight: "700",
        fontSize: utils.SCREENRATE*14,
        marginTop:utils.SCREENRATE*3,
        marginBottom:utils.SCREENRATE*3,
        lineHeight:utils.SCREENRATE*16,
        textAlign: "center",
        width:"100%",
        // backgroundColor:"red",
    },
    button: {
        // backgroundColor:"green",
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: "100%",
        height: "40%",
        position:"absolute",
        bottom:0,
    },
    xzImg: {
        marginRight: utils.SCREENRATE*15,
        width: utils.SCREENRATE*24,
        height: utils.SCREENRATE*24,
    },
    loading: {
        fontSize: utils.SCREENRATE*12,
        color: "white",
        marginRight: utils.SCREENRATE*15,
    }
});

const mapStateToProps = (state) => {
    const downLoadInfo = state.videoList.downLoadInfo;
    return {
        downLoadInfo,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveUrl: (obj) => {
            dispatch(saveDownUrl(obj))
        },
        saveDownInfo: (obj) => {
            dispatch(saveDownInfo(obj));
        },
        savePath: (url, taskId) => {
            dispatch(saveExamPath(url, taskId));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoCard);