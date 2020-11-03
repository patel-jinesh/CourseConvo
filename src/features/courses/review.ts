import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Review } from "../../data/types";
import { reviews } from "../../backend/database";

/**
 * Redux Section
 */
export interface ReviewsState {
    [recordID: string]: Review
}

const initialState: ReviewsState = reviews.reduce((r, v) => ({
    ...r,
    [v.reviewID]: v
}), {})

const reviewsRedux = createSlice({
    name: "REVIEWS",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Review>) {
            state = { [action.payload.reviewID]: action.payload, ...state}
        },
        edit(state, action: PayloadAction<Review>) {
            state[action.payload.reviewID] = action.payload;
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