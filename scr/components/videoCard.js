import React,{Component} from 'react';
import {View,Text,Button,StyleSheet,ImageBackground,TouchableOpacity} from 'react-native';
import utils from '../utils';
import download from '../utils/download';
import { hostUrl } from '../request/requestUrl';
import {downFaild, startDown, saveDownUrl,saveExamPath} from "../store/actions";
import {connect} from "react-redux";

class VideoCard extends Component{



    constructor(props){
        super(props);
        this.downLoad=this.downLoad.bind(this);
        this.cardClick=this.cardClick.bind(this);
        this.state={
            clickCardID:"",
        }
    }

    downLoad(){

        const {DownPath: path, ID: docName} = this.props.cardDic;

        if(this.state.clickCardID===docName)//如果已经点击过下载就返回
            return;
        //加入下载列表
        this.setState({
            clickCardID:docName
        });
        let url=hostUrl+"/"+path;
        download(url, docName,(obj)=>{
            if(obj.status==="start"){
                this.props.startDown();

            }else if(obj.status==="faild"){
                alert(this.props.cardDic.SecTitle + "下载失败！");
                this.props.downFaild();
                this.setState({
                    clickCardID:""
                });
            }else if(obj.status==="success"){
                this.props.saveUrl(obj);
                this.setState({
                    clickCardID:""
                });
            }
        }).download();
    }

    cardClick(){
        if(this.props.isDown){
            let url=utils.DOWNLOADDOCUMENTPATH+"/"+this.props.cardDic.ID;
            this.props.savePath(url);

            this.props.navigation.navigate('TestStart',{ID:this.props.cardDic.ID});
        }else {
            alert("请下载试题包");
        }
    }

    componentWillReceiveProps(nextProps) {

    }


    render(){
        let BackImg=this.props.isDown?require("../imgs/testIcon/ks_sj_bg.png"):require("../imgs/testIcon/ks_s_bg_ls.png");
        let scoreRecord=this.props.isDown?"上次成绩:25":"未下载";
        return(
            <TouchableOpacity style={styles1.contain1} onPress={() => this.cardClick()}>
                <ImageBackground style={styles1.backImg} source={BackImg} >
                    <Text style={styles1.scoreText}>{scoreRecord}</Text>
                    <Text style={styles1.titleText}>{this.props.cardDic.SecTitle}</Text>
                    {
                        (this.props.isDown===undefined || this.props.isDown===false)?<TouchableOpacity
                            style={styles1.button}
                            onPress={() => this.downLoad()}
                        >
                            {
                                (this.state.clickCardID===this.props.cardDic.ID) ? <Text style={styles1.loading}>Downloading...</Text> : <ImageBackground style={styles1.xzImg} source={require("../imgs/testIcon/ks_xz_icon.png")}/>
                            }
                        </TouchableOpacity>:<View style={styles1.button} />
                    }
                </ImageBackground>
            </TouchableOpacity>

        )
    }
}

const styles1=StyleSheet.create({
    contain1:{
        // flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"red",
        width: utils.SCREENWIDTH*0.3,
        height:utils.SCREENWIDTH*0.3/22*25,
        margin:utils.SCREENWIDTH*0.01,
        borderRadius: 5,
    },
    backImg:{
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height:'100%',
        // margin:utils.SCREENWIDTH*0.01,
        // borderRadius: 3,
    },
    scoreText:{
        marginTop:10,
        color:'white',
        // fontWeight:"800",
        fontSize:12,
    },
    titleText:{
        marginTop:10,
        color:'white',
        fontWeight:"700",
        fontSize:15,
    },
    button:{
        marginTop:10,
        // backgroundColor:"red",
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width:"100%",
        height:"40%",
    },
    xzImg:{
        marginRight:15,
        width:24,
        height:24,
    },
    loading:{
        fontSize:12,
        color:"white",
        marginRight:15,
    }
});

const mapStateToProps = (state) => {
    const downLoading=state.videoList.downLoading;
    return {
        downLoading,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveUrl: (obj) => {
            dispatch(saveDownUrl(obj))
        },
        startDown: () => {
            dispatch(startDown({}))
        },
        downFaild: () => {
            dispatch(downFaild({}))
        },
        savePath: (obj) =>{
            dispatch(saveExamPath(obj));
        }
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(VideoCard);