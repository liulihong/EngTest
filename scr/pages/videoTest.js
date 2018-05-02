import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import utils from "../utils";
import NavBar from '../components/navBar';

import MySound from "../utils/soundPlay"
import { connect } from "react-redux";
import { getExamContent, savePlayTime } from "../store/actions";

import HearSelect from '../components/HearSelectCom';
import HearRecord from '../components/HearRecordCom';
import HearSelPic from '../components/HearSelPicCom';
import AudioSoundConCom from '../components/AudioSoundConCom'

import AnswerCom from '../components/answerCom';
import RNFS from "react-native-fs";
import { detail } from "../store/reducer";

import RNIdle from 'react-native-idle'//屏保常亮

let Sound1 = new MySound;



const styles = StyleSheet.create({
    contain: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: utils.SCREENHEIGHT,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: utils.COLORS.background1,
    },
    title: {
        color: utils.COLORS.theme1,
        fontSize: 17 * utils.SCREENRATE,
        // textAlign:"auto",
        lineHeight: 25 * utils.SCREENRATE,
        marginBottom: 10 * utils.SCREENRATE,
    },
    content: {
        marginTop: 15 * utils.SCREENRATE,
        backgroundColor: "#ffffff",
        width: utils.SCREENWIDTH - 30 * utils.SCREENRATE,
        height: utils.SCREENHEIGHT - 100 * utils.SCREENRATE - 100,
        padding: 10 * utils.SCREENRATE,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 8 * utils.SCREENRATE,
    },
    contentScr: {
        // display:'flex',
    },
});

class VideoTest extends Component {

