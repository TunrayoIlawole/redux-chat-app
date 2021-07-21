import { Action } from "redux";
import { createSelector } from "reselect";

import { Thread } from "./thread.model";
import * as ThreadsActions from './thread.actions';
import { Message } from "../message/message.model";

export interface ThreadsEntities {
    [id: string]: Thread;
}

export interface ThreadsState {
    ids: string[];
    entities: ThreadsEntities;
    currentThreadId?: string;
}

const initialState: ThreadsState = {
    ids: [],
    entities: {},
    currentThreadId: null
}

export const ThreadsReducer = function(state: ThreadsState = initialState, action: Action): ThreadsState {
    switch(action.type) {
        case ThreadsActions.ADD_THREAD:
            const thread = (<ThreadsActions.AddThreadAction>action).thread;

            if (state.ids.includes(thread.id)) {
                return state;
            }

            return {
                ids: [ ...state.ids, thread.id ],
                entities: Object.assign({}, state.entities, {
                    [thread.id]: thread
                }),
                currentThreadId: state.currentThreadId,
            };

        case ThreadsActions.ADD_MESSAGE: {
            const thread = (<ThreadsActions.AddMessageAction>action).thread;

            const message = (<ThreadsActions.AddMessageAction>action).message;

            // If the message being added is in the current thread, then mark it as read.
            const isRead = message.thread.id === state.currentThreadId ? true: message.isRead;

            const newMessage = Object.assign({}, message, { isRead: isRead });

            // grab the old thread from entities
            const oldThread = state.entities[thread.id];

            // create a new thread which has our newMessage
            const newThread = Object.assign({}, oldThread, {
                messages: [...oldThread.messages, newMessage]
            });

            return {
                ids: state.ids,
                currentThreadId: state.currentThreadId,
                entities: Object.assign({}, state.entities, {
                    [thread.id]: newThread
                })
            };
        }

        case ThreadsActions.SELECT_THREAD: {
            const thread = (<ThreadsActions.SelectThreadAction>action).thread;
            const oldThread = state.entities[thread.id];

            // mark the messages as read
            const newMessages = oldThread.messages.map(
                (message) => Object.assign({}, message, { isRead: true })
            );

            // give them to this new thread
            const newThread = Object.assign({}, oldThread, {
                messages: newMessages
            });

            return {
                ids: state.ids,
                currentThreadId: thread.id,
                entities: Object.assign({}, state.entities, {
                    [thread.id]: newThread
                })
            };
        }

        default:
            return state;

    }
}

export const getThreadsState = (state): ThreadsState => state.threads;

export const getThreadsEntities = createSelector(getThreadsState, ( state: ThreadsState ) => state.entities);

export const getCurrentThread = createSelector(
    getThreadsEntities,
    getThreadsState,
    ( entities: ThreadsEntities, state: ThreadsState ) => entities[state.currentThreadId]
);

export const getAllThreads = createSelector(
    getThreadsEntities,
    ( entities: ThreadsEntities ) => Object.keys(entities).map((threadId) => entities[threadId])
);

export const getUnreadMessagesCount = createSelector(
    getAllThreads,
    ( threads: Thread[] ) => threads.reduce(
        (unreadCount: number, thread: Thread) => {
            thread.messages.forEach((message: Message) => {
                if (!message.isRead) {
                    ++unreadCount;
                }
            });
            return unreadCount
        },
    0)
);