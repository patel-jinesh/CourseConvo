import { createSlice } from "@reduxjs/toolkit";
import { users } from "../../backend/database";
import { User } from "../../data/types";

/**
 * Redux Section
 */
export interface UsersState {
    [userID: string]: User
}

const initialState: UsersState = users.reduce((r, user) => ({
    ...r,
    [user.userID]: user
}), {})

const usersRedux = createSlice({
    name: "USERS",
    initialState,
    reducers: {}
});

// export const {} = usersRedux.actions;

export default usersRedux.reducer;