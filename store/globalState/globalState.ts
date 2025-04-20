import { BusinessHours } from "@/app/Components/BusinessHours";
import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
  companyInfo: {},
  country: null,
  value: 0,
  userState: {},
  eventHours: { start: null, end: null },
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
    setCompanyInfo: (state, action) => {
      console.log("set companyinfo BRYAN", action.payload);
      const updatedCompanyInfo = {
        ...state.companyInfo,
        companyId: action.payload.id,
        compInfo: action.payload.companyInfo,
        hoursData: action.payload.hoursData,
      };
      state.companyInfo = updatedCompanyInfo;
      // state.value += action.payload;
    },
    setCountry: (state, action) => {
      console.log("add country set", action);
      state.country = action.payload;
    },
    setEventHours: (state, action) => {
      const payLoad = action.payload;
      state.eventHours = {
        ...state.eventHours,
        [payLoad.event]: payLoad.finalTime,
      };

      console.log("final hours now", state.eventHours);
    },
    setGlobalBusinessHours: (state, action) => {
      console.log("bryan hours payload", action);
      const payLoad = action.payload;
      // const finalHours = { ...state.businessHours };
      // finalHours[payLoad.index][payLoad.event] = payLoad.finalTime;
      // state.businessHours = finalHours;
      state.businessHours = {
        ...state.businessHours, // Create a shallow copy of businessHours
        [payLoad.index]: {
          ...state.businessHours[payLoad.index], // Create a shallow copy of the day's hours
          [payLoad.event]: payLoad.finalTime, // Update the specific event (open/close)
        },
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  increment,
  decrement,
  incrementByAmount,
  setCountry,
  setUserState,
  setGlobalBusinessHours,
  setEventHours,
  setCompanyInfo,
} = counterSlice.actions;

export default counterSlice;
