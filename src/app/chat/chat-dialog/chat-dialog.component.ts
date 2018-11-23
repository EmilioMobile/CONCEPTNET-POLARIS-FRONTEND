import { Component, OnInit, OnChanges, AfterViewInit, AfterContentInit, DoCheck, OnDestroy, AfterContentChecked,
          AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatDialogComponent implements OnInit, AfterViewInit, AfterContentInit,
                                      OnChanges, DoCheck, OnDestroy, AfterContentChecked, AfterViewChecked {

  messages: Observable<Message[]>;
  formValue = '';
  container: HTMLElement;
  DEBUG = false;
  WelcomeMessage = 'Hello, I am PolarisX, you can ask me about things ...';

  constructor(public chat: ChatService) {}

  ngOnInit() {
    this.debug('ngOnInit');
    this.messages = this.chat.conversation.asObservable()
      .scan((messages, text) => messages.concat(text));
  }

  ngAfterViewInit() {
    this.debug('ngAfterViewInit');
  }

  ngAfterContentInit() {
    this.debug('ngAfterContentInit');
  }

  ngAfterContentChecked() {
    this.debug('ngAfterContentChecked');
  }

  ngAfterViewChecked() {
    this.debug('ngAfterViewChecked');
    this.updateScroll();
  }

  ngOnDestroy() {
    this.debug('ngOnDestroy');
  }

  ngOnChanges() {
    this.debug('ngOnChanges');
  }

  ngDoCheck() {
    this.debug('ngDoCheck');
  }

  sendMessage() {
    if (this.formValue !== '' && this.formValue !== undefined) {
      this.chat.converse(this.formValue);
      this.formValue = '';
    }
  }

  updateScroll() {
    this.container = document.getElementById('messages-container');
    this.container.scrollTop = this.container.scrollHeight;
  }

  debug(message) {
    if (this.DEBUG === true) {
      console.log(message);
    }
  }

  public highlight(message) {
    if (message.sentBy === 'bot') {
      return message.content.replace(new RegExp(/\[\[.*?\]\]/, 'gi'), match => {
          return '<span class="highlightText">' + match + '</span>';
      });
    } else {
      return message.content;
    }
  }
}
