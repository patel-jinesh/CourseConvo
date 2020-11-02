import { Course } from "./course";
import { User } from "../user/user"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Mark {
    type: string;
    weight: number;
    count: number;
}

export interface Breakdown {
    breakdownID: string,
    course: string;
    user: User;
    marks: Mark[];
    isAnonymous: boolean;
}

/**
 * Redux Section
 */
export interface BreakdownsState {
    [breakdownID: string]: Breakdown
}

export enum BreakdownActions {
    ADD = "ADD",
    EDIT = "EDIT",
    DELETE = "DELETE"
}

const initialState: BreakdownsState = {};

const breakdownsRedux = createSlice({
    name: "BREAKDOWNS",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Breakdown>) {
            state = { [action.payload.breakdownID]: action.payload, ...state }
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