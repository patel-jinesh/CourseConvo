import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { reviews } from "../../backend/database";
import { Review } from "../../data/types";

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
        add(state, action: PayloadAction<Omit<Review, "datetime" | "reviewID">>) {
            let reviewID = uuidv4();
            state[reviewID] = {
                reviewID: reviewID,
                ...action.payload,
                datetime: moment().valueOf(),
            };
        },
        edit(state, action: PayloadAction<Omit<Review, "datetime">>) {
            state[action.payload.reviewID] = {
                ...action.payload,
                datetime: moment().valueOf()
            }
        },
        remove(state, action: PayloadAction<string>) {
            delete state[action.payload];
        },
        reply(state, action: PayloadAction<{ reviewID: string, userID: string, comment: string }>) {
            state[action.payload.reviewID].replies.push({
                userID: action.payload.userID,
                datetime: moment().valueOf(),
                comment: action.payload.comment
            });
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