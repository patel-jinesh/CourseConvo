import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../data/types";
import { users } from "../../backend/database";

/**
 * Redux Section
 */
export interface UsersState {
    [userID: string]: User
}

const initialState: UsersState = users.reduce((r, v) => ({
    ...r,
    [v.userID]: v
}), {})

const usersRedux = createSlice({
    name: "COURSES",
    initialState,
    reducers: {}
});

export const {} = usersRedux.actions;

export default usersRedux.reducer;