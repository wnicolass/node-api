import { resolve } from 'node:path';
import { createReadStream, readdirSync, readFileSync, statSync } from 'node:fs';
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

function validateLine(line) {
  if (!accetableLinePattern().test(line.trim())) {
    throw new LoadEnvError(`Broken environment variable at: ${line}`);
  }
  const [propKey, propValue] = line.split(equalSignRegExp());

  if (Object.keys(process.env).includes(propKey)) {
    throw new LoadEnvError('Environment variable already exists');
  } else if (!propKey || !propValue) {
    throw new LoadEnvError('Missing key or variable value on env file');
  }

  return [propKey, propValue];
}

async function addEnvToProcess(envPath) {
  const decoder = new StringDecoder('utf-8');

  await new Promise((resolve, reject) => {
    createReadStream(envPath)
      .on('data', (bufferedLine) => {
        // decoding buffer
        let lineWithNLChar = decoder.write(bufferedLine);

        // splitting lines
        const linesArray = lineWithNLChar.split(isNewLineCharRegExp());

        // filtering empty lines
        const handledLines = linesArray.filter((line) => line.length);

        for (const line of handledLines) {
          const [propKey, propValue] = validateLine(line);

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
        walkDir(filePath, envName);
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

function searchEnvSync(files, path, envName) {
  for (const file of files) {
    const filePath = resolve(path, file);
    const fileStats = statSync(filePath);

    if (!isIgnorablePath().test(filePath)) {
      if (filePath.endsWith(envName)) {
        foundEnv = true;
        return filePath;
      }

      if (!foundEnv && fileStats.isDirectory()) {
        walkDirSync(filePath, envName);
      }

      if (foundEnv) {
        return;
      }
    }
  }
}

function addEnvToProcessSync(envPath) {
  const fileBuffer = readFileSync(envPath);
  const fileString = fileBuffer.toString('utf8');
  const fileLines = fileString.split(/\s/g).filter((line) => line.length);

  for (const line of fileLines) {
    const [propKey, propValue] = validateLine(line);
    process.env[propKey] = propValue;
  }
}

function walkDirSync(path, envName) {
  const files = readdirSync(path);
  const envPath = searchEnvSync(files, path, envName);
  addEnvToProcessSync(envPath);
}

export function loadEnvSync(envName = '.env', path) {
  const cwd = path || process.cwd();
  walkDirSync(cwd, envName);
}
