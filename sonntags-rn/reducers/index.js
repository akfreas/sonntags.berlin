import {
    DRAWER_OPEN,
    DRAWER_CLOSE,
    TOGGLE_DRAWER,
} from '../constants/ActionTypes';

const initialState = {
    drawerOpen: false
}

export default function rootReducer(state=initialState, action) {
    switch(action.type) {

        case TOGGLE_DRAWER:
            return Object.assign({}, state, {
                drawerOpen: !state.drawerOpen
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
            break
    }
}
