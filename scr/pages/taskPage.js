import React, { Compnents, Component } from 'react';
import { ScrollView, StyleSheet, View, Button, Text, TouchableOpacity, Alert, DeviceEventEmitter } from 'react-native';
import { StackNavigator } from 'react-navigation';
import VideoCard from '../components/videoCard';
import utils from '../utils';
import NavBar from '../components/navBar';
import { GetHomework } from "../request/requestUrl";
import { fetchPost } from "../request/fetch";
import { hostUrl } from "../request/requestUrl";
import { connect } from "react-redux";



class TaskScreen extends Component {

    constructor(props) {
        super(props)
        this.btnClick = this.btnClick.bind(this);
        this.GetPaperList = this.GetPaperList.bind(this);

        this.state={
            // dataArr:[],
        };
    }

    //组件加载完成
    componentWillMount() {
        DeviceEventEmitter.addListener('reloadHomework', () => {
            // if (this.props.logResult && this.props.logResult !== undefined) {
            //检查网络
            if (this.props.netInfo !== undefined && this.props.netInfo.isConnected === false) {
                Alert.alert("", "请检查网络！");
                return;
            }

            // alert(JSON.stringify(this.state));
            //获取试题列表
            this.GetPaperList(this.state.isShowFinsh);
            // }
        });
    }
    componentWillUnmount(){
        DeviceEventEmitter.removeAllListeners('reloadHomework');
    }

    GetPaperList(isShowFinsh) {
        if (isShowFinsh !== this.state.isShowFinsh) {
            this.setState({
                isShowFinsh: isShowFinsh,
            });
        }
        let Status = (isShowFinsh === true) ? 2 : 0;
        fetchPost(GetHomework, { Status: Status }).then((res) => {
            if (res.ErrorCode !== undefined) {
                Alert.alert("", utils.findErrorInfo(res));
                if(res.ErrorCode===1003||res.ErrorCode===1004||res.ErrorCode===1106){
                    DeviceEventEmitter.emit('replaceRoute',{isLogin:false});
                }
            }else{
                if (res.PaperList !== undefined) {
                    let dataArr = res.PaperList;
                    this.setState({
                        dataArr,
                    });
                }
            }
        }, (error) => {
            alert("作业"+error);
        })
    }

    btnClick() {
        this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <View style={{ backgroundColor: utils.COLORS.background1 }}>
                <NavBar navtitle="作业" isBack={false} />
                <View style={styles.btnView}>
                    <TouchableOpacity style={styles.btn} onPress={() => this.GetPaperList(false)}>
                        <Text style={[styles.btnTxt, (this.state.isShowFinsh === false || this.state.isShowFinsh === undefined) ? { color: utils.COLORS.theme } : { color: utils.COLORS.theme1 }]}>{"待完成"}</Text>
                    </TouchableOpacity>
                    <View style={styles.line1} />
                    <TouchableOpacity style={styles.btn} onPress={() => this.GetPaperList(true)}>
                        <Text style={[styles.btnTxt, (this.state.isShowFinsh === true) ? { color: utils.COLORS.theme } : { color: utils.COLORS.theme1 }]}>{"已完成"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.line2} />

                {
                    (this.state.dataArr === null || this.state.dataArr === undefined || this.state.dataArr.length <= 0) ? <Text
                        style={{ width: utils.SCREENWIDTH, fontSize:15*utils.SCREENRATE, lineHeight: 50*utils.SCREENRATE, textAlign: "center" }}
                    >{"没有相关作业哦"}</Text> :
                        <ScrollView>
                            <View style={styles.contain}>
                                {
                                    this.state.dataArr.map((element, i) => {
                                        // const url = element.DownPath;
                                        const isDown = this.props.videoData.downedUrls && this.props.videoData.downedUrls.length > 0 && this.props.videoData.downedUrls.some((v) => { return v.docName === element.ID });
                                        // const isDown = this.props.videoData.downedUrls && this.props.videoData.downedUrls.length > 0 && this.props.videoData.downedUrls.some((v) => { return v.path === url });
                                        return <VideoCard cardDic={element} key={i} ishome={true} isFinish={this.state.isShowFinsh} isDown={isDown} navigation={this.props.navigation} />
                                    })
                                }
                            </View>
                        </ScrollView>
                }
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const logResult = state.userInfo.logResult;
    const videoData = state.videoList;
    const netInfo = state.userInfo.netInfo;
    return {
        videoData,
        logResult,
        netInfo,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskScreen);

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
    btnView: {
        width: '100%',
        height: 50*utils.SCREENRATE,
        backgroundColor: 'white',
        flexDirection: "row",
    },
    btn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "50%",
    },
    btnTxt: {
        alignSelf: "center",
        textAlign: "center",
        fontSize: 16*utils.SCREENRATE,
    },
    line1: {
        position: "absolute",
        width: utils.SCREENWIDTH / 375,
        height: 30*utils.SCREENRATE,
        left: utils.SCREENWIDTH / 2,
        top: 10*utils.SCREENRATE,
        backgroundColor: "#bbbbbb",
    },
    line2: {
        width: utils.SCREENWIDTH,
        height: 1,
        backgroundColor: "#bbbbbb",
    }
});