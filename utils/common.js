function regExpCompiler(pattern, flags = []) {
  const regexp = new RegExp(pattern, ...flags);
  return function returnRegex() {
    return regexp;
  };
}

const isNewLineCharRegExp = regExpCompiler(/(?:\r\n|\n|\r)/, ['g', 'm']);
const equalSignRegExp = regExpCompiler(/=(?=.*[^=])?/);
const isIgnorablePath = regExpCompiler(/(node_modules|.git|.venv)/, ['g']);
const accetableLinePattern = regExpCompiler(/^\w+=(?!(.*"{2}.*|\w+=\w?)).*$/);

export {
  isNewLineCharRegExp,
  equalSignRegExp,
  isIgnorablePath,
  regExpCompiler,
  accetableLinePattern,
};
