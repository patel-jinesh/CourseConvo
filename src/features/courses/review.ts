import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Review } from "../../data/types";
import { reviews } from "../../backend/database";
import { stat } from "fs";
import { act } from "react-dom/test-utils";

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
            state[action.payload.reviewID] = action.payload;
        },
        edit(state, action: PayloadAction<Review>) {
            state[action.payload.reviewID] = action.payload;
        },
        remove(state, action: PayloadAction<string>) {
            delete state[action.payload];
        },
        upvote(state, action: PayloadAction<{ reviewID: string, userID: string }>) {
            state[action.payload.reviewID].upvoterIDs[action.payload.userID] = true;
            delete state[action.payload.reviewID].downvoterIDs[action.payload.userID];
        },
        downvote(state, action: PayloadAction<{ reviewID: string, userID: string }>) {
            state[action.payload.reviewID].downvoterIDs[action.payload.userID] = true;
            delete state[action.payload.reviewID].upvoterIDs[action.payload.userID];
        }
    }
});

export const {
    add,
    edit,
    remove,
    upvote,
    downvote,
} = reviewsRedux.actions;

export default reviewsRedux.reducer;