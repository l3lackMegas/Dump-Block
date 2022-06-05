interface IGameStyle {
    background: string
    bubble: string
    backgroundImage: string
}

interface IGameLoadingStatus {
    isLoading: boolean
    message: string
}

export interface IGameState {
    scene: string
    style: IGameStyle
    loadingStatus: IGameLoadingStatus
}

const INITIAL_STATE = { 
    scene: 'TITLE_SCREEN',
    style: {
        background: '#00000000',
        bubble: '',
        backgroundImage: ''
    },
    loadingStatus: {
        isLoading: false,
        message: ''
    }
}

function gameStateReducer(state = INITIAL_STATE, action: {type: string, data?: IGameState | IGameStyle | IGameLoadingStatus}) {
    console.log(action);
    switch (action.type) {
        case "SET_SCENE":
            return {
                ...state,
                scene: action.data
            }

        case "SET_STYLE":
            return {
                ...state,
                style: action.data
            }

        case "SET_LOADING_STATUS":
            return {
                ...state,
                loadingStatus: action.data
            }
    
        default:
            return state
    }
}

export default gameStateReducer;