import React,{ Compnents, Component } from 'react';
import { Text, StyleSheet ,ImageBackground,TouchableOpacity,Image,View} from 'react-native';
import utils from "../utils";
import VideoCard from "./videoCard";

export default class NavBar extends Component {
    constructor() {
        super(...arguments)
        this.backVC=this.backVC.bind(this);
    }

    render () {

        return(

            <ImageBackground
                source={require("../imgs/mineIcon/my_bg.png")}
                style={styles.headerImg}
            >

                {
                    this.props.isBack?<TouchableOpacity
                        style={styles.backView}
                        onPress={() =>{this.backVC()}}
                    >
                        <Image
                            source={require("../imgs/cusIcon/top_back.png")}
                            style={styles.backImg}
                        />
                    </TouchableOpacity>:<View style={styles.navBtn}/>
                }
                <View style={styles.titleView}><Text style={styles.navTitle}>{this.props.navtitle}</Text></View>
                <View style={styles.navBtn}/>
            </ImageBackground>
        )
    }

    backVC=()=>{
        //返回首页方法
        this.props.navgation.goBack();
    }
}

const styles=StyleSheet.create({
    headerImg: {
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
        width:utils.SCREENWIDTH,
        height:utils.SCREENWIDTH/750*128,
        backgroundColor:'red',
        // position:"relative",
        // top:0,
    },
    backView:{
        marginTop:20,
        width:60,
        height:44,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        // backgroundColor:"#cccccc",
    },
    backImg:{
        marginLeft:12,
    },
    titleView:{
        marginTop:20,
        // backgroundColor:"#dddddd",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width:utils.SCREENWIDTH-120,
        alignSelf:"center",
        marginRight:50,
    },
    navTitle:{
        color:"#fff",
        fontSize:18,
        fontWeight:"600"
    },
    navBtn:{
        width:60,
    }
});