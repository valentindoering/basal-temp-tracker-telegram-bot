import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';


interface config {

    telegramBotKey: string;
    telegramChatId: string;
    openAiApiKey: string;
}

dotenv.config();

function getParentObject(object: any) {
    const keys = Object.keys(object);
    return object[keys[keys.length - 1]];
}


function yamlToJs(yamlString: string) {
    const lines = yamlString.split(/\r?\n/);
    const result = {};
  
    let currentObject: any = result;
    let currentIndent = -1;
  
    for (const line of lines) {
      const indent = line.search(/\S/);
  
      if (indent > currentIndent) {
        // Move down one level
        const key = Object.keys(currentObject)[Object.keys(currentObject).length - 1];
        currentObject = currentObject[key] = {};
        currentIndent = indent;
      } else if (indent < currentIndent) {
        // Move up one or more levels
        const levels = (currentIndent - indent) / 2 + 1;
        for (let i = 0; i < levels; i++) {
          currentObject = getParentObject(currentObject);
          currentIndent -= 2;
        }
      }
  
      const keyValue = line.trim().split(': ');
      const key = keyValue[0];
      const value = keyValue[1];
  
      if (value) {
        // Convert value to number or boolean if possible
        const num = Number(value);
        if (!isNaN(num)) {
          currentObject[key] = num;
        } else if (value === 'true' || value === 'false') {
          currentObject[key] = (value === 'true');
        } else {
          currentObject[key] = value;
        }
      } else {
        // Start new object
        currentObject[key] = {};
      }
    }
    
    // @ts-ignore
    return result[Object.keys(result)[0]];
  }
  


function envNullSave(envVarName: string): string {
    let value: string | undefined = process.env[envVarName]
    if (!value) {
        throw new Error(`${envVarName} is null`)
    }
    return value
}

const filePath = path.join('../config.yml');
const fileContents = fs.readFileSync(filePath, 'utf8');
const configObject = yamlToJs(fileContents) as config;

export const telegramBotKey = envNullSave(configObject.telegramBotKey); 
export const telegramChatId = Number(envNullSave(configObject.telegramChatId));
export const openAiApiKey = envNullSave(configObject.openAiApiKey);
