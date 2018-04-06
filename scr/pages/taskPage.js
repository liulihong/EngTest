import React, { Compnents, Component } from 'react';
import { ScrollView, StyleSheet, View, Button, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native';
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

        this.state = {
            isShowFinsh: false,
            dataArr: [],
        }
        // this.GetPaperList(this.state.isShowFinsh);
    }

    //组件加载完成
    componentWillMount() {
        DeviceEventEmitter.addListener('reloadHomework', () => {
            //获取试题列表
            this.GetPaperList(this.state.isShowFinsh);
        });
    }


    GetPaperList(isShowFinsh) {
        if (isShowFinsh !== this.state.isShowFinsh) {
            this.setState({
                isShowFinsh: isShowFinsh,
            });
        }
        let Status = (isShowFinsh === true) ? 2 : 0;
        fetchPost(GetHomework, { Status: Status }).then((res) => {
            // alert("1111" + JSON.stringify(res));
            // debugger
            if (res.PaperList !== undefined) {
                dataArr = res.PaperList;
                this.setState({
                    dataArr,
                });
            }
        }, (error) => {
            // alert("2222"+JSON.stringify(error));
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
                    (this.state.dataArr === undefined || this.state.dataArr.length <= 0) ? <Text
                        style={{ width: utils.SCREENWIDTH, lineHeight: 50, textAlign: "center" }}
                    >{"没有相关作业哦"}</Text> :
                        <ScrollView>
                            <View style={styles.contain}>
                                {
                                    this.state.dataArr.map((element,i) => {
                                        const url = element.DownPath;
                                        const isDown = this.props.videoData.downedUrls && this.props.videoData.downedUrls.length > 0 && this.props.videoData.downedUrls.some((v) => { return v.path === url });
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
    const videoData = state.videoList;
    return {
        videoData,
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
        height: 50,
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
        fontSize: 16,
    },
    line1: {
        position: "absolute",
        width: utils.SCREENWIDTH / 375,
        height: 30,
        left: utils.SCREENWIDTH / 2,
        top: 10,
        backgroundColor: "#bbbbbb",
    },
    line2: {
        width: utils.SCREENWIDTH,
        height: 1,
        backgroundColor: "#bbbbbb",
    }
});