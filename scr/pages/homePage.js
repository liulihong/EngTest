import React, { Compnents, Component } from 'react';
import { ScrollView, StyleSheet, View, Button, TouchableOpacity, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import VideoCard from '../components/videoCard';
import utils from '../utils'
import NavBar from '../components/navBar';
import { connect } from "react-redux";
import { downFaild, GetCommon, getMovieList, saveDownUrl, startDown } from "../store/actions";
import download from "../utils/download";
import { hostUrl } from "../request/requestUrl";


class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.prepareDown = this.prepareDown.bind(this);
        this.downLoad = this.downLoad.bind(this);
        //获取试题列表
        this.props.GetPaperList();
        //获取下载共用音频URL
        this.props.getCommon();
        //开始下载
        this.state = {
            isLoading: false,
        }
    }

    prepareDown(nextProps) {
        let isDown = false;
        if (nextProps.videoData.downedUrls && nextProps.videoData.downedUrls.length > 0) {
            isDown = nextProps.videoData.downedUrls.some((v) => { return v.path === nextProps.videoData.getCommenUrl });
        }
        if (isDown) {//如果已经下载过的话  当前下载地址和下一个下载地址是否一样 不一样的话应该重新下载
            isDown = nextProps.videoData.getCommenUrl === this.props.videoData.getCommenUrl;
        }
        let loading = nextProps.videoData.downLoading === true;

        let getCommenUrl=nextProps.videoData.getCommenUrl;

        //判断是否下载过
        if (!isDown && !loading && !this.state.isLoading) {
            //检查网络
            if (this.props.netInfo!==undefined && this.props.netInfo.isConnected === false) {
                alert("请检查网络！");
                return;
            }
            //流量提醒
            if (this.props.netInfo!==undefined && this.props.netInfo.connectionInfo.type !== "wifi") {
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
        //得到的URL去下载共用音频
        download(getCommenUrl, "common", (obj) => {
            if (obj.status === "start") {
                this.props.startDown();
            } else if (obj.status === "faild") {
                this.props.downFaild();
                this.setState({
                    isLoading: false,
                });
            } else if (obj.status === "success") {
                this.props.saveUrl(obj);
                this.setState({
                    isLoading: false,
                });
            }
        }).download();
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.videoData.getCommenUrl) {//共用音频下载
            this.prepareDown(nextProps);
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: utils.COLORS.background1 }}>
                <NavBar navtitle="模拟考试" isBack={false} />

                <ScrollView>
                    <View style={styles.contain}>
                        {
                            this.props.videoData.paperList && this.props.videoData.paperList.map(element => {
                                const url = hostUrl + "/" + element.DownPath;
                                const isDown = this.props.videoData.downedUrls && this.props.videoData.downedUrls.length > 0 && this.props.videoData.downedUrls.some((v) => { return v.path === url });
                                return <VideoCard cardDic={element} key={element.ID} isDown={isDown} ishome={false} navigation={this.props.navigation} />
                            })
                        }
                    </View>
                </ScrollView>

                {
                    this.state.isLoading ? <View style={styles.grayView}>
                        <Text style={styles.grayText}>{"努力加载中 • • •"}</Text>
                    </View> : <View />
                }

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
    grayView: {
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "absolute",
        width: utils.SCREENWIDTH,
        height: utils.SCREENHEIGHT,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    grayText: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "500",
    }
});


const mapStateToProps = (state) => {
    const netInfo = state.userInfo.netInfo;
    const videoData = state.videoList;
    return {
        videoData,
        netInfo,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        GetPaperList: () => {
            dispatch(getMovieList())
        },
        getCommon: () => {
            dispatch(GetCommon())
        },
        saveUrl: (obj) => {
            dispatch(saveDownUrl(obj))
        },
        startDown: () => {
            dispatch(startDown({}))
        },
        downFaild: () => {
            dispatch(downFaild({}))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);