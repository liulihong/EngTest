import React,{Component} from "react";
import utils from "../utils";
import {View, Text, Button, Image, Alert, StyleSheet,TouchableOpacity , Picker } from 'react-native';


export class adressPicker extends Component{
    constructor(){
        super(...arguments);
        this.btnClick=this.btnClick.bind(this);
        this.getPickerContent=this.getPickerContent.bind(this);

        this.state={
            tempAdressObj1: {},
            tempAdressObj2: {},
        }

    }

    //组件更新
    componentWillUpdate(nextprops){
        if(nextprops.type!==this.props.type){
            setTimeout(()=>{
                if(this.props.type===2){
                    if(this.props.adressDataArr.length>0){
                        let tempAdressObj1=this.props.adressDataArr[0];
                        let tempAdressObj2=tempAdressObj1.Childs[0];
                        this.setState({
                            tempAdressObj1: tempAdressObj1,
                            tempAdressObj2: tempAdressObj2,
                        })
                    }else{
                        Alert.alert("","地区信息为空哦 !");
                        this.props.setAdressID(3,{});
                    }
                }else {
                    let tempAdressObj1={};
                    let tempAdressObj2=this.props.classDataArr[0];
                    this.setState({
                        tempAdressObj1: tempAdressObj1,
                        tempAdressObj2: tempAdressObj2,
                    })
                }
            },200)
        }
    }

    btnClick(isSure){
        setTimeout(()=>{
            if(isSure){
                this.props.setAdressID(this.props.type,this.state.tempAdressObj2);
            }else{
                this.props.setAdressID(3,{});
            }
        },100)
    }

    getPickerContent(){
        if(this.props.type===1){//选择年级
            return <View style={styles.pickerView} >
                <Picker
                    style={styles.picker}
                    mode = { "dropdown" }
                    enabled = { true }
                    selectedValue={this.state.tempAdressObj2}
                    onValueChange={(itemValue,itemPosition) => {
                        let tempAdressObj2=this.props.classDataArr[itemPosition];
                        this.setState({
                            tempAdressObj2: tempAdressObj2,
                        })
                    }}
                >
                    {
                        this.props.classDataArr.map((classObj,i)=>{
                            return <Picker.Item key={i} label={classObj.Title} value={classObj} />
                        })
                    }
                </Picker>
            </View>
        }else if(this.props.type===2){//选择城市
            return <View style={styles.pickerView} >
                <Picker
                    style={styles.picker}
                    mode = { "dropdown" }
                    selectedValue={this.state.tempAdressObj1.ID}
                    onValueChange={(itemValue,itemPosition) => {
                        let tempAdressObj1=this.props.adressDataArr[itemPosition];
                        let tempAdressObj2=tempAdressObj1.Childs[0];
                        this.setState({
                            tempAdressObj1: tempAdressObj1,
                            tempAdressObj2: tempAdressObj2,
                        })
                    }}
                >
                    {
                        this.props.adressDataArr.map((adress)=>{
                            return <Picker.Item key={adress.ID} label={adress.Title} value={adress.ID} />
                        })
                    }
                </Picker>
                <Picker
                    style={styles.picker}
                    mode = { "dropdown" }
                    selectedValue={this.state.tempAdressObj2.ID}
                    onValueChange={(itemValue,itemPosition) => {
                        let tempAdressObj2=this.state.tempAdressObj1.Childs[itemPosition];
                        this.setState({
                            tempAdressObj2: tempAdressObj2,
                        })
                    }}
                >
                    {
                        this.state.tempAdressObj1.Childs && this.state.tempAdressObj1.Childs.map((adress)=>{
                            return <Picker.Item style={{fontSize:10}} key={adress.ID} label={adress.Title} value={adress.ID} />
                        })
                    }
                </Picker>
            </View>
        }else if(this.props.type===3){//隐藏pickerView
            Alert.alert("","picker隐藏");
        }else {//picker未知
            Alert.alert("","picker未知");
        }
    }

    render(){

        if(this.props.type===1 || this.props.type===2){
            let title=this.props.type===1 ? "选择年级" : "选择城市" ;
            return (
                <View style={styles.contain}>
                    <View style={styles.content}>

                        <View style={styles.titleView}>
                            <TouchableOpacity style={styles.titleBtn} onPress={()=>this.btnClick(false)}>
                                <Text style={styles.btnTxt}>{"取消"}</Text>
                            </TouchableOpacity>
                            <Text style={styles.titleTxt} >{title}</Text>
                            <TouchableOpacity style={styles.titleBtn} onPress={()=>this.btnClick(true)}>
                                <Text style={styles.btnTxt}>{"确定"}</Text>
                            </TouchableOpacity>
                        </View>

                        {
                            this.getPickerContent()
                        }

                    </View>
                </View>
            );
        }
        return <View/>
    }
}

const styles=StyleSheet.create({
    contain:{
        width:utils.SCREENWIDTH,
        height:utils.SCREENHEIGHT,
        backgroundColor:"rgba(0,0,0,0.5)",
        
        position:'absolute'
    },
    content:{
        // position:'absolute',
        marginTop:utils.SCREENHEIGHT-240,
        width:utils.SCREENWIDTH,
        height:240,
        backgroundColor:"white",
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'flex-end',
        flexWrap:'wrap'
    },
    titleView:{
        width:utils.SCREENWIDTH,
        height:46,
        backgroundColor:"white",
        flexDirection:"row",
        alignItems:'center'
    },
    titleBtn:{
        width:"20%",
        height:"100%",
        flexDirection:"row",
        alignItems:'center',
        justifyContent:"center",
    },
    btnTxt:{
        fontSize:15,
        color:utils.COLORS.theme,
        fontWeight:"600",
    },
    titleTxt:{
        textAlign:"center",
        color:utils.COLORS.theme1,
        width:"60%",
        fontSize:14,
    },
    pickerView:{
        flexDirection:'row',
        // backgroundColor:"red",
        // backgroundColor:utils.COLORS.background1,
        // position:"absolute",
        // width:"100%",
        // bottom:0,
        width:utils.SCREENWIDTH,
        // height:300,
        justifyContent:"center"
    },
    picker:{
        width:utils.SCREENWIDTH*0.4,
        // backgroundColor:utils.COLORS.background1,
        // height:300
    },
});