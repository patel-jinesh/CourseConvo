import { Course } from "../course";
import { User } from "../../user/user"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Review {
    id: string,
    difficulty: number;
    enjoyability: number;
    workload: number;
    comment: string;
    course: Course;
    user: User;
    isAnonymous: boolean;
};

/**
 * Redux Section
 */
export interface ReviewsState {
    [id: string]: Review
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
            state = { [action.payload.id]: action.payload, ...state}
        },
        edit(state, action: PayloadAction<Review>) {
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
} = reviewsRedux.actions;

export default reviewsRedux.reducer;