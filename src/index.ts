import { telegramBotKey, telegramChatId, openAiApiKey } from './config.js';
import { TelegramClient } from './telegram.js';
import { OpenAI, Message } from './openai.js';
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';

import csvParse from 'csv-parser';
import { plot } from 'nodeplotlib';
import { spawn } from "child_process";
import { drawGraph } from './graph.js';
import { readCsv } from './csv.js';
import schedule from 'node-schedule';


const openAi = new OpenAI(openAiApiKey)
const telegram = new TelegramClient(telegramChatId, telegramBotKey, openAi);

async function executePythonScript(scriptName: string, args: string[]): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const pythonProcess = spawn("python3", [scriptName, ...args]);

    let result = "";

    pythonProcess.stdout.on("data", (data: string) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data: string) => {
      reject(data.toString());
    });

    pythonProcess.on("close", (code: number) => {
      if (code === 0) {
        resolve(result);
      } else {
        reject(`Python script returned with error code: ${code}`);
      }
    });
  });
}


function parseTemperatureComment(text: string): [number, string] {
  const lines = text.split("\n");

  const temperature = parseFloat(lines[0].split(" ")[1]);
  const comment = lines[1]

  return [temperature, comment];
}

function newDataEntry(temperature: number, comment: string): string {
  const date = new Date();

  const timestamp = date.toISOString();
  const daysSinceMay1 = Math.floor((date.getTime() - new Date(date.getFullYear(), 4, 1).getTime()) / (24 * 60 * 60 * 1000));

  const data = `${timestamp},${daysSinceMay1},${temperature},${comment}\n`;

  fs.appendFileSync("../data.csv", data);
  return data;
}



async function onMessage(text: string): Promise<void> {
  
  // Only trigger on new data entries
  if (text.startsWith("T ")) {
    
    // save new data entry, confirm
    let temperature: number | undefined = undefined;
    let comment: string | undefined = undefined;
    try {
      let temperatureComment = parseTemperatureComment(text);
      temperature = temperatureComment[0];
      comment = temperatureComment[1];
    } catch (e) {
      console.log(e);
      telegram.sendText("Error parsing temperature comment " + e);
      return;
    }
    if (temperature === undefined || comment === undefined) {
      telegram.sendText("Error parsing temperature comment");
      return;
    }

    if (temperature < 35 || temperature > 42) {
      telegram.sendText("Temperature out of range");
      return;
    }
    
    const dataEntry = newDataEntry(temperature, comment);
    telegram.sendText("New data entry: " + dataEntry);


    // create visualization
    const outPath = "../files/tmp.jpg"
    const [x, y] = readCsv("../data.csv");
    drawGraph(x, y, outPath);

    // send visualization
    telegram.sendImage(outPath);

    // I dont need to delete, I just overwrite
    // delete visualization
    // fs.unlinkSync(outPath);
  }
}

telegram.runPolling(onMessage);

const job = schedule.scheduleJob('0 6 * * *', function() {
  telegram.sendText("Good morning! Let's measure the temperature :)");
});
