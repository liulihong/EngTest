import React,{ Compnents, Component } from 'react';
import { ScrollView , StyleSheet ,View ,Button} from 'react-native';
import { StackNavigator } from 'react-navigation';
import VideoCard from '../components/videoCard';
import utils from '../utils'
import Login from './loginPage'

export default class HomeScreen extends Component{

    constructor(props){
        super(props)
        this.btnClick=this.btnClick.bind(this);
        
    }
    array1=[{id:'1'},{id:'2'},{id:'3'},{id:'4'},{id:'5'},{id:'6'},{id:'7'},{id:'8'},{id:'9'},{id:'10'},{id:'11'}];

    btnClick(){
       this.props.navigation.navigate('Login');
    }

    render() {
        return(
            <View>
                <Button title="选择年级" onPress={this.btnClick}/>
                <ScrollView>
                    <View style={styles.contain}>
                    {
                        this.array1.map(element => {
                        return  <VideoCard key={element.id}/>
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