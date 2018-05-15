import React, { Component } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Image} from 'react-native';
import utils from '../utils';
import {connect} from "react-redux";
import {saveCurrExamAnswers} from '../store/actions'

//听后选择
class HearSelect extends Component{
    constructor (props) {
        super (props)
        this.selectBtn=this.selectBtn.bind(this);
        this.state={
            selects:{},
        }
    }

    componentDidMount() {
        if(this.props.answers!==undefined && this.props.answers['1']!==undefined){
            this.setState({
                selects:this.props.answers['1']
            });
        }
    }

    selectBtn( id , num , answer ){
        this.setState(
            {
                selects:{
                    ...this.state.selects,
                    [ id ] : {
                        answer,
                        num
                    },
                }
            }
        );
        this.props.saveAnswer(1, id, num, answer );
    }

    render(){ return (
        this.props.contentData.map(element => {
             return <View style={styles.contain} key={element.ID}>

                <View style={styles.titleView}><Text style={styles.title}>{element.Title}</Text></View>
                <View style={styles.selectView}>
                    {
                        element.Answers.map((answerObj,i) => {
                            let isSelect=this.state.selects && this.state.selects[element.UniqueID] && (this.state.selects[element.UniqueID]["answer"]===(i+1));
                            let source=isSelect?require("../imgs/testIcon/zc_icon_click.png"):require("../imgs/testIcon/zc_icon_mr.png");
                            return <TouchableOpacity key={answerObj} style={styles.selectItem} onPress={()=>this.selectBtn(element.UniqueID,element.ID,(i+1))}>
                                <Image style={styles.img} source={source}/>
                                <Text style={styles.text}>{answerObj}</Text>
                            </TouchableOpacity>
                        })
                    }
                </View>
            </View>
        })
    );}
}

const mapStateToProps = (state) => {
    let answers=state.detail.answers;
    return {
        answers
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveAnswer:( Type, id , num , answer )=>{
            dispatch(saveCurrExamAnswers( Type, id , num , answer ));
        }
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(HearSelect);


const styles=StyleSheet.create({
    contain:{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor: "#eeeeee",
        width:"100%",
        height:'auto',
        marginTop:10*utils.SCREENRATE,
        marginBottom:10*utils.SCREENRATE,
        // borderWidth:0.7,
        // borderColor:utils.COLORS.background1
    },
    titleView:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
    },
    title:{
        color:utils.COLORS.theme1,
        fontSize:16*utils.SCREENRATE,
        textAlign:"left",
    },
    selectView:{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
    },
    selectItem:{
        marginTop:3*utils.SCREENRATE,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor:"red",
        paddingTop:5*utils.SCREENRATE,
        paddingBottom:5*utils.SCREENRATE,
    },
    img:{
        // width:"5%",
        // height:"5%",
    },
    text:{
        color:utils.COLORS.theme1,
        fontSize:15*utils.SCREENRATE,
        width:'95%',
        paddingLeft:8*utils.SCREENRATE,
    }
});