import React,{ Compnents, Component } from 'react';
import { ScrollView , StyleSheet ,View ,Button,Text} from 'react-native';
import { StackNavigator } from 'react-navigation';
import VideoCard from '../components/videoCard';
import utils from '../utils';
import Login from './loginPage';
import NavBar from '../components/navBar';

export default class TaskScreen extends Component{

    constructor(props){
        super(props)
        this.btnClick=this.btnClick.bind(this);

    }

    array1=[];
    // array1=[{"ID":"A2C77CF9-9D95-4E6E-A369-66C4D5A56B20","PriTitle":"英语辅导报","SecTitle":"模拟试题2","Title":"测试训练1","Summary":"宜昌中考","Grade":"七年级","DownPath":"train/simulation/CCAF30C0-2F05-4006-BBC9-6AFB4C8E6C09.zip"}];
    // array1=[{id:'1'},{id:'2'},{id:'3'},{id:'4'},{id:'5'},{id:'6'},{id:'7'}];

    btnClick(){
        this.props.navigation.navigate('Login');
    }

    render() {
        return(
            <View style={{backgroundColor:utils.COLORS.background1}}>
                <NavBar navtitle="作业" isBack={false}/>
                <Text style={{margin:20,textAlign:'center'}}>{"暂时没有作业哦！"}</Text>
                <ScrollView>
                    <View style={styles.contain}>
                        {
                            this.array1.map(element => {
                                return  <VideoCard cardDic={element} key={element.ID} navigation={this.props.navigation}/>
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