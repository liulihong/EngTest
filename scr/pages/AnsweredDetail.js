import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import utils from '../utils';
import NavBar from '../components/navBar';
// import AnswerCom from '../components/answerCom';
import AnswerType1 from "../components/answeredType1";
import AnswerType2 from "../components/answeredType2";
import { connect } from "react-redux";


class AnsweredDetail extends Component {
    constructor() {
        super();

    }



    render() {

        let groupObj = this.props.navigation.state.params.content;
        let title=this.props.navigation.state.params.title;
        let localAnswer=this.props.navigation.state.params.localAnswer[groupObj.Type];
        let serverAnswer=this.props.navigation.state.params.serverAnswer;
        return (
            <View style={styles.contain}>
                <NavBar navtitle={title} isBack={true} navgation={this.props.navigation} />
                <View style={styles.content}>
                    <ScrollView style={styles.scrStyle}>
                        {
                            groupObj.Type === 10 ? <Text>{"听后选图"}</Text> :
                            groupObj.Type === 1 ? <AnswerType1 groupObj={groupObj} localAnswer={localAnswer} serverAnswer={serverAnswer} /> :
                            groupObj.Type === 2 ? <AnswerType2 groupObj={groupObj} localAnswer={localAnswer} serverAnswer={serverAnswer} /> :
                            groupObj.Type === 3 ? <Text>{"听后记录"}</Text> :
                            groupObj.Type === 4 ? <Text>{"听后转述"}</Text> : <Text>{"短文朗读"}</Text>
                        }
                        
                        {/* <AnswerCom answers={this.props.navigation.state.params.answers} /> */}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const examContent = state.detail.examContent;

    return {
        examContent,

    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AnsweredDetail);

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
    },
    scrStyle: {
        padding: 2,
    },
});

