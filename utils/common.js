function regExpCompiler(pattern, flags = []) {
  return function () {
    return new RegExp(pattern, ...flags);
  };
}

export { regExpCompiler };
