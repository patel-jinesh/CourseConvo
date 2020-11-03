import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course, Term } from "../../data/types";
import { courses } from "../../backend/database"

/**
 * Redux Section
 */
export interface CoursesState {
    [courseID: string]: Course
}

const initialState: CoursesState = courses.reduce((r, v) => ({
    ...r,
    [v.courseID]: v
}), {})

const coursesRedux = createSlice({
    name: "COURSES",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Course>) {
            state = { [action.payload.courseID]: action.payload, ...state };
        },

        edit(state, action: PayloadAction<Course>) {
            state[action.payload.courseID] = action.payload;
        }
    }
});

export const {
    add,
    edit
} = coursesRedux.actions;

export default coursesRedux.reducer;