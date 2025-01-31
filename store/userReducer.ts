import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    isAuthorized: boolean;
    username: undefined | string;
}

const initialState: UserState = {
    isAuthorized: false,
    username: undefined,
};

const userSlice = createSlice({
    name: 'user',
    initialState: { ...initialState },
    reducers: {
        authorizeUser: (state, action: PayloadAction<string>) => {
            console.log('these are my actions', action)
            state.isAuthorized = true;
            state.username = action.payload;
        },
    },
});

export const {
    reducer: userReducer,
    actions: { authorizeUser },
} = userSlice;



// // userReducer.js
// const initialState = {
//     username: '',
//     email: '',
//     // ... other user-related properties
//   };
//   const userReducer = (state = initialState, action) => {
//     switch (action.type) {
//       case 'SET_USERNAME':
//         return {
//           ...state,
//           username: action.payload,
//         };
//       case 'SET_EMAIL':
//         return {
//           ...state,
//           email: action.payload,
//         };
//       // ... other reducer cases
//       default:
//         return state;
//     }
//   };
// //   export default userReducer;

//   export const {
//     reducer: userReducer,
//   } = userSlice;
