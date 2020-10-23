import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Semester {
    FALL,
    WINTER,
    SPRING,
    SUMMER
};

export interface Course {
    id: number;
    code: string;
    instructor: string;
    semester: Semester;
    year: number;
};

/**
 * Redux Section
 */
export interface CoursesState {
    courses: { [index: number]: Course },
}

export enum CourseActions {
    ADD = "ADD",
    EDIT = "EDIT"
}

const initialState: CoursesState = {
    courses: [],
};

const coursesRedux = createSlice({
    name: "COURSES",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Course>) {
            state.courses = { [action.payload.id]: action.payload, ...state.courses };
        },

        edit(state, action: PayloadAction<Course>) {
            state.courses[action.payload.id] = action.payload;
        }
    }
});

export const {
    add,
    edit
} = coursesRedux.actions;

export default coursesRedux.reducer;