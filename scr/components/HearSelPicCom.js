import React, { Component } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Image,ImageBackground} from 'react-native';
import utils from '../utils';
import {connect} from "react-redux";
import {saveCurrExamAnswers} from '../store/actions'

//听后选择
class HearSelPicCom extends Component{
    constructor (props) {
        super (props)
        this.selectBtn=this.selectBtn.bind(this);
        this.state={
            selects:{},
            imgSizes:{},
        }
    }

    componentDidMount() {
        this.props.imgList.map((spath,i) => {
            let path=utils.findPicturePath(spath,this.props.examPath);
            Image.getSize(path,(width,height1)=>{
                let newheight = 100 / width * height1 ; //按照屏幕宽度进行等比缩放
                this.setState({
                    imgSizes:{
                        ...this.state.imgSizes,
                        [spath]:newheight
                    }
                });
            })
        })

        if(this.props.answers!==undefined && this.props.answers['10']!==undefined){
            this.setState({
                selects:this.props.answers['10']
            });
        }
    }

    selectBtn( id , num , answer ){  //这个是作甚的 点击选项啊 选择题  选项 点A 就选中A
        this.setState(
            {
                selects:{
                    ...this.state.selects,
                    [ id ] : {
                        num,
                        answer,
                    },
                }
            },
        );
        this.props.saveAnswer(10,id,num,answer);
    }

    render(){ return (
        this.props.contentData.map(element => {
            return <View style={styles.contain} key={element.ID}>

                <View style={styles.titleView}><Text style={styles.title}>{element.Title}</Text></View>
                <View style={styles.selectView}>
                    {
                        this.props.imgList.map((spath,i) => {
                            let isSelect=this.state.selects && this.state.selects[element.UniqueID]!==undefined && (this.state.selects[element.UniqueID]["answer"]===(i+1));
                            let source=isSelect?require("../imgs/testIcon/zc_icon_click.png"):require("../imgs/testIcon/zc_icon_mr.png");
                            let path=utils.findPicturePath(spath,this.props.examPath);
                            return <TouchableOpacity key={i} style={styles.selectItem} onPress={()=>this.selectBtn(element.UniqueID,element.ID,(i+1))}>
                                <Image style={styles.img} source={source}/>
                                <ImageBackground
                                    style={{width:100, margin:6, height:this.state.imgSizes[spath] || 100 }}
                                    source={{uri:path}} />
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

export default connect(mapStateToProps,mapDispatchToProps)(HearSelPicCom);


const styles=StyleSheet.create({
    contain:{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor: "#eeeeee",
        width:"100%",
        height:'auto',
        marginTop:10,
        marginBottom:10,
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
        fontSize:16,
        textAlign:"left",
    },
    selectView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
    },
    selectItem:{
        margin:5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width:'46%',
        borderWidth:1,
        borderColor:utils.COLORS.theme1,
        // backgroundColor:"#eeeeee",
        // padding:5,
    },
    img:{
        width:20,
        height:20,
        margin:2,
    },
    text:{
        color:utils.COLORS.theme1,
        fontSize:14,
        width:'95%',
        paddingLeft:8,
    }
});