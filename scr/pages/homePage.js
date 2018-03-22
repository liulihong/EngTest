import React,{ Compnents, Component } from 'react';
import { ScrollView , StyleSheet ,View ,Button,TouchableOpacity,Text} from 'react-native';
import { StackNavigator } from 'react-navigation';
import VideoCard from '../components/videoCard';
import utils from '../utils'
import NavBar from '../components/navBar';
import {connect} from "react-redux";
import {downFaild, GetCommon, getMovieList, saveDownUrl, startDown} from "../store/actions";
import download from "../utils/download";
import {hostUrl} from "../request/requestUrl";


class HomeScreen extends Component{

    constructor(props){
        super(props);
        //获取试题列表
        this.props.GetPaperList();
        //获取下载共用音频URL
        this.props.getCommon();
        //开始下载
        this.state={
            isLoading : false,
        }
    }

    // array1=[];  array1是甚  列表数据源
    componentWillReceiveProps(nextProps) {
        if(nextProps.videoData.getCommenUrl){
            let isDown=false;
            if(nextProps.videoData.downedUrls && nextProps.videoData.downedUrls.length>0){
                isDown=nextProps.videoData.downedUrls.some((v) => { return v.path ===  nextProps.videoData.getCommenUrl});
            }
            if(isDown){//如果已经下载过的话  当前下载地址和下一个下载地址是否一样 不一样的话应该重新下载
                isDown=nextProps.videoData.getCommenUrl===this.props.videoData.getCommenUrl;
            }
            let loading=nextProps.videoData.downLoading===true;
            //判断是否下载过
            if(!isDown && !loading && !this.state.isLoading){
                this.setState({
                    isLoading : true,
                });
                //得到的URL去下载共用音频
                download(nextProps.videoData.getCommenUrl, "common",(obj)=>{
                    if(obj.status==="start"){
                        this.props.startDown();
                    }else if(obj.status==="faild"){
                        this.props.downFaild();
                        this.setState({
                            isLoading : false,
                        });
                    }else if(obj.status==="success"){
                        this.props.saveUrl(obj);
                        this.setState({
                            isLoading : false,
                        });
                    }
                }).download();
            }
        }
    }



    render() {
        return(
            <View style={{backgroundColor:utils.COLORS.background1}}>
                <NavBar navtitle="模拟考试" isBack={false} />

                <ScrollView>
                    <View style={styles.contain}>
                    {
                        this.props.videoData.paperList && this.props.videoData.paperList.map(element => {
                            const url=hostUrl+"/"+element.DownPath;
                            const isDown=this.props.videoData.downedUrls && this.props.videoData.downedUrls.length>0 && this.props.videoData.downedUrls.some((v) => { return v.path ===  url});
                            return  <VideoCard cardDic={element} key={element.ID} isDown={isDown} navigation={this.props.navigation}/>
                        })
                    }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles=StyleSheet.create({
    contain: {
        margin:utils.SCREENWIDTH*0.02,
        display:'flex',
        width: '100%',
        flexDirection: 'row',
        height:utils.SCREENHEIGHT,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },

});


const mapStateToProps = (state) => {
    const videoData=state.videoList;
    return {
        videoData,
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

export default connect(mapStateToProps,mapDispatchToProps)(HomeScreen);