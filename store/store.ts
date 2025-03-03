import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore, Middleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { RESET_STORE_ACTION } from './actions';
import { pokemonApi } from './pokemonTestApi/pokemonTestApi';
import {counterSlice} from './globalState/globalState';
// import { legacyApi, rtkQueryErrorLogger } from './legacyApi';
// import { settingsReducer } from './settings';
// import { systemReducer } from './system';
import { userReducer } from './userReducer';
import { testReducer } from './testReducer';
// import { modalsReducer } from './modals';
import { api } from './api/api';
// import { robustaReducer } from './robusta';
const reducer = combineReducers({
  user: userReducer,
  testReducer,
  //   settings: settingsReducer,
  //   modals: modalsReducer,
  //   system: systemReducer,
  //   robusta: robustaReducer,
  //   [legacyApi.reducerPath]: legacyApi.reducer,
  [counterSlice.reducerPath]: counterSlice.reducer,
  [api.reducerPath]: api.reducer,
  [pokemonApi.reducerPath]: pokemonApi.reducer
  // [api.reducerPath]: api.reducer,
});

// on the root level persisted only "settings" state
const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['settings', 'user'],// we perist the settings reducer
  },
  reducer,
);

const rootReducer: typeof persistedReducer = (state, action) => {
  if (action.type === RESET_STORE_ACTION.type) {
    AsyncStorage.removeItem('persist:root').catch(() => { });

    return persistedReducer(undefined, action);
  }
  return persistedReducer(state, action);
};

const additionalMiddleware: Middleware[] = [];

// if (__DEV__) {
//   // eslint-disable-next-line import/no-extraneous-dependencies
//   const createDebugger = require('redux-flipper').default;
//   additionalMiddleware.push(createDebugger());
// }

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    // legacyApi.middleware,
    api.middleware,
    pokemonApi.middleware,
    // counterSlice.middleware,
    // rtkQueryErrorLogger,
    ...additionalMiddleware,
  ],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
