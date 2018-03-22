import React,{Component} from "react";
import MySound from "../utils/soundPlay";
import {StyleSheet, View, ScrollView,Text,TouchableOpacity,Image} from "react-native";


let Sound1 = new MySound;
let timer1;
let timer2;

export default class AnswerCom extends Component{

    constructor(props){
        super(props)
        this.clickPlay=this.clickPlay.bind(this);
        this.state={
            playID:""
        }
    }

    clickPlay(path,id){
        clearTimeout(timer1);
        clearTimeout(timer2);
        Sound1.soundStop();
        Sound1.startPlay(path);
        this.setState({
            playID:id,
        })

        let timer2=setTimeout(()=>{
            clearTimeout(timer2);
            let during=Sound1.soundDuring();
            let timer1=setTimeout(()=>{
                clearTimeout(timer1);
                this.setState({
                    playID:"",
                })
            },(during-1)*1000)
        },1000)

    }

    render(){
        const {answers} = this.props
        return (
            Object.keys(answers).map((element)=>{
                return (
                    <View key={element} style={{margin:10}}>
                        {
                            element==="10"?<Text>{"听后选图"}</Text>:
                                element==="1"?<Text>{"听后选择"}</Text>:
                                    element==="2"?<Text>{"听后回答"}</Text>:
                                        element==="3"?<Text>{"听后记录"}</Text>:
                                            element==="4"?<Text>{"听后转述"}</Text>:<Text>{"短文朗读"}</Text>
                        }
                        {
                            Object.keys(answers[element]).map(id => {
                                let arr=['A','B','C','D','E','F'];

                                if(element==='1' || element==='10'){         //选择题
                                    let selectIndex=answers[element][id].answer-1;
                                    let resultAnswer=arr[selectIndex];
                                    return (
                                        <Text key={id}>{answers[element][id].num + ':  ' + resultAnswer}</Text>
                                    )
                                }else if(element==='3'){   //填空题 14 15 16 17 18
                                    let ansObj=answers[element][id].answer;
                                    return (<View key={id}>
                                        {
                                            Object.keys(ansObj).map((objKey)=>{
                                                return <Text key={objKey}>{objKey + ':  ' + ansObj[objKey]}</Text>
                                            })
                                        }
                                    </View>);
                                }else {                    //录音音频题
                                    let isPlay=this.state.playID===id;
                                    let source=isPlay?require('../imgs/testIcon/ks_bf_icon.png'):require('../imgs/testIcon/ks_zt_icon.png');
                                    let func=isPlay ? ()=>Sound1.soundStop() : ()=>this.clickPlay(answers[element][id].answer,id) ;
                                    return (
                                        <TouchableOpacity key={id} onPress={func}>
                                            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems: 'center',}}>
                                                <Text>{answers[element][id].num + ':  点击播放'}</Text>
                                                <Image
                                                    style={{width:24,height:24}}
                                                    source={source}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }
                            })
                        }
                    </View>
                )
            })
        );
    }
}