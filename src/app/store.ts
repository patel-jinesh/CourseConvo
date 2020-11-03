/**
 * The Redux Store of the application. 
 * The redux store is where the state of the application lives.
 * It contains primarily the buisness logic of the application.
 * UI state should typically not be included in the redux store, it should live in the component state.
 */

import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from '../features/courses/course';
import reviewsReducer from '../features/courses/review';
import recordsReducer from '../features/courses/record';
import breakdownsReducer from '../features/courses/breakdown';
import usersReducer from '../features/user/user';

/**
 * The Redux store variable created from the combination of all the individual slices.
 */
export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    reviews: reviewsReducer,
    breakdowns: breakdownsReducer,
    records: recordsReducer,
    users: usersReducer,
  },
});

/**
 * The type that represents the state of the whole application.
 */
export type RootState = ReturnType<typeof store.getState>;