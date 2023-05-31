function regExpCompiler(pattern, flags = []) {
  const regexp = new RegExp(pattern, ...flags);
  return function returnRegex() {
    return regexp;
  };
}

const isNewLineCharRegExp = regExpCompiler(/(?:\r\n|\n|\r)/, ['g', 'm']);
const equalSignRegExp = regExpCompiler(/=(?=.*[^=])?/);
const isIgnorablePath = regExpCompiler(/(node_modules|.git|.venv)/, ['g']);
const accetableLinePattern = regExpCompiler(
  /^\w+=(?!(.*("|'){2}.*|\w+=\w?)).*$/
);
const isSignIn = regExpCompiler(/\/api\/sign-in\/?$/)();
const isSignUp = regExpCompiler(/\/api\/sign-up\/?$/)();
const isValidEmail = regExpCompiler(
  /^[^\s\.]+\.?[^\s\.]+@[^\s]+\.[^\s]+\w+$/
)();
const isValidPassword = regExpCompiler(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%\]\)]).{6,20}$/
)();

export {
  isNewLineCharRegExp,
  equalSignRegExp,
  isIgnorablePath,
  regExpCompiler,
  accetableLinePattern,
  isSignIn,
  isSignUp,
  isValidEmail,
  isValidPassword,
};
