import { telegramBotKey, telegramChatId } from '../src/config.js';
import TelegramBot from 'node-telegram-bot-api'

let bot = new TelegramBot(telegramBotKey, {polling: true});

bot.on('message', (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    if (chatId !== telegramChatId) {
        console.log("chatId !== telegramChatId");
        return;
    }
    let text = msg.text?.toString()
    if (!text) { 
        console.log("!text");
        return; 
    }
    bot.sendMessage(telegramChatId, text);
});