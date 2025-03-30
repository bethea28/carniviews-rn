import { BusinessHours } from "@/app/Screens/BusinessHours";
import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
  value: 0,
  userState: {},
  businessHours: {
    0: { day: "Mon", open: "", close: "" },
    1: { day: "Tues", open: "", close: "" },
    2: { day: "Wed", open: "", close: "" },
    3: { day: "Thurs", open: "", close: "" },
    4: { day: "Fri", open: "", close: "" },
    5: { day: "Sat", open: "", close: "" },
    6: { day: "Sun", open: "", close: "" },
  },
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
    setGlobalBusinessHours: (state, action) => {
      console.log("bryan hours payload", action);
      const payLoad = action.payload;
      state.businessHours[payLoad.index][payLoad.event] = payLoad.time;
      // state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  increment,
  decrement,
  incrementByAmount,
  setUserState,
  setGlobalBusinessHours,
} = counterSlice.actions;

export default counterSlice;
