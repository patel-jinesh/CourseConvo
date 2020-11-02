import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status, Record } from "../../data/types";

/**
 * Redux Section
 */
export interface Records {
    [recordID: string]: Record
}

export enum RecordActions {
    ADD = "ADD",
    EDIT = "EDIT",
    DELETE = "DELETE"
}

const initialState: Records = {
    "record": {
        recordID: "record",
        courseID: "rando",
        status: Status.IN_PROGRESS
    },
    "record1": {
        recordID: "record1",
        courseID: "rando1",
        status: Status.TAKEN
    },
    "record2": {
        recordID: "record2",
        courseID: "rando1",
        status: Status.TAKEN
    },
    "record3": {
        recordID: "record3",
        courseID: "rando1",
        status: Status.TAKEN
    },
    "record4": {
        recordID: "record4",
        courseID: "rando1",
        status: Status.TAKEN
    },
    "record5": {
        recordID: "record5",
        courseID: "rando1",
        status: Status.TAKEN
    }
};

const recordsRedux = createSlice({
    name: "RECORDS",
    initialState,
    reducers: {
        add(state, action: PayloadAction<Record>) {
            state = { [action.payload.recordID]: action.payload, ...state }
        },
        edit(state, action: PayloadAction<Record>) {
            state[action.payload.recordID] = action.payload;
        },
        remove(state, action: PayloadAction<string>) {
            console.log("here");
            delete state[action.payload];
        }
    }
});

export const {
    add,
    edit,
    remove
} = recordsRedux.actions;

export default recordsRedux.reducer;