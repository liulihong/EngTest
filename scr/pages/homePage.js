import React,{ Compnents, Component } from 'react';
import { ScrollView , StyleSheet ,View ,Button} from 'react-native';
import { StackNavigator } from 'react-navigation';
import VideoCard from '../components/videoCard';
import utils from '../utils'
import Login from './loginPage'
import Audio from "../utils/audioPlay"

export default class HomeScreen extends Component{

    constructor(props){
        super(props)
        this.btnClick=this.btnClick.bind(this);
        
    }

    array1=[{"ID":"ccaf30c0-2f05-4006-bbc9-6afb4c8e6c09","PriTitle":"英语辅导报","SecTitle":"模拟试题2","Title":"测试训练1","Summary":"宜昌中考","Grade":"七年级","DownPath":"train/simulation/CCAF30C0-2F05-4006-BBC9-6AFB4C8E6C09.zip"}];

    // array1=[{id:'1'},{id:'2'},{id:'3'},{id:'4'},{id:'5'},{id:'6'},{id:'7'},{id:'8'},{id:'9'},{id:'10'},{id:'11'}];

    btnClick(){
       this.props.navigation.navigate('Sound');
    }

    render() {
        return(
            <View style={{backgroundColor:utils.COLORS.background1}}>
                <Button title="选择年级" onPress={this.btnClick}/>
                <Audio />
                <ScrollView>
                    <View style={styles.contain}>
                    {
                        this.array1.map(element => {
                        return  <VideoCard cardDic={element} key={element.ID}/>
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