import { combineReducers } from "@reduxjs/toolkit";

import fileReducer from "./slices/fileSlice";

const rootReducer = combineReducers({
    file: fileReducer,
});

export default rootReducer;
