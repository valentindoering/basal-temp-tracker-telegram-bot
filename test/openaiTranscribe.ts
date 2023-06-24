import { openAiApiKey } from '../src/config.js';
import { OpenAI } from '../src/openai.js';

let openai = new OpenAI(openAiApiKey)

let text = await openai.transcribe('../../files/sample/sample.mp3')
console.log(text)