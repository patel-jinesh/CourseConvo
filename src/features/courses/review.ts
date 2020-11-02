import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Review } from "../../data/types";

/**
 * Redux Section
 */
export interface ReviewsState {
    [recordID: string]: Review
}

export enum ReviewActions {
    ADD = "ADD",
    EDIT = "EDIT",
    DELETE = "DELETE"
}

const initialState: ReviewsState = {};

const reviewsRedux = createSlice({
    name: "REVIEWS",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Review>) {
            state = { [action.payload.recordID]: action.payload, ...state}
        },
        edit(state, action: PayloadAction<Review>) {
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
} = reviewsRedux.actions;

export default reviewsRedux.reducer;