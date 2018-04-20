import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import utils from '../utils';
import NavBar from '../components/navBar';
// import AnswerCom from '../components/answerCom';
import AnswerType10 from "../components/answeredType10";
import AnswerType1 from "../components/answeredType1";
import AnswerType2 from "../components/answeredType2";
import AnswerType3 from "../components/answeredType3";
import AnswerType4 from "../components/answeredType4";
import AnswerType5 from "../components/answeredType5";
import { connect } from "react-redux";


export default class AnsweredDetail extends Component {
    constructor() {
        super();

    }



    render() {

        let groupObj = this.props.navigation.state.params.content;
        let title=this.props.navigation.state.params.title;
        let localAnswer=this.props.navigation.state.params.localAnswer[groupObj.Type];
        let serverAnswer=this.props.navigation.state.params.serverAnswer;
        let examPath =this.props.navigation.state.params.examPath;
        let totalScore =this.props.navigation.state.params.totalScore;
        return (
            <View style={styles.contain}>
                <NavBar navtitle={title} isBack={true} navgation={this.props.navigation} />
                <View style={styles.content}>
                    <ScrollView style={styles.scrStyle}>
                        {
                            groupObj.Type === 10 ? <AnswerType10 groupObj={groupObj} localAnswer={localAnswer} serverAnswer={serverAnswer} examPath={examPath} totalScore={totalScore} /> :
                            groupObj.Type === 1 ? <AnswerType1 groupObj={groupObj} localAnswer={localAnswer} serverAnswer={serverAnswer} examPath={examPath} totalScore={totalScore} /> :
                            groupObj.Type === 2 ? <AnswerType2 groupObj={groupObj} localAnswer={localAnswer} serverAnswer={serverAnswer} examPath={examPath} totalScore={totalScore} /> :
                            groupObj.Type === 3 ? <AnswerType3 groupObj={groupObj} localAnswer={localAnswer} serverAnswer={serverAnswer} examPath={examPath} totalScore={totalScore} /> :
                            groupObj.Type === 4 ? <AnswerType4 groupObj={groupObj} localAnswer={localAnswer} serverAnswer={serverAnswer} examPath={examPath} totalScore={totalScore} /> : 
                            groupObj.Type === 5 ? <AnswerType5 groupObj={groupObj} localAnswer={localAnswer} serverAnswer={serverAnswer} examPath={examPath} totalScore={totalScore} /> :
                             <Text>{"未定义类型"}</Text>
                        }
                        
                        {/* <AnswerCom answers={this.props.navigation.state.params.answers} /> */}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

// const mapStateToProps = (state) => {
//     const examContent = state.detail.examContent;

//     return {
//         examContent,

//     };
// };
// const mapDispatchToProps = (dispatch, ownProps) => {
//     return {

//     }
// };

// export default connect(mapStateToProps, mapDispatchToProps)(AnsweredDetail);

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
    content: {
        marginTop: 15,
        backgroundColor: "#ffffff",
        width: utils.SCREENWIDTH - 30,
        height: utils.SCREENHEIGHT - 100,
        padding: 2,
        borderRadius: 8,
        marginBottom:20,
    },
    scrStyle: {
        padding: 2,
    },
});

