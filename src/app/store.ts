import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from '../features/courses/course';
import reviewsReducer from '../features/courses/review';
import recordsReducer from '../features/courses/record';
import breakdownsReducer from '../features/courses/breakdown';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    reviews: reviewsReducer,
    breakdowns: breakdownsReducer,
    records: recordsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;