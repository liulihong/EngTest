import React,{ Compnents, Component } from 'react';
import { Text ,
    StyleSheet ,
    View ,
    TouchableOpacity,
    ImageBackground,
    Image,
    ScrollView,
    DeviceEventEmitter,//引入监听事件
} from 'react-native';
import utils from '../utils'
import ProgressButton from "../components/progressButton"
import NavBar from '../components/navBar';
import {hostUrl} from "../request/requestUrl";
import {connect} from "react-redux";
import {getExamContent, setTestProgress, getTopicDetail, saveAnswerRecord, getAnswerBlow} from "../store/actions";
import FileManager from '../utils/FileManager';
import RNFS from 'react-native-fs';
import AnswerScreen from "./answerPage";

const  typeEnum = { 1:'听后选择', 2: '听后回答', 3: '听后记录', 4: '转述信息', 5: '短文朗读', 10:'听后选图' };

const styles=StyleSheet.create({
    contain: {
        display:'flex',
        width: '100%',
        flexDirection: 'column',
        height:utils.SCREENHEIGHT,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    progress:{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop:36,
        height:utils.SCREENHEIGHT-260,
    },
    whiteView:{
        backgroundColor:"white",
        width:"100%",
        height:160,
        position:"absolute",
        bottom:0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreText:{
        color:utils.COLORS.theme1,
        fontSize:16,
        margin:15,
        padding:10,
    },
    button: {
        height: 45,
        width: utils.SCREENWIDTH*670/750,
        borderRadius: 6,
        backgroundColor: utils.COLORS.theme,
        justifyContent: 'center',
        // marginTop: 10,
        // marginBottom:50,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },
    button2: {
        height: 45,
        width: '35%',
        borderRadius: 6,
        backgroundColor: utils.COLORS.theme,
        justifyContent: 'center',
        // marginTop: 25,
        margin:15,
        // marginBottom:50,
    }
});

class TestStart extends Component{

    constructor(props){

        super(props)

        this.getLastRecord=this.getLastRecord.bind(this);
        this.getWhiteView=this.getWhiteView.bind(this);
        this.startTest=this.startTest.bind(this);
        this.againTest=this.againTest.bind(this);
        this.continueTest=this.continueTest.bind(this);
        this.showBlowInfo=this.showBlowInfo.bind(this);
    }

    //组件加载完成
    componentDidMount () {
        this.getLastRecord();
        let jsonPath=this.props.path+'/exam.json';
        FileManager.readFile(jsonPath,(result)=>{
            this.props.getExamDetail(JSON.parse(result));
        });

        DeviceEventEmitter.addListener('ChangeUI',()=>{
            //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
            this.getLastRecord();
        });
    }

    //获取答题总记录
    getLastRecord(){
        let jsonPath=this.props.path+"/answer.json";
        RNFS.exists(jsonPath).then((isExit)=>{
            if(isExit===true){
                RNFS.readFile(jsonPath).then((result)=>{
                    let anserDic=JSON.parse(result);
                    this.props.saveAnswerInfo(anserDic);
                })
            }
        });
    }

    //开始考试
    startTest(){
        RNFS.mkdir(this.props.path+"/answer1").then(()=>{
            let anserDic={"version":1,"lastPath":null,"examPath":this.props.path,"currPath":this.props.path+"/answer1","finish":false};
            this.props.getTopicInfo(this.props.examContent);
            this.props.saveAnswerInfo(anserDic);
            this.props.navigation.navigate('VideoTest');
        })

    }

    //重新考试
    againTest(){
        let anserDic=this.props.answerRecord;
        let version=anserDic.version+1;
        let lastPath=anserDic.currPath;
        let examPath=anserDic.examPath;
        let currPath=this.props.path+'/answer'+version;
        let finish=false;
        RNFS.mkdir(currPath).then(()=>{
            this.props.getTopicInfo(this.props.examContent);
            this.props.saveAnswerInfo({version,lastPath,examPath,currPath,finish});
            this.props.navigation.navigate('VideoTest');
            RNFS.unlink(anserDic.lastPath);
        })
    }

    //继续考试
    continueTest(){
        let anserDic=this.props.answerRecord;
        let jsonPath=anserDic.currPath+"/answer.json";
        RNFS.exists(jsonPath).then((isExit)=>{
            if(isExit===true){
                RNFS.readFile(jsonPath).then((result)=>{
                    let answerRecord=JSON.parse(result);
                    this.props.saveAnswerRecord(answerRecord);//获取之前答题记录

                    this.props.getTestProgress(anserDic);
                    this.props.navigation.navigate('VideoTest');
                })
            }else {
                this.props.getTestProgress(anserDic);
                this.props.navigation.navigate('VideoTest');
            }
        })

    }

    //显示上次答题
    showBlowInfo(){
        let anserDic=this.props.answerRecord;
        let jsonPath=anserDic.currPath+"/answer.json";
        RNFS.exists(jsonPath).then((isExit)=>{
            if(isExit===true){
                RNFS.readFile(jsonPath).then((result)=>{
                    let answerRecord=JSON.parse(result);
                    this.props.saveAnswerRecord(answerRecord);//获取之前答题记录

                    this.props.navigation.navigate('AnswerScreen');
                })
            }else {
                alert("亲，您上次交了白卷哦！")
            }
        })
    }

    getWhiteView(){
        let anserDic=this.props.answerRecord;

        if(anserDic===undefined){//为开始考试 考试标题
            return <View style={styles.whiteView}>
                <Text style={styles.scoreText}>{this.props.examContent&&this.props.examContent.PriTitle}</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.startTest}
                >
                    <Text style={styles.buttonText}>开始考试</Text>
                </TouchableOpacity>
            </View>
        }else if(anserDic.finish===true){//当前考试已完成  显示 重新考试 查看最近成绩
            return <View style={styles.whiteView}>

                <TouchableOpacity onPress={()=>{this.showBlowInfo()}}>
                    <Text style={styles.scoreText}>{"查看上次成绩 > "}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.againTest}
                >
                    <Text style={styles.buttonText}>重新考试</Text>
                </TouchableOpacity>
            </View>
        }else{//考试考一半  显示  继续考试 重新考试
            return <View style={styles.whiteView}>
                <TouchableOpacity
                    style={styles.button2}
                    onPress={this.againTest}
                >
                    <Text style={styles.buttonText}>重新考试</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button2}
                    onPress={this.continueTest}
                >
                    <Text style={styles.buttonText}>继续考试</Text>
                </TouchableOpacity>
            </View>
        }
    }

    componentWillReceiveProps(nextProps) {

    }


    render() {
        let answerRecord=this.props.answerRecord;
        let selectType=this.props.examContent ? this.props.examContent.Groups[0].Type : 0;
        if(answerRecord!==undefined && answerRecord.finish===false && answerRecord.gropObj!==undefined && answerRecord.gropObj!==null){
            selectType=answerRecord.gropObj.Type;
        }
        return(

            <ImageBackground
                source={require("../imgs/testIcon/cj_bg.png")}
                style={styles.contain}
            >

                <NavBar navtitle={this.props.examContent?this.props.examContent.SecTitle:''}  isBack={true} navgation={this.props.navigation}/>



                <View style={styles.progress}>
                    <ScrollView>
                        {
                            this.props.examContent&&this.props.examContent.Groups.map((element,i) => {
                                const isSelect=element.Type===selectType;
                                const num=i+1;
                                const title=typeEnum[element.Type];
                                return  <ProgressButton key={element.Type} isSelect={isSelect} num={num} title={title}/>
                            })
                        }
                    </ScrollView>
                </View>

                {
                    this.getWhiteView()
                }


            </ImageBackground>
        );
    }
}




const mapStateToProps = (state) => {
    const path=state.detail.currentExamPath;
    const examContent=state.detail.examContent;
    let answerRecord=state.detail.answerRecord;
    return {
        path,
        examContent,
        answerRecord
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getExamDetail: (result) => {
            dispatch(getExamContent(result));
        },
        getTopicInfo: (detail) => {
            dispatch(getTopicDetail(detail));
        },
        saveAnswerInfo: ( answerDic ) =>{
            dispatch(saveAnswerRecord(answerDic));
        },
        getTestProgress:(data)=>{
            dispatch(setTestProgress(data));
        },
        saveAnswerRecord:(answerRecord)=>{
            dispatch(getAnswerBlow(answerRecord));
        }
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(TestStart);