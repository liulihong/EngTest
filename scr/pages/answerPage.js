import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Button, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { downFaild, GetCommon, getMovieList, saveDownUrl, startDown } from "../store/actions";
import { connect } from "react-redux";
import AnswerCom from '../components/answerCom';
import NavBar from '../components/navBar';
import { getExamLog } from "../request/requestUrl";
import { fetchPost } from "../request/fetch";
import ProgressButton from "../components/progressButton";
import utils from '../utils';

const typeEnum = { 1: '听后选择', 2: '听后回答', 3: '听后记录', 4: '转述信息', 5: '短文朗读', 10: '听后选图' };
class AnswerScreen extends Component {

    constructor(props) {
        super(props);
        this.getExamAnserInfo = this.getExamAnserInfo.bind(this);

        this.state={
            serverAnswer:{},
            resetAnswer:{},
        }

        this.getExamAnserInfo();
    }

    getExamAnserInfo() {
        let LogID = this.props.answerRecord.LogID;
        fetchPost(getExamLog, { ...LogID }).then((result) => {
            let tempObj={};
            for(let i=0;i<result.LogList.length;i++){
                ansObj=result.LogList[i];
                if(tempObj[ansObj.Type]===undefined)
                    tempObj[ansObj.Type]={
                        totalScore:0,
                        LogList:[],
                    }
                tempObj[ansObj.Type].totalScore+=ansObj.Score;
                tempObj[ansObj.Type].LogList.push(ansObj);
            }
            this.setState({
                serverAnswer:result,
                resetAnswer:tempObj,
            });
            console.log(tempObj);
        }, (error) => {
            alert("11" + utils.findErrorInfo(error));
        })
    }


    render() {
        if (this.props.answers === undefined) {
            return <Text>{"亲！ 您交了白卷。。。"}</Text>
        }
        let scoreTxt="得分\n"+ ((this.state.serverAnswer!=={}) ? this.state.serverAnswer.Score : 0.00 ) +"分";
        return <ImageBackground
            source={require("../imgs/testIcon/cj_bg.png")}
            style={styles.contain}
        >
            <NavBar navtitle={this.props.examContent ? this.props.examContent.SecTitle : ''} isBack={true} navgation={this.props.navigation} />
            <ScrollView>
                {/* <AnswerCom answers={this.props.answers} /> */}

                <ImageBackground
                    style={styles.totalScore}
                    source={require("../imgs/aswerIcon/cjzh_icon.png")}>
                    <Text style={styles.scoreTxt}>{scoreTxt}</Text>
                </ImageBackground>

                {
                    this.props.examContent && this.props.examContent.Groups.map((element, i) => {
                        const isSelect = true;
                        const num = i + 1;
                        const title = typeEnum[element.Type];
                        const totalScore=(this.state.resetAnswer[element.Type]!==undefined) ? this.state.resetAnswer[element.Type].totalScore : 0;
                        const sResetAnswer=(this.state.resetAnswer[element.Type]!==undefined) ? this.state.resetAnswer[element.Type] : {};
                        // alert(JSON.stringify(sResetAnswer));
                        let newTitle= "   " + title + " ( " + totalScore + " / " + element.TotalScore +" )";
                        let examPath=this.props.currentExamPath;
                        return (
                            <TouchableOpacity key={element.Type} onPress={() => {
                                this.props.navigation.navigate("AnsweredDetail", { localAnswer: this.props.answers, serverAnswer:sResetAnswer , title , content: element ,examPath });
                            }} >
                                <ProgressButton isSelect={isSelect} num={num} title={newTitle} />
                            </TouchableOpacity>

                        )
                    })
                }

                {/* <TouchableOpacity style={{ padding: 20 }} onPress={() => {
                    this.props.navigation.navigate("AnsweredDetail", { answers: this.props.answers });
                }} >
                    <Text>{"听后选择"}</Text>
                </TouchableOpacity> */}
            </ScrollView>
        </ImageBackground>
    }

}

const mapStateToProps = (state) => {
    const answerRecord = state.detail.answerRecord;
    const answers = state.detail.answers;
    const examContent = state.detail.examContent;
    const currentExamPath=state.detail.currentExamPath;
    return {
        answers,
        answerRecord,
        examContent,
        currentExamPath,
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

export default connect(mapStateToProps, mapDispatchToProps)(AnswerScreen);


const styles = StyleSheet.create({
    contain: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: utils.SCREENHEIGHT,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    totalScore: {
        width: 130,
        height: 130,
        paddingTop:30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: "center",
        marginTop:20,
        marginBottom:30,
    },
    scoreTxt: {
        color:"#ffffff",
        fontSize:18,
        fontWeight:"600",
        textAlign:"center",
    },

});
