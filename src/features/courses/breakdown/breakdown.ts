import { Course } from "../course";
import { User } from "../../user/user"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Mark {
    type: string;
    weight: number;
    count: number;
}

export interface Breakdown {
    id: string,
    course: Course;
    user: User;
    marks: Mark[];
    isAnonymous: boolean;
}

/**
 * Redux Section
 */
export interface BreakdownsState {
    [id: string]: Breakdown
}

export enum BreakdownActions {
    ADD = "ADD",
    EDIT = "EDIT",
    DELETE = "DELETE"
}

const initialState: BreakdownsState = {};

const breakdownsRedux = createSlice({
    name: "REVIEWS",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Breakdown>) {
            state = { [action.payload.id]: action.payload, ...state }
        },
        edit(state, action: PayloadAction<Breakdown>) {
            state[action.payload.id] = action.payload;
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