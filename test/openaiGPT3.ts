import { openAiApiKey } from '../src/config.js';
import { OpenAI } from '../src/openai.js';

let openai = new OpenAI(openAiApiKey)

let messages = [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "What is 4 + 89?"}]
let answer = await openai.answer(messages)
console.log(answer)
