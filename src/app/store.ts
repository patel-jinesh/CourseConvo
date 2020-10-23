import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from '../features/courses/course';
import reviewsReducer from '../features/courses/review/review';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    reviews: reviewsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;