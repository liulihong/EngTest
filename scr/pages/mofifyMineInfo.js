import React, { Compnents, Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import NavBar from '../components/navBar';
import utils from "../utils";
import { Modify, getArea } from '../request/requestUrl';
import { fetchPost } from '../request/fetch';
import { LOGIN } from '../store/actionTypes';
import { connect } from 'react-redux';
import { motifyMyInfo } from '../store/actions';
import { adressPicker as AdressPicker } from "../components/PickerCom"


class MineInfo extends Component {

    constructor(props) {
        super(props);

        this.btnClick = this.btnClick.bind(this);
        this.getAdressInfo = this.getAdressInfo.bind(this);
        this.getAdressClassID = this.getAdressClassID.bind(this);

        this.state = {
            classObj: { "Title": "", "ID": "" },
            adressObj: { "Title": "", "ID": "" },
            adressDataArr: [],
            classDataArr: [{ 'Title': '六年级', 'ID': '0' }, { 'Title': '七年级', 'ID': '7' },
            { 'Title': '八年级', 'ID': '8' }, { 'Title': '九年级', 'ID': '9' }],
            pickerType: 3,//默认不显示PickerView
        }

        this.getAdressInfo();
    }

    //组件加载完成
    componentDidMount() {
        for (let i = 0; i < this.state.classDataArr.length; i++) {
            let tempObj = this.state.classDataArr[i];
            if (tempObj.ID == this.props.logResult.Grade) {
                this.setState({
                    classObj: tempObj,
                });
                break;
            }
        }
    }

    //获取地址信息
    getAdressInfo() {
        fetchPost(getArea, {}).then((result) => {
            this.setState({
                adressDataArr: result.Items,
            });
            for (let i = 0; i < result.Items.length; i++) {
                let tempObj1 = result.Items[i];
                for (let j = 0; j < tempObj1.Childs.length; j++) {
                    let tempObj2 = tempObj1.Childs[j];
                    if (tempObj2.ID === this.props.logResult.CityID) {
                        this.setState({
                            adressObj: tempObj2,
                        });
                        break;
                    }
                }
            }
        }, (error) => {
            alert(error);
        })
    }

    //得到地址ID
    getAdressClassID(type,tempObj){
        if(type===1){
            this.setState({
                classObj: tempObj,
            });
            this.props.motifyInfo({Grade:this.state.classObj.ID},()=>{
                alert("恭喜，修改成功！");
            })
        }else if(type===2){
            this.setState({
                adressObj:tempObj,
            });
            this.props.motifyInfo({City:this.state.adressObj.ID},()=>{
                alert("恭喜，修改成功！");
            })
        }
        this.setState({
            pickerType: 3,
        });
    }

    btnClick(tag) {
        if (tag === 0) {//编辑姓名
            this.props.navigation.navigate("MineTxtInfo", { type: "姓名" });
        } else if (tag === 1) {//学籍号
            this.props.navigation.navigate("MineTxtInfo", { type: "学籍号" });
        } else if (tag === 2) {//地区
            this.setState({pickerType: 2,})
        } else if (tag === 3) {//学校
            this.props.navigation.navigate("MineTxtInfo", { type: "学校" });
        } else if (tag === 4) {//年级
            this.setState({pickerType: 1,})
        } else if (tag === 5) {//班级
            if (this.props.logResult.Name === null)
                alert("请先编辑姓名！");
            else
                this.props.navigation.navigate('JoinClass', { UserID: this.props.logResult.ID });
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        let titleArr = ["姓名", "学籍号", "地区", "学校", "年级", "班级"];
        let valueArr = [(this.props.logResult.Name ? this.props.logResult.Name : ""),
        (this.props.logResult.NO ? this.props.logResult.NO : ""),
        this.state.adressObj.Title,
        (this.props.logResult.School ? this.props.logResult.School : ""),
        this.state.classObj.Title,
        (this.props.logResult.Class ? this.props.logResult.Class : ""),];
        return (
            <View style={styles.contain}>
                <NavBar navtitle="编辑资料" isBack={true} navgation={this.props.navigation} />
                <View style={styles.txtView}>
                    {
                        titleArr.map((title, i) => {
                            return <TouchableOpacity key={i} style={styles.cellView} onPress={() => this.btnClick(i)}>
                                <View style={styles.titleView}>
                                    <Text
                                        style={[{ color: utils.COLORS.theme1, fontSize: 16, }]}>{title}
                                    </Text>
                                </View>
                                <View style={styles.valueView}>
                                    <Text
                                        style={[{ color: "#999999", textAlign: "right", fontSize: 16, }]}>{valueArr[i]}
                                    </Text>
                                </View>
                                <View style={styles.ImageView}>
                                    <Image style={styles.arrow} source={require("../imgs/cusIcon/icon_enter.png")} />
                                </View>
                            </TouchableOpacity>
                        })
                    }
                </View>

                <AdressPicker
                    adressDataArr={this.state.adressDataArr}
                    classDataArr={this.state.classDataArr}
                    type={this.state.pickerType}
                    setAdressID={(type, tempObj) => this.getAdressClassID(type, tempObj)}
                />

            </View>
        );
    }


}



const mapStateToProps = (state) => {
    let logResult = state.userInfo.logResult
    return {
        logResult,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        motifyInfo: (paramts, callBack) => {
            dispatch(motifyMyInfo(paramts, callBack))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MineInfo);

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    txtView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellView: {
        width: utils.SCREENWIDTH,
        height: 50,
        flexDirection: "row",
        backgroundColor: "#eeeeee",
    },
    titleView: {
        width: 100,
        height: 49,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
    },
    valueView: {
        width: utils.SCREENWIDTH - 135,
        height: 49,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingRight: 6,
    },
    ImageView: {
        width: 35,
        height: 49,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
    },
    arrow: {
        width: 18,
        height: 18
    },
});