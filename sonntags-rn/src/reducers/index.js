import {
    SET_SPACE_INFO,
} from '../constants/ActionTypes';

const initialState = {
    userLocation: null,
}

export default function mainReducer(state=initialState, action) {
    switch(action.type) {


        case SET_SPACE_INFO:
            return Object.assign({}, state, {
                spaceInfo: action.spaceInfo
            });

        case 'SET_LOCATION':
            return Object.assign({}, state, {
                userLocation: action.userLocation
            });

        default:
            return state;
    }
}
