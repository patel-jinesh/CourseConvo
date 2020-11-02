import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course, Term } from "../../data/types";

/**
 * Redux Section
 */
export interface CoursesState {
    [courseID: string]: Course
}

export enum CourseActions {
    ADD = "ADD",
    EDIT = "EDIT"
}

const initialState: CoursesState = {
    "rando": {
        courseID: "rando",
        instructor: "Kevin Browne",
        name: "HCI",
        semester: {
            term: Term.FALL,
            year: 2020
        },
        identifier: {
            code: "4HC3",
            subject: "SFWRENG",
        }
    },
    "rando1": {
        courseID: "rando1",
        instructor: "Kevin Browne",
        name: "HCI",
        semester: {
            term: Term.FALL,
            year: 2021
        },
        identifier: {
            code: "4HC3",
            subject: "SFWRENG",
        }
    }
};

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