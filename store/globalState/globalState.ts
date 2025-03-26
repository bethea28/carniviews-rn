import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
  value: 0,
  userState: {},
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUserState: (state, action) => {
      state.userState = action.payload;
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
    },
    increment: (state, action) => {
      // console.log('state increment', state, action)
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, setUserState } =
  counterSlice.actions;

export default counterSlice;
