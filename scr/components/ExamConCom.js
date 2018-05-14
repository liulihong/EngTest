import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, DeviceEventEmitter, Alert, Platform, BackHandler } from 'react-native';
import utils from '../utils';
import { connect } from "react-redux";
import {
    savePlayTime, getNextTopicDetail, getNextGroup, setReportingTip, commintCurrExam, saveCurrExamAnswers,
    saveAnswerRecord
} from "../store/actions";
import MySound from "../utils/soundPlay";
import { fetchPost } from '../request/fetch';
import { submitExamTopic, endExam } from '../request/requestUrl';
import copy from 'lodash';
import RNFS from 'react-native-fs';
import SubmitAnswer from "../utils/submitAnswer"


let Sound1 = new MySound;
const downloadDest = utils.DOWNLOADDOCUMENTPATH;
const audioPath = (utils.PLATNAME === "IOS") ? (downloadDest + '/test.wav') : (downloadDest + '/test');
let Audio1;
Audio1 = require("../utils/audioPlay");

//加载播放控制按钮 下一步、下一题、交卷
const ConBtn = ({ clickNextStep, clickNextSubject, commitExam, isLast }) => (
    <View style={styles.conBtnView}>
        <TouchableOpacity style={styles.conBtn1}
            onPress={() => utils.callOnceInInterval(clickNextStep)}>
            <Text style={styles.conBtnText}>下一步</Text>
        </TouchableOpacity>
        {
            isLast === true ? null :
                <TouchableOpacity style={styles.conBtn1}
                    onPress={() => utils.callOnceInInterval(clickNextSubject)}>
                    <Text style={styles.conBtnText}>下一题</Text>
                </TouchableOpacity>
        }
        <TouchableOpacity style={styles.conBtn2} onPress={() => utils.callOnceInInterval(commitExam)}>
            <Text style={styles.conBtnText}>交卷</Text>
        </TouchableOpacity>
    </View>
);

class AudioSoundConCom extends Component {
    constructor(props) {
        super(props)
        this.pause = this.pause.bind(this);
        this.continue = this.continue.bind(this);
        this.conBtnClick = this.conBtnClick.bind(this);
        this.getBtnPic = this.getBtnPic.bind(this);

        this.state = {}
    }

    componentWillReceiveProps(nexPros) {

    }

    //组件加载完成
    componentDidMount() {
        Audio1.getPermission(audioPath);//检查录音权限
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    onBackAndroid = () => {
        this.props.paperCon.stepCon.end(true);
        this.props.paperCon=null;
    };

    //组件卸载 播放停止
    componentWillUnmount() {
        this.onBackAndroid();
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    //暂停
    pause() {
        this.setState({ isPaused: true });
        this.props.paperCon.stepCon.pause();
    }

    //继续
    continue() {
        this.setState({ isPaused: false });
        this.props.paperCon.stepCon.continue();
    }

    // 播放、暂停、停止录音点击事件
    conBtnClick() {

        if (this.props.isRecording) this.props.paperCon.clickNextStep();
        else if (this.state.isPaused) this.continue();
        else this.pause();
    }
    //播放、暂停、停止录音图片路径
    getBtnPic() {
        if (this.props.isRecording) return require('../imgs/testIcon/ks_tz_icon.png');
        else if (this.state.isPaused) return require('../imgs/testIcon/ks_zt_icon.png');
        else return require('../imgs/testIcon/ks_bf_icon.png');
    }

    render() {
        return (
            <View style={styles.audio}>

                <TouchableOpacity style={styles.button} onPress={() => utils.callOnceInInterval(this.conBtnClick)}>
                    <Image
                        style={{ width: '100%', height: '100%' }}
                        source={this.getBtnPic()}
                    />
                </TouchableOpacity>

                <Text style={{ marginLeft: 10 * utils.SCREENRATE, fontSize: 15 * utils.SCREENRATE }}>
                    {(this.props.progressInfo&&this.props.progressInfo.info)?this.props.progressInfo.info:""}
                </Text>

                <ConBtn
                    clickNextStep={() => {
                        this.setState({ isPaused: false });
                        this.props.paperCon.clickNextStep();
                    }}
                    isLast={this.props.dataSource.isLast}
                    clickNextSubject={() => {
                        this.setState({ isPaused: false });
                        this.props.paperCon.clickNextSubject();
                    }}
                    commitExam={() => {
                        Alert.alert('提示', '确定交卷？',
                            [
                                { text: "取消", onPress: () => { } },
                                {
                                    text: "确定", onPress: () => {
                                        this.props.paperCon.clickSubmit();
                                    }
                                },
                            ]
                        );
                    }}
                />

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    // 那个里面有所有数据   就是 长度
    let dataSource = state.detail;
    let examPath = dataSource.currentExamPath;
    let answerRecord = dataSource.answerRecord;
    let answers = dataSource.answers;
    
    return {
        dataSource,
        examPath,
        answerRecord,
        answers,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioSoundConCom);


const styles = StyleSheet.create({
    audio: {
        width: utils.SCREENWIDTH - 30 * utils.SCREENRATE,
        height: 100 * utils.SCREENRATE,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        alignItems: 'center',
        // position: "absolute",
        // bottom: utils.PLATNAME === "IOS" ? 10 * utils.SCREENRATE : 30 * utils.SCREENRATE,
    },
    button: {
        width: 70 * utils.SCREENRATE,
        height: 70 * utils.SCREENRATE,
        borderRadius: 35 * utils.SCREENRATE,
        borderColor: "#cccccc",
        borderWidth: 2,
        backgroundColor : "white",

    },
    conBtnView: {
        position: "absolute",
        right: 0,
        width: 100 * utils.SCREENRATE,
        height: '100%',
    },
    conBtn1: {
        width: '100%',
        height: 30 * utils.SCREENRATE,
        backgroundColor: utils.COLORS.theme,
        marginTop: 6 * utils.SCREENRATE,
        borderRadius: 3 * utils.SCREENRATE,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    conBtn2: {
        width: '100%',
        height: 30 * utils.SCREENRATE,
        backgroundColor: '#ff6169',
        borderRadius: 3 * utils.SCREENRATE,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6 * utils.SCREENRATE,
    },
    conBtnText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15 * utils.SCREENRATE,
        fontWeight: '600',
    }
});