import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { breakdowns } from "../../backend/database";
import { Breakdown } from "../../data/types";

/**
 * Redux Section
 */
export interface BreakdownsState {
    [breakdownID: string]: Breakdown
}

const initialState: BreakdownsState = breakdowns.reduce((r, breakdown) => ({
    ...r,
    [breakdown.breakdownID]: breakdown
}), {})

const breakdownsRedux = createSlice({
    name: "BREAKDOWNS",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Omit<Breakdown, "datetime" | "breakdownID">>) {
            console.timeLog('Event', 'Breakdown added', action.payload);

            let breakdownID = uuidv4();
            state[breakdownID] = {
                breakdownID: breakdownID,
                ...action.payload,
                datetime: moment().valueOf(),
            };
        },
        edit(state, action: PayloadAction<Omit<Breakdown, "datetime">>) {
            console.timeLog('Event', 'Breakdown edited', action.payload);

            state[action.payload.breakdownID] = {
                ...action.payload,
                datetime: moment().valueOf()
            }
        },
        remove(state, action: PayloadAction<string>) {
            console.timeLog('Event', 'Breakdown deleted', action.payload);

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