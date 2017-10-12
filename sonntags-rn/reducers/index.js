import {
    DRAWER_OPEN,
    DRAWER_CLOSE,
    TOGGLE_DRAWER,
} from '../constants/ActionTypes';

const initialState = {
    drawerOpen: false,
    userLocation: null,
}

import { RootStackNavigator } from '../navigation/RootStackNavigator';

export default function mainReducer(state=initialState, action) {
    switch(action.type) {

        case 'SET_LOCATION':
            return Object.assign({}, state, {
                userLocation: action.userLocation
            });

        case TOGGLE_DRAWER:
            let isOpen = !state.drawerOpen
            return Object.assign({}, state, {
                drawerOpen: isOpen
            });

        case DRAWER_OPEN:

            return Object.assign({}, state, {
                drawerOpen: true
            });
             
        case DRAWER_CLOSE:
            return Object.assign({}, state, {
                drawerOpen: false
            });

        default:
            return state;
    }
}
