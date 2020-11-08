import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Review } from "../../data/types";
import { reviews } from "../../backend/database";
import { stat } from "fs";
import { act } from "react-dom/test-utils";
import moment from "moment";

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
        reply(state, action: PayloadAction<{ reviewID: string, userID: string, comment: string }>) {
            state[action.payload.reviewID].replies[action.payload.userID] = {
                datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                comment: action.payload.comment
            }
        },
        unreply(state, action: PayloadAction<{ reviewID: string, userID: string }>) {
            delete state[action.payload.reviewID].replies[action.payload.userID];
        },
        upvote(state, action: PayloadAction<{ reviewID: string, userID: string }>) {
            state[action.payload.reviewID].upvoterIDs[action.payload.userID] = true;
            delete state[action.payload.reviewID].downvoterIDs[action.payload.userID];
        },
        downvote(state, action: PayloadAction<{ reviewID: string, userID: string }>) {
            state[action.payload.reviewID].downvoterIDs[action.payload.userID] = true;
            delete state[action.payload.reviewID].upvoterIDs[action.payload.userID];
        },
        unvote(state, action: PayloadAction<{ reviewID: string, userID: string }>) {
            delete state[action.payload.reviewID].upvoterIDs[action.payload.userID];
            delete state[action.payload.reviewID].downvoterIDs[action.payload.userID];
        }
    }
});

export const {
    add,
    edit,
    remove,
    upvote,
    downvote,
    reply,
    unvote
} = reviewsRedux.actions;

export default reviewsRedux.reducer;