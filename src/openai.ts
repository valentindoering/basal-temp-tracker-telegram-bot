import openai from 'openai';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export interface Message {
  role: string;
  content: string;
}

interface CompletionRequest {
  model: string;
  messages: Message[];
  temperature: number;
}


interface CompletionResponse {
  choices: {
    message: Message;
  }[];
}

export class OpenAI {
    apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async transcribe(pathToMp3: string): Promise<string> {
        const url = 'https://api.openai.com/v1/audio/transcriptions';
        const form = new FormData();
        form.append('file', fs.createReadStream(pathToMp3));
        form.append('model', 'whisper-1');

        const response = await axios.post(url, form, {
            headers: {
            'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
            'Authorization': `Bearer ${this.apiKey}`,
            },
        });

        return response.data.text;
    }

    async answer(messages: Message[]): Promise<Message> {
        const completionRequest: CompletionRequest = {
          model: 'gpt-3.5-turbo',
          messages,
          temperature: 0.7,
        };
        
        console.log("completionRequest ------------------------------------------------------------------\n\n", completionRequest)
        console.log("------------------------------------------------------------------\n\n\n")
        
        const response = await axios.post<CompletionResponse>(
          'https://api.openai.com/v1/chat/completions',
          completionRequest,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.apiKey}`,
            },
          }
        );
        
        return response.data.choices[0].message
      }
    
      async oneAnswer(text: string): Promise<string> {
        const messages: Message[] = [{"role": "user", "content": text}]
        const answerMessage: Message = await this.answer(messages)
        return answerMessage.content
      }


}