import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { AppState } from '../app.reducer';
import { AppStore } from '../app.store';
import * as Redux from 'redux';
import { Thread } from '../thread/thread.model';
import { User } from '../user/user.model';
import { getCurrentThread } from '../thread/threads.reducer';
import * as ThreadActions from '../thread/thread.actions';
import { getCurrentUser } from '../user/users.reducer';

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  currentThread: Thread;
  draftMessage: { text: string };
  currentUser: User;

  constructor(@Inject(AppStore) private store: Redux.Store<AppState>, private el: ElementRef) {
    store.subscribe(() => this.updateState());
    this.updateState();
    this.draftMessage = { text: '' };
   }

  ngOnInit(): void {
  }

  updateState() {
    const state = this.store.getState();
    this.currentThread = getCurrentThread(state);
    this.currentUser = getCurrentUser(state);
    this.scrollToBottom();
  }

  scrollToBottom() {
    const scrollPane: any = this.el.nativeElement.querySelector('msg-container-base');
    if (scrollPane) {
      setTimeout(() => scrollPane.scrollTop = scrollPane.scrollHeight);
    }
  }

  sendMessage(): void {
    this.store.dispatch(ThreadActions.addMessage(
      this.currentThread,
      {
        author: this.currentUser,
        isRead: true,
        text: this.draftMessage.text
      }
    ));
    this.draftMessage = { text: '' };
  }

  onEnter(event: any): void {
    this.sendMessage();
    event.preventDefault();
  }

}

