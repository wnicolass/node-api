import { resolve } from 'node:path';
import { createReadStream } from 'node:fs';
import { StringDecoder } from 'node:string_decoder';
import { readdir, stat } from 'node:fs/promises';
import { regExpCompiler } from './common.js';
import EnvVarAlreadyExistsError from '../errors/reading-error.js';
let foundEnv = false;

async function addEnvToProcess(envPath) {
  const decoder = new StringDecoder('utf-8');
  const compileRegex = regExpCompiler(/(\r\n|\n|\r)/, ['g', 'm']);
  const NLCharactersRegExp = compileRegex();

  await new Promise((resolve, reject) => {
    createReadStream(envPath)
      .on('data', (bufferedLine) => {
        let lineWithNLChar = decoder.write(bufferedLine);
        const linesArray = lineWithNLChar.split(NLCharactersRegExp);
        const handledLines = linesArray.filter(
          (line) => !NLCharactersRegExp.test(line)
        );
        for (const line of handledLines) {
          const [propKey, propValue] = line.split('=');
          if (Object.keys(process.env).includes(propKey)) {
            throw new EnvVarAlreadyExistsError(
              'Environment variable already exists'
            );
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
  const compileRegex = regExpCompiler(/(node_modules|.git|.venv)/, ['g']);
  const isIgnorablePath = compileRegex();
  for (const file of files) {
    const filePath = resolve(cwd, file);
    const fileStats = await stat(filePath);

    if (!isIgnorablePath.test(filePath)) {
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
