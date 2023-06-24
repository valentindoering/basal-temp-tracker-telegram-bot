import { telegramBotKey, telegramChatId, openAiApiKey } from '../src/config.js';
import TelegramBot from 'node-telegram-bot-api'
// import { Logbook } from './logbook.js';
import axios from 'axios';
import fs from 'fs';
import { convertToMp3 } from '../src/convert.js';

let bot = new TelegramBot(telegramBotKey, {polling: true});
// let openai = new OpenAI(openAiApiKey)

function onText(text: string, sendMessage: (txt: string) => void) {
  sendMessage("got text")
}


function onVoice(path: string, sendMessage: (txt: string) => void) {
  sendMessage(`got ${path}`)
}


bot.on('message', async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    if (chatId !== telegramChatId) {
        console.log("chatId !== telegramChatId");
        return;
    }

    let text = msg.text?.toString()
    let voiceId = msg.voice?.file_id
    if (text) { 
      onText(text, (txt: string) => bot.sendMessage(telegramChatId, txt));
    } else if (voiceId) {

      const basePath = `../../files/${Math.floor(new Date().getTime())}__${voiceId}.`
      const outPath = basePath + 'ogg'
      const convertedPath = basePath + 'mp3'

      const fileInfo = await bot.getFile(voiceId)
      const voiceUrl = `https://api.telegram.org/file/bot${telegramBotKey}/${fileInfo.file_path}`;
      const response = await axios({method: 'get', url: voiceUrl, responseType: 'stream'})
      const writer = fs.createWriteStream(outPath);
      // response.data.pipe(writer);

      // await response.data.pipe(writer).promise();
      // const writer = fs.createWriteStream(outPath);
      await new Promise((resolve, reject) => {
        return response.data.pipe(writer)
          .on('finish', () => {
            console.log('Voice message downloaded!');
            resolve(undefined);
          })
          .on('error', reject);
      });

      await convertToMp3(outPath, convertedPath) // after this statement nothing gets executed!

      // delete file
      try {
        // console.log(`deletion part ${outPath}`)
        fs.unlinkSync(outPath)
      } catch(err) {
        console.log("deletion not successful")
        console.error(err)
      }

      // callback
      onVoice(convertedPath, (txt: string) => bot.sendMessage(telegramChatId, txt))

    } else {
      console.log("format not supported")
    }
    
});