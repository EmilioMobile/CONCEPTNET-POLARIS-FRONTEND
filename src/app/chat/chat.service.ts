import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Message {
  constructor(public source: string, public content: string, public sentBy: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);
  constructor() {}

  // Adds message to source
  update(msg: Message) {
    if (msg.sentBy === 'bot' && msg.source === 'CONCEPTNET') {
      console.log('CONCEPTNET: ', msg.content);
    }
    this.conversation.next([msg]);
  }

  converse(msg: string) {

    const userMessage = new Message('PolarisX', msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
          .then(res => {
            console.log(res);
            const fullfilment = res.result.fulfillment;
            const speech = res.result.fulfillment.speech;
            let source = '';
            if (fullfilment['source']) {
              source = fullfilment['source'];
            }
            const botMessage = new Message(source, speech, 'bot');
            this.update(botMessage);
          });
  }

  talk() {
    this.client.textRequest('Who are you')
      .then(res => console.log(res));
  }
}

