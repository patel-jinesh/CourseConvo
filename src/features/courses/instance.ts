import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { instances } from "../../backend/database";
import { CourseInstance } from "../../data/types";

/**
 * Redux Section
 */
export interface CourseInstancesState {
    [instanceID: string]: CourseInstance
}

const initialState: CourseInstancesState = instances.reduce((r, instance) => ({
    ...r,
    [instance.instanceID]: instance
}), {});

const instancesRedux = createSlice({
    name: "COURSES",
    initialState,
    reducers: {
        add(state, action: PayloadAction<CourseInstance>) {
            state[action.payload.instanceID] = action.payload;
        },
        edit(state, action: PayloadAction<CourseInstance>) {
            state[action.payload.instanceID] = action.payload;
        },
    }
});

export const {
    add,
    edit
} = instancesRedux.actions;

export default instancesRedux.reducer;