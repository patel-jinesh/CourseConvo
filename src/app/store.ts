import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from '../features/courses/course';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
  },
});

/**
 * For hot reload purposes only.
 */
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
  })
}

export type RootState = ReturnType<typeof store.getState>;