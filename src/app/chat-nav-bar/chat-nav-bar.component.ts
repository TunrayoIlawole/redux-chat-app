import { Component, OnInit, Inject } from '@angular/core';
import { AppStore } from '../app.store';
import * as Redux from 'redux';
import { AppState } from '../app.reducer';
import { getUnreadMessagesCount } from '../thread/threads.reducer';

@Component({
  selector: 'chat-nav-bar',
  templateUrl: './chat-nav-bar.component.html',
  styleUrls: ['./chat-nav-bar.component.css']
})
export class ChatNavBarComponent implements OnInit {
  unreadMessagesCount: number;

  constructor(@Inject(AppStore) private store: Redux.Store<AppState>) {
    // subscribe to any changes in the store
    store.subscribe(() => this.updateState());
    this.updateState();
   }

  ngOnInit(): void {
  }

  updateState() {
    this.unreadMessagesCount = getUnreadMessagesCount(this.store.getState());
  }

}

// We call this.updateState() after subscribe because we want to make sure this component is initialized with the most recent data. .subscribe will only be called if something changes after this component is initialized.
