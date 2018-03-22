import React,{ Component } from 'react';
import { ScrollView , StyleSheet ,View ,Button,TouchableOpacity,Text} from 'react-native';
import {downFaild, GetCommon, getMovieList, saveDownUrl, startDown} from "../store/actions";
import {connect} from "react-redux";
import AnswerCom from '../components/answerCom';
import NavBar from '../components/navBar';


class AnswerScreen extends Component{

    constructor(props){
        super(props);

    }

    render(){
        if(this.props.answers===undefined){
            return <Text>{"亲！ 您交了白卷。。。"}</Text>
        }
        return <View>
            <NavBar navtitle={"测试结果"}  isBack={true} navgation={this.props.navigation}/>
            <ScrollView>
                <AnswerCom answers={this.props.answers} />
            </ScrollView>
        </View>
    }

}

const mapStateToProps = (state) => {
    const answers=state.detail.answers;
    return {
        answers,
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

export default connect(mapStateToProps,mapDispatchToProps)(AnswerScreen);