const symbol = require('./symbol')

class Reader {
  constructor(tokens) {
    this.tokens = tokens
    this.current = this.tokens.next().value
  }

  next() {
    const curr = this.current
    this.current = this.tokens.next().value
    return curr
  }

  peek() {
    return this.current
  }
}

function readStr(str) {
  const tokens = tokenize(str)
  return readForm(new Reader(tokens))
}

const TOKENIZER_REGEXP = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g
function *tokenize(str) {
  for (const [,result] of str.matchAll(TOKENIZER_REGEXP)) {
    yield result
  }
}

function readForm(reader) {
  const firstToken = reader.peek()
  switch(firstToken[0]) {
    case '(':
      return readList(reader)
    default:
      return readAtom(reader)
  }
}

function readList(reader) {
  const result = []

  for (let next = reader.next(); next !== ')'; next = reader.peek()) {
    result.push(readForm(reader))
  }
  reader.next()

  return result
}

function readAtom(reader) {
  const token = reader.next()
  if (/^[0-9]+$/.test(token)) return parseInt(token)
  if (token === 'true') return true
  if (token === 'false') return false
  if (token === 'Nil') return null
  if (/^"[\w]"+$/.test(token)) return token.slice(1, -1)

  return symbol.create(token)
}

export default readStr