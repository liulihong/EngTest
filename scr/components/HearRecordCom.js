import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import utils from '../utils';
import { connect } from "react-redux";
import { saveCurrExamAnswers } from "../store/actions";

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

        if (this.props.answers !== undefined && this.props.answers['3'] !== undefined) {
            this.setState({
                answer: this.props.answers['3'][this.props.contentData[0].UniqueID].answer
            });
        } else {
            let n = this.props.contentData[0].ExampleAnswer.length;
            let arr = new Array(n).fill("");
            this.setState({
                answer: arr,
            });
        }
    }

    componentWillReceiveProps(nextProps) {

    }


    getShowUI() {
        if (this.props.type === 3) {
            let num = this.props.contentData[0].ID;
            return <View style={{ backgroundColor: "#ffffff", marginTop: 5 }}>
                {
                    this.props.contentData[0].ExampleAnswer.map((element, i) => {
                        let newNum = num + i;
                        return <TextInput
                            key={newNum + i}
                            underlineColorAndroid={'transparent'}
                            style={{ height: 40, width: '100%', borderRadius: 5, fontSize: 16, textAlign: 'center', backgroundColor: utils.COLORS.theme, marginTop: 10 }}
                            multiline={false}
                            placeholder={newNum + ''}
                            secureTextEntry={false}
                            onChangeText={(text) => {
                                let tempArr = [...this.state.answer];
                                tempArr.splice(i, 1, text)
                                this.setState({
                                    answer: tempArr
                                })
                                this.props.saveAnswer(3, this.props.contentData[0].UniqueID, this.props.contentData[0].ID, this.state.answer);
                            }}
                            value={this.state.answer[i]}
                        />
                    })
                }
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