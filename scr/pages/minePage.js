import React,{ Compnents, Component } from 'react';
import { View ,Text, StyleSheet,Button,ImageBackground,Image } from 'react-native';
import Login from './loginPage';
import utils from "../utils";
import MineCell from "../components/mineCell";

export default class HomeScreen extends Component{

    constructor(props){
        super(props)
    }
    render() {
        return (
             
                <View style={styles.contain}>
                    <ImageBackground
                        source={require("../imgs/mineIcon/my_bg.png")}
                        style={styles.headerImg}
                    >
                        <Text style={styles.navTitle}>我</Text>
                        <View style={styles.headContain}>
                            <Image
                                source={require("../imgs/mineIcon/my_icon_mr_x.png")}
                                style={{width:37,height:55}}
                            />
                        </View>
                        <Text style={styles.userPhone}>13912345678</Text>
                    </ImageBackground>

                    <MineCell />
                    <MineCell />
                    <Text style={{margin:60}}>This is home</Text>
                    <Button 
                        title='To Detail'
                        onPress={()=>this.props.navigation.navigate('Login')}
                    />
                    <Text>This is home</Text>
                </View>
        );
    }
}

const styles=StyleSheet.create({
    contain: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor:utils.COLORS.background1
    },
    headerImg: {
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        width:utils.SCREENWIDTH,
        height:utils.SCREENWIDTH/750*478
    },
    navTitle:{
        marginTop:30,
        color:"#fff",
        fontSize:18,
        fontWeight:"900"
    },
    headContain:{
        marginTop:36,
        width:80,
        height:80,
        borderRadius:40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#fff"
    },
    userPhone:{
        marginTop:15,
        color:"#fff",
        fontSize:18,
        fontWeight:"400"
    }
});