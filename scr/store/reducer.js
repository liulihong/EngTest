import {
    LOGIN,
    RESETPWD,
    COOKIE,
    ERROR
} from "./actionTypes";


export const userInfo = (state = {}, action) => {
    switch (action.type) {

        case COOKIE: 
            return {
                ...state,
                cookie: action.result
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


export const videoList = (state = {}, action) => {
    switch (action.type) {
        // case LOGIN:
        //     return {
        //         ...state,
        //         list: action.result
        //     }
        default:
            return state
    }
}

export const detail = (state = {}, action) => {
    switch (action.type) {
        // case LOGIN:
        //     return {
        //         ...state,
        //         ...action.result
        //     }
        default:
            return state
    }
}