    constructor(props) {
        super(props)
        this.getContent = this.getContent.bind(this);
        this.getComponent = this.getComponent.bind(this);
        this.setScroInfo = this.setScroInfo.bind(this);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.answers !== this.props.answers) {
            let path = this.props.examPath + "/answer" + this.props.answerRecord.version + '/answer.json';
            RNFS.writeFile(path, JSON.stringify(nextProps.answers), 'utf8').then(() => { });
        }
    }

    componentDidMount() {
        RNIdle.disableIdleTimer()    //保持屏幕常亮
    }
    componentWillUnmount() {
        RNIdle.enableIdleTimer()     //退出屏幕常亮
    }

    getComponent() {
        if (this.props.isHaveContent) {
            if (this.props.gropObj.Type === 1) {//听后选择
                return <HearSelect contentData={this.props.topInfo.contentData} />;
            } else if (this.props.gropObj.Type === 2) {//听后回答
                return <Text style={styles.title}>{this.props.topInfo.contentData[0].Title}</Text>;
            } else if (this.props.gropObj.Type === 3) {//听后记录
                return <HearRecord contentData={this.props.topInfo.contentData} examPath={this.props.examPath} type={this.props.gropObj.Type} />;
            } else if (this.props.gropObj.Type === 4) {//转述信息
                return <HearRecord contentData={this.props.topInfo.contentData} examPath={this.props.examPath} type={this.props.gropObj.Type} />;
            } else if (this.props.gropObj.Type === 5) {//短文朗读
                return <Text style={styles.title}>{this.props.topInfo.contentData[0].Title}</Text>;
            } else if (this.props.gropObj.Type === 10) {//听后选图
                return <HearSelPic contentData={this.props.topInfo.contentData} examPath={this.props.examPath} imgList={this.props.gropObj.ImgList} />;
            }
        }
    }

    //如果不是读标题  内容展示区
    getContent() {
        if (this.props.topInfo && this.props.topInfo.currLevel === "finished") {
            // this.props.navigation.goBack();
            // this.props.navigation.navigate('AnswerScreen');
            // if(this.props.answers===undefined){
            //     return <Text>{"亲！ 您交了白卷。。。"}</Text>
            // }
            // return <Text>{"正在交卷中。。。"}</Text>
            // return <AnswerCom answers={this.props.answers} />
            return <View style={{ width: "100%", backgroundColor: "rgba(0,0,0,0)" }}>
                <ActivityIndicator
                    animating={true}
                    style={[{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 8 * utils.SCREENRATE,
                    }, { height: utils.SCREENHEIGHT / 3 }]}
                    size="large"
                />
                <Text style={{ textAlign: "center" }}>{"正在交卷中..."}</Text>
            </View>
        } else if (this.props.isHaveContent) {
            return (
                <View style={{ padding: 5 * utils.SCREENRATE }}>
                    <Text style={styles.title}>{this.props.topObj.Title}</Text>
                    <Text style={styles.title}>{this.props.topInfo.showTitle}</Text>
                    {
                        this.getComponent()
                    }
                </View>
            );
        } else {
            return <Text style={styles.title}>{this.props.topInfo ? this.props.topInfo.showTitle : ""}</Text>
        }
    }

    setScroInfo(e) {
        this.offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        this.contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        this.oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度

        let isTop1 = (this.offsetY <= 0);
        let isBottom1 = (this.offsetY >= (this.contentSizeHeight - this.oriageScrollHeight));
        // debugger
        if (this.state.isTop === null || isTop1 !== this.state.isTop) this.setState({ isTop: isTop1 });
        if (this.state.isBottom === null || isBottom1 !== this.state.isBottom) this.setState({ isBottom: isBottom1 });
    }

    render() {
        return (
            <View style={styles.contain}>

                <NavBar navtitle={this.props.examContent.SecTitle} isBack={true} navgation={this.props.navigation} />

                <View style={styles.content}>
                    {
                        (this.offsetY && this.offsetY > 0 && this.state.isTop === false) ? <TouchableOpacity
                            style={{ flexDirection: "row", backgroundColor: "rgba(0,0,0,0)", width: "100%", height: 30 * utils.SCREENRATE, alignItems: "center", justifyContent: "center" }}
                            onPress={() => {
                                // if (this.contentSizeHeight !== undefined) {
                                //     let showY = (this.offsetY - 20) > 0 ? this.offsetY - 20 : 0;
                                //     this._scroll.scrollTo({ y: showY });
                                // } else {
                                this._scroll.scrollTo({ y: 0 });
                                this.setState({ isTop: true });
                                // }
                            }}
                        >
                            <Text style={{ color: "gray", fontSize: 12 * utils.SCREENRATE }}>{"回到顶部 ⇈"}</Text>
                        </TouchableOpacity> : <TouchableOpacity style={{ flexDirection: "row", backgroundColor: "rgba(0,0,0,0)", width: "100%", height: 10 * utils.SCREENRATE, alignItems: "center", justifyContent: "center" }} />
                    }
                    <ScrollView
                        ref={(scroll) => this._scroll = scroll}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        onMomentumScrollEnd={(e)=>{
                            this.setScroInfo(e);
                        }}
                        onScrollEndDrag={(e)=>{
                            this.setScroInfo(e);
                        }}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            this.contentSizeHeight = contentHeight;
                            this.offsetY = 0; //滑动距离
                            this.oriageScrollHeight = utils.SCREENHEIGHT - 100 * utils.SCREENRATE - 100 - 20* utils.SCREENRATE; //scrollView高度
                            let isTop1 = (this.offsetY <= 0);
                            let isBottom1 = (this.offsetY >= (this.contentSizeHeight - this.oriageScrollHeight));
                            if (this.state.isTop === null || isTop1 !== this.state.isTop) this.setState({ isTop: isTop1 });
                            if (this.state.isBottom === null || isBottom1 !== this.state.isBottom) this.setState({ isBottom: isBottom1 });
                        }}
                    >
                        {
                            this.getContent()
                        }
                    </ScrollView>
                    {
                        (this.state.isBottom !== true) ? <TouchableOpacity
                            style={{ flexDirection: "row", width: "100%", height: 30 * utils.SCREENRATE, alignItems: "center", justifyContent: "center" }}
                            onPress={() => {
                                let maxOffSet = this.contentSizeHeight - this.oriageScrollHeight;
                                if (this.contentSizeHeight !== undefined) {
                                    let showY = (this.offsetY + 45 * utils.SCREENRATE) <= maxOffSet ? (this.offsetY + 45 * utils.SCREENRATE) : maxOffSet;
                                    this._scroll.scrollTo({ y: showY });
                                } else {
                                    this._scroll.scrollToEnd();
                                }
                                if(maxOffSet<=this.offsetY){
                                    this.setState({ isBottom: true });
                                }
                            }}
                        >
                            <Text style={{ fontSize: 12 * utils.SCREENRATE, color: "gray" }}>{"滑动查看更多 ⇊"}</Text>
                        </TouchableOpacity> : <TouchableOpacity
                                style={{ flexDirection: "row", backgroundColor: "rgba(0,0,0,0)", width: "100%", height: 10 * utils.SCREENRATE, alignItems: "center", justifyContent: "center" }}
                        />
                    }
                </View>

                <AudioSoundConCom navigation={this.props.navigation} />

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const examContent = state.detail.examContent;
    const answers = state.detail.answers;
    const examPath = state.detail.currentExamPath;
    const answerRecord = state.detail.answerRecord;
    let isHaveContent = false;
    let topInfo = state.detail.topicInfo;
    let gropObj = state.detail.gropObj;
    let topObj = state.detail.topObj;
    if (topInfo) {
        isHaveContent = topInfo.currLevel === "topObj";
    }
    return {
        isHaveContent,
        topInfo,
        gropObj,
        examContent,
        topObj,
        examPath,
        answers,
        answerRecord
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoTest);

