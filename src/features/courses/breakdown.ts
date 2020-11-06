import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Breakdown } from "../../data/types";
import { breakdowns } from "../../backend/database";

/**
 * Redux Section
 */
export interface BreakdownsState {
    [breakdownID: string]: Breakdown
}

const initialState: BreakdownsState = breakdowns.reduce((r, v) => ({
    ...r,
    [v.breakdownID]: v
}), {})

const breakdownsRedux = createSlice({
    name: "BREAKDOWNS",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Breakdown>) {
            state[action.payload.breakdownID] = action.payload;
        },
        edit(state, action: PayloadAction<Breakdown>) {
            state[action.payload.breakdownID] = action.payload;
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
} = breakdownsRedux.actions;

export default breakdownsRedux.reducer;