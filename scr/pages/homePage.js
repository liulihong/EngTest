import React, { Compnents, Component } from 'react';
import { ScrollView, StyleSheet, View, Button, TouchableOpacity, Text, DeviceEventEmitter, Alert, Platform,BackHandler,ToastAndroid } from 'react-native';
import { StackNavigator } from 'react-navigation';
import VideoCard from '../components/videoCard';
import utils from '../utils'
import NavBar from '../components/navBar';
import { connect } from "react-redux";
import { GetCommon, getMovieList, saveDownUrl, saveDownInfo } from "../store/actions";
import download from "../utils/download";
import { hostUrl } from "../request/requestUrl";

class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.prepareDown = this.prepareDown.bind(this);
        this.downLoad = this.downLoad.bind(this);
        // this.reloadListAndCheckCommon=this.reloadListAndCheckCommon.bind();
        // this.onBackAndroid=this.onBackAndroid.bind();
        //开始下载
        this.state = {
            isLoading: false,
        }
        this.props.GetPaperList();//获取试题列表
        this.props.getCommon((url)=>{
            this.prepareDown(url);
        });//获取下载共用音频URL
    }

    //组件加载完成
    componentDidMount() {
        
        DeviceEventEmitter.addListener('reloadVideoList', (obj) => {
            // utils.showDevInfo(JSON.stringify(obj));
            //检查网络
            if (this.props.netInfo !== undefined && this.props.netInfo.isConnected === false) {
                Alert.alert("", "请检查网络！");
                return;
            }
            // this.reloadListAndCheckCommon(obj.isCheck);

            let that=this;
            if(obj.isCheck){
                that.props.getCommon((url)=>{
                    that.prepareDown(url);
                });//获取下载共用音频URL
            }
            this.props.GetPaperList();//获取试题列表
        });
    }
    componentWillUnmount(){
        DeviceEventEmitter.removeAllListeners('reloadVideoList');
    }

    // reloadListAndCheckCommon(have){
    //     alert(have);
    //     if(have){
    //         this.props.getCommon();//获取下载共用音频URL
    //     }
    //     this.props.GetPaperList();//获取试题列表
    // }

    prepareDown(url) {
        let isDown = false;
        if (this.props.videoData.downedUrls && this.props.videoData.downedUrls.length > 0) {
            isDown = this.props.videoData.downedUrls.some((v) => { return v.CityID === this.props.logResult.CityID});
            // if (isDown) {//如果已经下载过的话  当前下载地址和下一个下载地址是否一样 不一样的话应该重新下载
            //     isDown = url === this.props.videoData.getCommenUrl;
            // }
        }

        // let loading = nextProps.videoData.downLoadInfo!==null && nextProps.videoData.downLoadInfo!==undefined && nextProps.videoData.downLoadInfo.status === "downloading";
        let getCommenUrl = url;


        //判断是否下载过
        if (!isDown && this.state.isLoading === false) {
            //检查网络
            if (this.props.netInfo !== undefined && this.props.netInfo.isConnected === false) {
                Alert.alert("", "请检查网络！");
                return;
            }
            //流量提醒
            if (this.props.netInfo !== undefined && this.props.netInfo.connectionInfo.type !== "wifi") {
                Alert.alert('温馨提示', '当前为非wifi环境确定要下载？',
                    [
                        { text: "取消", onPress: () => { } },
                        { text: "确定", onPress: () => { this.downLoad(getCommenUrl) } },
                    ]
                );
                return;
            }
            this.downLoad(getCommenUrl);
        }
    }

    downLoad(getCommenUrl) {
        this.setState({
            isLoading: true,
        });
        DeviceEventEmitter.emit('startDownloadSound');
        //得到的URL去下载共用音频
        download(getCommenUrl, "common", (obj) => {

            if (obj.status === "success" && obj.unzip === "success") {
                DeviceEventEmitter.emit('endDownloadSound');
                obj.CityID = this.props.logResult.CityID;
                this.props.saveUrl(obj);
                this.setState({
                    isLoading: false,
                });
            } else if (obj.status === "faild" || obj.unzip === "faild") {
                DeviceEventEmitter.emit('endDownloadSound');
                this.setState({
                    isLoading: false,
                });
            }
            this.props.saveDownInfo(obj);

        }).download();
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.logResult && nextProps.videoData && nextProps.videoData.getCommenUrl) {//共用音频下载
            // this.prepareDown(nextProps);
        // }
    }

    render() {
        return (
            <View style={{ backgroundColor: utils.COLORS.background1 }}>
                <NavBar navtitle="模拟考试" isBack={false} />
                <ScrollView>
                    {
                        (this.props.logResult && this.props.logResult !== undefined) ? <View style={styles.whiteView}>
                            <Text style={{ marginLeft: 10, color: "#666666" , fontSize: 14*utils.SCREENRATE }}>{" " + this.props.logResult.CityText + " → " + this.props.logResult.GradeText + " → 模拟考试列表"}</Text>
                            <View style={styles.line}></View>
                        </View> : <View />
                    }
                    <View style={styles.contain}>
                        {
                            this.props.videoData.paperList && this.props.videoData.paperList !== undefined && this.props.videoData.paperList.length > 0 ?
                                this.props.videoData.paperList.map((element, i) => {
                                    // const url = element.DownPath;
                                    const isDown = this.props.videoData.downedUrls && this.props.videoData.downedUrls.length > 0 && this.props.videoData.downedUrls.some((v) => { return v.docName === element.ID });
                                    return <VideoCard cardDic={element} key={i} isDown={isDown} ishome={false} navigation={this.props.navigation} />
                                }) : <View />
                        }
                    </View>
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    contain: {
        margin: utils.SCREENWIDTH * 0.02,
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        height: utils.SCREENHEIGHT,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    whiteView: {
        width: '100%',
        height: 40*utils.SCREENRATE,
        backgroundColor: 'white',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    line: {
        width: utils.SCREENWIDTH,
        height: 1,
        backgroundColor: "#cccccc",
        position: "absolute",
        bottom: 0,
    }
    // grayView: {
    //     backgroundColor: "rgba(0,0,0,0.5)",
    //     position: "absolute",
    //     width: utils.SCREENWIDTH,
    //     height: utils.SCREENHEIGHT,
    //     flexDirection: "row",
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    // grayText: {
    //     color: "#ffffff",
    //     fontSize: 20,
    //     fontWeight: "500",
    // }
});


const mapStateToProps = (state) => {
    const logResult = state.userInfo.logResult
    const netInfo = state.userInfo.netInfo;
    const videoData = state.videoList;
    return {
        videoData,
        netInfo,
        logResult
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        GetPaperList: () => {
            dispatch(getMovieList())
        },
        getCommon: (callBack) => {
            dispatch(GetCommon(callBack))
        },
        saveUrl: (obj) => {
            dispatch(saveDownUrl(obj))
        },
        saveDownInfo: (obj) => {
            dispatch(saveDownInfo(obj));
        }
        // startDown: () => {
        //     dispatch(startDown({}))
        // },
        // downFaild: () => {
        //     dispatch(downFaild({}))
        // },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);