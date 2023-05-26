import { resolve } from 'node:path';
import { createReadStream } from 'node:fs';
import { StringDecoder } from 'node:string_decoder';
import { readdir, stat } from 'node:fs/promises';
import {
  isNewLineCharRegExp,
  equalSignRegExp,
  isIgnorablePath,
  accetableLinePattern,
} from './common.js';
import LoadEnvError from '../errors/env.error.js';
let foundEnv = false;

async function addEnvToProcess(envPath) {
  const decoder = new StringDecoder('utf-8');

  await new Promise((resolve, reject) => {
    createReadStream(envPath)
      .on('data', (bufferedLine) => {
        // decoding buffer
        let lineWithNLChar = decoder.write(bufferedLine);

        // splititng lines
        const linesArray = lineWithNLChar.split(isNewLineCharRegExp());

        // filtering empty lines
        const handledLines = linesArray.filter((line) => line.length);

        for (const line of handledLines) {
          if (!accetableLinePattern().test(line.trim())) {
            throw new LoadEnvError(`Broken environment variable at: ${line}`);
          }
          const [propKey, propValue] = line.split(equalSignRegExp());

          if (Object.keys(process.env).includes(propKey)) {
            throw new LoadEnvError('Environment variable already exists');
          } else if (!propKey || !propValue) {
            throw new LoadEnvError('Missing key or variable value on env file');
          }

          process.env[propKey] = propValue;
        }
      })
      .on('error', (err) => reject(err))
      .on('end', () => resolve());
  });
}

async function walkDir(path, envName = '.env') {
  try {
    const files = await readdir(path);
    const envPath = await searchDotEnv(files, path, envName);
    !!envPath && (await addEnvToProcess(envPath));
    return;
  } catch (err) {
    console.error(err);
  }
}

async function searchDotEnv(files, cwd, envName) {
  for (const file of files) {
    const filePath = resolve(cwd, file);
    const fileStats = await stat(filePath);

    if (!isIgnorablePath().test(filePath)) {
      if (filePath.endsWith(envName)) {
        foundEnv = true;
        return filePath;
      }

      if (!foundEnv && fileStats.isDirectory()) {
        await walkDir(filePath, envName);
      }

      if (foundEnv) {
        return;
      }
    }
  }
}

export default async function loadEnv(envName, path) {
  const cwd = path || process.cwd();
  try {
    await walkDir(cwd, envName);
  } catch (err) {
    console.error(err);
  }
}
