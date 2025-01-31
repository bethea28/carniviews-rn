const initialState = {
    username: '',
    email: '',
    // ... other user-related properties
};
export const testReducer = (state = initialState, action = '') => {
    // console.log('test reducer is good tood', action)
    // return state
    switch (action.type) {
        case 'SET_USERNAME':
            console.log('show emails now')
            return {
                ...state,
                username: action.payload,
            };
        case 'SET_EMAIL':
            return {
                ...state,
                email: action.payload,
            };
        // ... other reducer cases
        default:
            return state;
    }
    return state
};