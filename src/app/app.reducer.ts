import { combineReducers, Reducer } from "redux";
import { ThreadsReducer, ThreadsState } from "./thread/threads.reducer";
import { UsersReducer, UsersState } from "./user/users.reducer";
export * from './user/users.reducer';
export * from './thread/threads.reducer';


// An interface that holds all the states in the app
export interface AppState {
    users: UsersState;
    threads: ThreadsState;
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
    users: UsersReducer,
    threads: ThreadsReducer
});

export default rootReducer;