import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status, Record } from "../../data/types";
import { records } from "../../backend/database";

/**
 * Redux Section
 */
export interface Records {
    [recordID: string]: Record
}

const initialState: Records = records.reduce((r, v) => ({
    ...r,
    [v.recordID]: v
}), {})

const recordsRedux = createSlice({
    name: "RECORDS",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Record>) {
            state[action.payload.recordID] = action.payload
        },
        edit(state, action: PayloadAction<Record>) {
            state[action.payload.recordID] = action.payload;
        },
        remove(state, action: PayloadAction<string>) {
            delete state[action.payload];
        }
    }
});

export const {
    add,
    edit,
    remove
} = recordsRedux.actions;

export default recordsRedux.reducer;