import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { courses } from "../../backend/database";
import { Course } from "../../data/types";

/**
 * Redux Section
 */
export interface CoursesState {
    [courseID: string]: Course
}

const initialState: CoursesState = courses.reduce((r, course) => ({
    ...r,
    [course.courseID]: course
}), {});

const coursesRedux = createSlice({
    name: "COURSES",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Course>) {
            console.timeLog('Event', 'Course added', action.payload);
            state[action.payload.courseID] = action.payload;
        },
        edit(state, action: PayloadAction<Course>) {
            console.timeLog('Event', 'Course edited', action.payload);
            state[action.payload.courseID] = action.payload;
        }
    }
});

export const {
    add,
    edit
} = coursesRedux.actions;

export default coursesRedux.reducer;