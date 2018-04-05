import React,{Component} from "react";
import {StyleSheet, View, ScrollView,Text,TouchableOpacity,Image} from "react-native";
import utils from "../utils";
import NavBar from '../components/navBar';

import MySound from "../utils/soundPlay"
import {connect} from "react-redux";
import {getExamContent, savePlayTime} from "../store/actions";

import HearSelect from '../components/HearSelectCom';
import HearRecord from '../components/HearRecordCom';
import HearSelPic from '../components/HearSelPicCom';
import AudioSoundConCom from '../components/AudioSoundConCom'

import AnswerCom from '../components/answerCom';
import RNFS from "react-native-fs";
import {detail} from "../store/reducer";

let Sound1 = new MySound;



const styles=StyleSheet.create({
    contain: {
        display:'flex',
        width: '100%',
        flexDirection: 'column',
        height:utils.SCREENHEIGHT,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor:utils.COLORS.background1,
    },
    title:{
        color:utils.COLORS.theme1,
        fontSize:17,
        // textAlign:"auto",
        lineHeight: 25,
        marginBottom:10,
    },
    content:{
        marginTop:15,
        backgroundColor:"#ffffff",
        width:utils.SCREENWIDTH-30,
        height:utils.SCREENHEIGHT-200,
        padding:10,
        borderRadius:8,
    },
    contentScr:{
        // display:'flex',
    },
});

class VideoTest extends Component{

    constructor(props){
        super(props)
        this.getContent=this.getContent.bind(this);
        this.getComponent=this.getComponent.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.answers!==this.props.answers){
            let path=this.props.answerRecord.currPath+'/answer.json';
            RNFS.writeFile(path, JSON.stringify(nextProps.answers) , 'utf8').then(()=>{});
        }
    }

    getComponent(){
        if(this.props.isHaveContent){
            if(this.props.gropObj.Type===1) {//听后选择
                return <HearSelect contentData={this.props.topInfo.contentData}/>;
            } else if(this.props.gropObj.Type===2) {//听后回答
                return <Text style={styles.title}>{this.props.topInfo.contentData[0].Title}</Text>;
            }else if(this.props.gropObj.Type===3) {//听后记录
                return <HearRecord contentData={this.props.topInfo.contentData} examPath={this.props.examPath} type={this.props.gropObj.Type}/>;
            }else if(this.props.gropObj.Type===4) {//转述信息
                return <HearRecord contentData={this.props.topInfo.contentData} examPath={this.props.examPath} type={this.props.gropObj.Type}/>;
            }else if(this.props.gropObj.Type===5) {//短文朗读
                return <Text style={styles.title}>{this.props.topInfo.contentData[0].Title}</Text>;
            }else if(this.props.gropObj.Type===10) {//听后选图
                return <HearSelPic contentData={this.props.topInfo.contentData} examPath={this.props.examPath} imgList={this.props.gropObj.ImgList} />;
            }
        }
    }

    //如果不是读标题  内容展示区
    getContent(){
        if(this.props.topInfo.currLevel==="finished"){
            if(this.props.answers===undefined){
                return <Text>{"亲！ 您交了白卷。。。"}</Text>
            }
            return <AnswerCom answers={this.props.answers} />
        }else if(this.props.isHaveContent){
            return (
                <View  style={{padding:5}}>
                    <Text style={styles.title}>{this.props.topObj.Title}</Text>
                    <Text style={styles.title}>{this.props.topInfo.showTitle}</Text>
                    {
                        this.getComponent()
                    }
                </View>
            );
        }else {
            return <Text style={styles.title}>{this.props.topInfo.showTitle}</Text>
        }
    }


    render() {
        return(
            <View style={styles.contain}>

                <NavBar navtitle={this.props.examContent.SecTitle}  isBack={true} navgation={this.props.navigation}/>

                <View style={styles.content}>
                    <ScrollView >
                        {
                            this.getContent()
                        }
                    </ScrollView>
                </View>

                <AudioSoundConCom navigation={this.props.navigation}/>

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const examContent=state.detail.examContent;
    const answers=state.detail.answers;
    const examPath=state.detail.currentExamPath;
    const answerRecord=state.detail.answerRecord;
    let isHaveContent=false;
    let topInfo=state.detail.topicInfo;
    let gropObj=state.detail.gropObj;
    let topObj=state.detail.topObj;
    if (topInfo){
        isHaveContent=topInfo.currLevel==="topObj";
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

export default connect(mapStateToProps,mapDispatchToProps)(VideoTest);

