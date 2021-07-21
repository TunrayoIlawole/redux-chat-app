import { Component, OnInit, Inject } from '@angular/core';
import { AppStore } from '../app.store';
import * as Redux from 'redux';
import { Thread } from '../thread/thread.model';
import * as ThreadsActions from '../thread/thread.actions';
import { AppState } from '../app.reducer';
import { getCurrentThread, getAllThreads } from '../thread/threads.reducer';

@Component({
  selector: 'chat-threads',
  templateUrl: './chat-threads.component.html',
  styleUrls: ['./chat-threads.component.css']
})
export class ChatThreadsComponent implements OnInit {
  threads: Thread[];
  currentThreadId; string;

  constructor(@Inject(AppStore) private store: Redux.Store<AppState>) {
    store.subscribe(() => this.updateState());
    this.updateState();
   }

  ngOnInit(): void {
  }

  updateState() {
    const state = this.store.getState();

    // store the threads list
    this.threads = getAllThreads(state);

    // We want to mark the current thread as selected.
    // so we store the currentThreadId as a value
    this.currentThreadId = getCurrentThread(state).id;
  }

  handleThreadClicked(thread: Thread) {
    this.store.dispatch(ThreadsActions.selectThread(thread));
  }

}
