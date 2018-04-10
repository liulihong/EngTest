import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Platform, Keyboard } from 'react-native';
import utils from '../utils';
import { connect } from "react-redux";
import { saveCurrExamAnswers } from "../store/actions";
import copy from 'lodash';


//听后选择
class HearRecord extends Component {
    constructor(props) {
        super(props)
        // this.selectBtn=this.selectBtn.bind(this);
        this.getShowUI = this.getShowUI.bind(this);
        this.state = {
            answer: [],
            width: utils.SCREENWIDTH * 0.835,
            height: utils.SCREENWIDTH * 0.835,
        }
    }

    componentDidMount() {
        let path = utils.findPicturePath(this.props.contentData[0].Img, this.props.examPath);
        Image.getSize(path, (width, height1) => {
            let newheight = this.state.width / width * height1; //按照屏幕宽度进行等比缩放
            this.setState({ height: newheight });
        })


        if (this.props.answers !== undefined && this.props.answers[3] !== undefined) {
            let currAnswer = this.props.answers[3];
            let unitID = this.props.contentData[0].UniqueID;
            let answer = currAnswer[unitID].answer;
            // ["answer"];
            // debugger
            this.setState({
                answer: answer,
            });
        } else {
            let n = this.props.contentData[0].ExampleAnswer.length;
            let arr = new Array(n).fill("");
            this.setState({
                answer: arr,
            });
        }

        if (this.props.type === 3) {
            this.keyboardShow = Platform.OS === 'ios' ?
                Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace.bind(this)) : Keyboard.addListener('keyboardDidShow', this.updateKeyboardSpace.bind(this));
            this.keyboardHide = Platform.OS === 'ios' ?
                Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace.bind(this)) : Keyboard.addListener('keyboardDidHide', this.resetKeyboardSpace.bind(this));
        }
    }

    updateKeyboardSpace(frames) {
        // if (!frames.endCoordinates) {
        //     return;
        // }
        // let keyboardSpace = frames.endCoordinates.height;//获取键盘高度

        // this.setState({
        //     keyboardSpace: keyboardSpace
        // })
    }

    resetKeyboardSpace() {
        // this.setState({
        //     keyboardSpace: 10
        // })
    }

    componentWillReceiveProps(nextProps) {

    }


    getShowUI() {
        if (this.props.type === 3) {
            let num = this.props.contentData[0].ID;
            return <View>
                <View style={{ backgroundColor: "#ffffff", marginTop: 5 }}>
                    {
                        this.props.contentData[0].ExampleAnswer.map((element, i) => {
                            let newNum = num + i;
                            return <TextInput
                                key={newNum + i}
                                underlineColorAndroid={'transparent'}
                                style={{ height: 40, width: "70%", borderRadius: 5, fontSize: 16, textAlign: 'center',borderColor:utils.COLORS.theme,borderWidth:1, backgroundColor:"rgba(18,183,247,.5)", marginTop: 10 }}
                                multiline={false}
                                placeholder={newNum + ''}
                                secureTextEntry={false}
                                onChangeText={(text) => {
                                    let tempArr = copy.cloneDeep(this.state.answer);
                                    tempArr.splice(i, 1, text)
                                    this.setState({
                                        answer: tempArr
                                    },()=>{
                                        this.props.saveAnswer(3, this.props.contentData[0].UniqueID, this.props.contentData[0].ID, this.state.answer);
                                    })
                                }}
                                value={this.state.answer[i]}
                            />
                        })
                    }
                </View>
                {/* //其他元素  */}
                {/* <KeyboardSpacer keyboardSpace={this.state.keyboardSpace} /> */}
                <View style={{ height: 166 }}></View>
            </View>
        } else if (this.props.type === 4) {
            return <Text style={{ fontSize: 16, marginTop: 10, marginBottom: 10, padding: 10, backgroundColor: "#ffffff" }}>{this.props.contentData[0].Title}</Text>
        }
    }

    render() {

        let path = utils.findPicturePath(this.props.contentData[0].Img, this.props.examPath);

        return (
            <View>
                <Image source={{ uri: path }}
                    style={{
                        width: this.state.width,
                        height: this.state.height,
                        marginTop: 10
                    }} />
                {
                    this.getShowUI()
                }
            </View>


        );
    }
}


const mapStateToProps = (state) => {
    let answers = state.detail.answers;
    return {
        answers
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveAnswer: (Type, id, num, answer) => {
            dispatch(saveCurrExamAnswers(Type, id, num, answer));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(HearRecord);