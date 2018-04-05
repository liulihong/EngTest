import {
    LOGIN,
    RESETPWD,
    COOKIE,
    ERROR,
    PAPERLIST,
    LOADING,
    GETCOMMON,
    SAVEDOWNURL,
    STARTDOWN,
    DOWNFAILD,
    CURRENTEXAMPATH,
    GETEXAMDETAIL,
    SAVEPLAYTIME,
    GETTOPICINFO,
    GETNEXTSTEPTOPIC,
    SAVEANSWERS,
    SAVEANSDIC,
    GETANSWERBLOW,
    NETINFO,
} from "./actionTypes";


export const userInfo = (state = {}, action) => {
    switch (action.type) {

        case COOKIE: 
            return {
                ...state,
                cookie: action.result,
                logResult:action.result.CurrentUser,
            }
        case LOGIN:
            return {
                ...state,
                logResult:action.result
                // ...action.result
            }
        case RESETPWD:
            return {
                ...state,
                ...action.result
            }
        case NETINFO:
            return {
                ...state,
                netInfo:action.result
            }
        default:
            return state
    }
}


export const error = (state = {}, action) => {
    switch(action.type) {
        case ERROR:
            return {
                ...state,
                errorObj:action.result
            }

        default:
            return state
    }
}


// export const jiajie = (state = {}, action) => {
//     switch (action.type) {
//         case INCREASE:
//             return {
//                 ...state,
//                 [action.name]: ++state[action.name]
//             }
//         case DECREASE:
//             return {
//                 ...state,
//                 [action.name]: --state[action.name]
//             }
//         case RESET:
//             return {
//                 ...state,
//                 [action.name]: action.initVal
//             }
//         default:
//             return state
//     }
// }

//这里每次都赋值空数组了
export const videoList = (state = {downedUrls: []}, action) => {
    switch (action.type) {
        case PAPERLIST:
            return {
                ...state,
                paperList: action.result.PaperList,
                loading: false
            }
        case LOADING:
            return {
                ...state,
                loading: true
            }
        case ERROR:
            return {
                ...state,
                errorObj:action.result,
                loading: false
            }
        case GETCOMMON:
            return {
                ...state,
                getCommenUrl:action.result.Uri,
            }
        case STARTDOWN:
            return {
                ...state,
                downLoading:true,
            }
        case SAVEDOWNURL:
            let downUrls=state.downedUrls ? state.downedUrls : [];
            return {
                ...state,
                downLoading:false,
                downedUrls:[
                    ...downUrls,
                    action.result
                ],
            }
        case DOWNFAILD:
            return {
                ...state,
                downLoading:false,
            }
        default:
            return state
    }
}

export const detail = (state = {answers: {}}, action) => {
    switch (action.type) {
        case CURRENTEXAMPATH:
            return {
                currentExamPath:action.result.url,
                taskId:action.result.taskId,
            }
        case GETEXAMDETAIL:
            return {
                currentExamPath:state.currentExamPath,
                taskId:state.taskId,
                examContent:action.result,
            }
        case GETTOPICINFO:
            return {
                currentExamPath:state.currentExamPath,
                taskId:state.taskId,
                examContent:state.examContent,
                topicInfo:action.result,
            }
        case GETNEXTSTEPTOPIC:
            return {
                ...state,
                ...action.result,
            }
        case SAVEPLAYTIME:
            return {
                ...state,
                currPlayTime:action.result,
            }
        case SAVEANSWERS:
            let typeObj=state.answers ? state.answers[action.result.Type] : {}
            return {
                ...state,
                answers:{
                    ...state.answers,
                    [action.result.Type]: {
                        ...typeObj,
                        [action.result.id]: {
                            num: action.result.num,
                            answer: action.result.answer
                        },
                    }
                }
            }
        case GETANSWERBLOW:
            return {
                ...state,
                answers: action.result,
            }
        case SAVEANSDIC:
            return {
                ...state,
                answerRecord:action.result,
            }
        default:
            return state
    }
}
