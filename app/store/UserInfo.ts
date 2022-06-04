interface IUserInfo {
    username: string
    displayname: string
    user_img: string
}

export interface IUserState {
    loggedIn: boolean,
    info?: IUserInfo
}

const INITIAL_STATE = { 
    loggedIn: false,
    info: {}
}

function userInfoReducer(state = INITIAL_STATE, action: {type: string, info?: IUserInfo}) {
    switch (action.type) {
        case "SET_USER_INFO":
            return {
                loggedIn: true,
                info: action.info
            }

        case "DESTROY_USER_INFO":
            return {
                loggedIn: false,
                info: {}
            }
    
        default:
            return state
    }
}

export default userInfoReducer;