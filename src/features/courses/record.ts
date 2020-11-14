import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { records } from "../../backend/database";
import { Record } from "../../data/types";

/**
 * Redux Section
 */
export interface RecordsState {
    [recordID: string]: Record
}

const initialState: RecordsState = records.reduce((r, record) => ({
    ...r,
    [record.recordID]: record
}), {})

const recordsRedux = createSlice({
    name: "RECORDS",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Record>) {
            console.timeLog('Event', 'Record added', action.payload);
            state[action.payload.recordID] = action.payload
        },
        edit(state, action: PayloadAction<Record>) {
            console.timeLog('Event', 'Record edited', action.payload);
            state[action.payload.recordID] = action.payload;
        },
        remove(state, action: PayloadAction<string>) {
            console.timeLog('Event', 'Record deleted', action.payload);
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