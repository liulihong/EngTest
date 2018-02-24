import React, {Component} from "react";
import {Image} from "react-native"
import TabBarItem from '../components/tabItem';
import HomePage from "./homePage";
import TaskPage from "./taskPage"
import MinePage from "./minePage";
// import HomeDetail from "./pages/homeDetail";
import { StackNavigator, TabBarBottom, TabNavigator} from "react-navigation";
import Login from './loginPage'
import utils from '../utils'


// const color  = {
//     theme: '#12b7f5',
//     theme1: '#333333',
//     border: '#e0e0e0',
//     background: '#f8f8ff',
//     background1: '#dcdcdc',
// };

export default class MainRoute extends Component {
	constructor() {
		super()
	}
	render() {
		// return this.props.isLogin?<Navigator/>:<LogRouter/>
		return <LogRouter/>
	}
}

//多个选项卡
export const Tab = TabNavigator(
	{
		Home: {
			//对应的屏幕
			screen: HomePage,
			//用于屏幕的默认导航选项
			navigationOptions: ({navigation}) => ({
				//选项卡名称
                // tabBarLabel: '首页',
                title: '练习',
				//选项卡图标 focused：是否选中 tintColor：选中颜色
				tabBarIcon: ({focused, tintColor}) => (
					//自定义组件展示图标
					<TabBarItem
						tintColor={tintColor}
						focused={focused}
                        selectedImage={require("../imgs/tabIcon/icon_lx_click.png")}
                        normalImage={require("../imgs/tabIcon/icon_lx.png")}
					/>
				)
			})
		},
        Task: {
            //对应的屏幕
            screen: TaskPage,
            //用于屏幕的默认导航选项
            navigationOptions: ({navigation}) => ({
                //选项卡名称
                // tabBarLabel: '首页',
                title: '作业',
                //选项卡图标 focused：是否选中 tintColor：选中颜色
                tabBarIcon: ({focused, tintColor}) => (
                    //自定义组件展示图标
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        selectedImage={require("../imgs/tabIcon/icon_zy_click.png")}
                        normalImage={require("../imgs/tabIcon/icon_zy.png")}
                    />
                )
            })
        },
		MyCenter: {
			//对应的屏幕
			screen: MinePage,
			//用于屏幕的默认导航选项
			navigationOptions: ({navigation}) => ({
				//选项卡名称
                // tabBarLabel: '我的',
                header: null,
                title: '我',
				//选项卡图标 focused：是否选中 tintColor：选中颜色
				tabBarIcon: ({focused, tintColor}) => (
					//自定义组件展示图标
					<TabBarItem
						tintColor={tintColor}
						focused={focused}
                        selectedImage={require("../imgs/tabIcon/icon_my_click.png")}
                        normalImage={require("../imgs/tabIcon/icon_my.png")}
					/>
				)
			})
		},
	},
	//TabNavigatorConfig
	{
		tabBarComponent: TabBarBottom,//用作标签栏的组件（这是iOS上的默认设置），（这是Android上的默认设置）TabBarBottomTabBarTop
		tabBarPosition: 'bottom',//标签栏的位置可以是或'top''bottom'
		swipeEnabled: true,//是否允许在标签之间进行滑动
		animationEnabled: true,//是否在更改标签时动画
		lazy: true,//是否根据需要懒惰呈现标签，而不是提前制作
		tabBarOptions: {
			//ios
			activeTintColor: utils.COLORS.theme,//活动标签的标签和图标颜色
			activeBackgroundColor: utils.COLORS.background,//活动选项卡的背景颜色
			inactiveTintColor: utils.COLORS.theme1,//非活动标签的标签和图标颜色
			inactiveBackgroundColor: utils.COLORS.background,//非活动标签的背景颜色
			showLabel: true,//是否显示标签的标签，默认为true
			//style: {backgroundColor: 'blue',},//标签栏的样式对象
			labelStyle: {fontSize: 10,},//标签标签的样式对象
			tabStyle: {width: 100,},//标签栏的样式对象
			//android
			scrollEnabled: true,//是否启用可滚动选项卡
		}
	}
);


const Navigator = StackNavigator(
	{
		HomePage: {
			screen: Tab,
			//屏幕导航选项
			// navigationOptions: {
			// 	//设置隐藏标题。HeaderProps null
             //    header: null
			// },
			cardStyle: {
				backgroundColor: utils.COLORS.background,
            },
        },
        Login: {
            screen: Login,
        },
	}
);

const LogRouter = StackNavigator(
    {
        Login: {
            screen: Login,
            navigationOptions: {
                //设置隐藏标题。HeaderProps null
                header: null,

            },
        },
        HomePage: {
            screen: Navigator,
            //屏幕导航选项
            navigationOptions: {
                //设置隐藏标题。HeaderProps null
                header: null,
                gesturesEnabled:false,
            },
            cardStyle: {
                backgroundColor: utils.COLORS.background,
            },
        },
    },

);
