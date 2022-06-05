interface ICharactor {
    name: string,
    description: string,
    image: string,
    attributes: Array<any>
}

interface IUserInfo {
    userAddress: string
    balance: number
    pass: number
    characterList: Array<ICharactor>
}

export interface IUserState {
    loggedIn: boolean,
    info?: IUserInfo
}

const INITIAL_STATE = { 
    loggedIn: false,
    info: {
        userAddress: "",
        balance: 0,
        pass: 0,
        characterList: []
    }
}

function userInfoReducer(state = INITIAL_STATE, action: {type: string, info?: IUserInfo}) {
    switch (action.type) {
        case "SET_USER_INFO":
            return {
                ...state,
                loggedIn: true,
                info: action.info
            }

        case "DESTROY_USER_INFO":
            return {
                ...state,
                loggedIn: false,
                info: {
                    userAddress: "",
                    balance: 0,
                    pass: 0
                }
            }
    
        default:
            return state
    }
}

export default userInfoReducer;