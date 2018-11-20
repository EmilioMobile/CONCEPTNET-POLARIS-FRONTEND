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
      const re = msg.content.split('"');
      let answer = '';
      for (let i = 0; i < re.length; i++) {
        if (re[i] === 'surfaceText') {
        console.log(re[i + 2]);
        }
      }

      for (let i = 0; i < re.length; i++) {
        if (re[i] === 'surfaceText') {
        console.log(re[i + 2]);
        answer = re[i + 2];
        break;
        }
      }
      msg.content = answer;
    }

    console.log(msg);
    this.conversation.next([msg]);
  }

  converse(msg: string) {

    const userMessage = new Message('PolarisX', msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
          .then(res => {
            console.log(res);
            const kk = res.result.fulfillment;
            const speech = res.result.fulfillment.speech;
            let sourcea = '';
            if (kk['source']) {
              sourcea = kk['source'];
            }
            const botMessage = new Message(sourcea, speech, 'bot');
            this.update(botMessage);
          });
  }

  talk() {
    this.client.textRequest('Who are you')
      .then(res => console.log(res));
  }
}

