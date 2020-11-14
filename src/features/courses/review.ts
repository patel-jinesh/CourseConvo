import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { reviews } from "../../backend/database";
import { Review, ReviewTag } from "../../data/types";

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
            console.timeLog('Event', 'Review added', action.payload);
            let reviewID = uuidv4();
            state[reviewID] = {
                reviewID: reviewID,
                ...action.payload,
                datetime: moment().valueOf(),
            };
        },
        edit(state, action: PayloadAction<Omit<Review, "datetime">>) {
            console.timeLog('Event', 'Review edited', action.payload);
            state[action.payload.reviewID] = {
                ...action.payload,
                datetime: moment().valueOf()
            }
        },
        remove(state, action: PayloadAction<string>) {
            console.timeLog('Event', 'Review deleted', action.payload);
            delete state[action.payload];
        },
        reply(state, action: PayloadAction<{ reviewID: string, userID: string, comment: string }>) {
            console.timeLog('Event', 'Review replied', action.payload);
            state[action.payload.reviewID].replies.push({
                userID: action.payload.userID,
                datetime: moment().valueOf(),
                comment: action.payload.comment
            });
        },
        upvote(state, action: PayloadAction<{ reviewID: string, userID: string }>) {
            console.timeLog('Event', 'Review upvoted', action.payload);
            state[action.payload.reviewID].upvoterIDs[action.payload.userID] = true;
            delete state[action.payload.reviewID].downvoterIDs[action.payload.userID];
        },
        downvote(state, action: PayloadAction<{ reviewID: string, userID: string }>) {
            console.timeLog('Event', 'Review downvoted', action.payload);
            state[action.payload.reviewID].downvoterIDs[action.payload.userID] = true;
            delete state[action.payload.reviewID].upvoterIDs[action.payload.userID];
        },
        unvote(state, action: PayloadAction<{ reviewID: string, userID: string }>) {
            console.timeLog('Event', 'Review unvoted', action.payload);
            delete state[action.payload.reviewID].upvoterIDs[action.payload.userID];
            delete state[action.payload.reviewID].downvoterIDs[action.payload.userID];
        },
        tag(state, action: PayloadAction<{ reviewID: string, userID: string, tag: ReviewTag }>) {
            console.timeLog('Event', 'Review tagged', action.payload);
            state[action.payload.reviewID].tags[action.payload.tag][action.payload.userID] = true;
        },
        untag(state, action: PayloadAction<{ reviewID: string, userID: string, tag: ReviewTag }>) {
            console.timeLog('Event', 'Review untagged', action.payload);
            delete state[action.payload.reviewID].tags[action.payload.tag][action.payload.userID];
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
    unvote,
    tag,
    untag
} = reviewsRedux.actions;

export default reviewsRedux.reducer;