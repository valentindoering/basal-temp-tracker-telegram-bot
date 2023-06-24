import TelegramBot from 'node-telegram-bot-api'
// import { Logbook } from './logbook.js';
import axios from 'axios';
import fs from 'fs';
import { convertToMp3 } from './convert.js';
import { OpenAI, Message } from './openai.js';

export class TelegramClient {
    private bot: TelegramBot;
    private openai: OpenAI;

    private telegramBotKey: string;
    private telegramChatId: number;

    constructor(telegramChatId: number, telegramBotKey: string, openAI: OpenAI) {
        this.telegramBotKey = telegramBotKey;
        this.telegramChatId = telegramChatId;

        this.bot = new TelegramBot(telegramBotKey, { polling: true });
        this.openai = openAI;
    }

    public async runPolling(onMessage: (text: string) => Promise<void>) {


        this.bot.on('message', async (msg: TelegramBot.Message) => {
            const chatId = msg.chat.id;
            if (chatId !== this.telegramChatId) {
                console.log("chatId !== telegramChatId");
                return;
            }

            let text = msg.text?.toString()
            let voiceId = msg.voice?.file_id
            if (text) {
                await onMessage(text);
            } else if (voiceId) {

                const basePath = `../../files/${Math.floor(new Date().getTime())}__${voiceId}.`
                const outPath = basePath + 'ogg'
                const convertedPath = basePath + 'mp3'

                const fileInfo = await this.bot.getFile(voiceId)
                const voiceUrl = `https://api.telegram.org/file/bot${this.telegramBotKey}/${fileInfo.file_path}`;
                const response = await axios({ method: 'get', url: voiceUrl, responseType: 'stream' })
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
                } catch (err) {
                    console.log("deletion not successful")
                    console.error(err)
                }

                // callback
                let transcribedText = await this.openai.transcribe(convertedPath)
                await onMessage(transcribedText)

                // delete even the converted file
                try {
                    // console.log(`deletion part ${outPath}`)
                    fs.unlinkSync(convertedPath)
                } catch (err) {
                    console.log("deletion not successful")
                    console.error(err)
                }

            } else {
                console.log("format not supported")
            }

        });
    }

    public async sendText(text: string): Promise<TelegramBot.Message> {
        return this.bot.sendMessage(this.telegramChatId, text)
    }

    public async sendVoiceMessage(voicePath: string): Promise<TelegramBot.Message> {
        return this.bot.sendVoice(this.telegramChatId, voicePath)
    }

    public async sendImage(imagePath: string): Promise<TelegramBot.Message> {
        return this.bot.sendPhoto(this.telegramChatId, imagePath)
    }
}



