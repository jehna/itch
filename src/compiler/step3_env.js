const readline = require("readline")
const readStr = require("./reader")
const prStr = require("./printer")
const Env = require('./env')
const symbol = require('./symbol')

const REPL_ENV = new Env(null, {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => Math.round(a / b)
})

async function* read() {
  const rl = readline.createInterface({
    input: process.stdin
  })
  for await (const line of rl) {
    yield readStr(line)
  }
}

function eval(ast, env) {
  console.log(ast)
  if (!Array.isArray(ast)) {
    return evalAst(ast, env)
  }
  if (ast.length === 0) {
    return ast
  }

  const [first, second, third] = ast
  if (!symbol.isSymbol(first)) {
    return ast
  }

  if (symbol.getValue(first) === 'def!') {
    return env.set(symbol.getValue(second), eval(third, env))
  }
  if (symbol.getValue(first) === 'let*') {
    const [key, value] = second
    return eval(third, new Env(env, { [symbol.getValue(key)]: eval(value) }))
  }


  const [fn, ...args] = evalAst(ast, env)
  return fn(...args)
}

function evalAst(ast, env) {
  if (symbol.isSymbol(ast)) {
    return env.get(symbol.getValue(ast))
  }
  if (Array.isArray(ast)) {
    return ast.map(value => eval(value, env))
  }
  return ast
}

function print(ast) {
  process.stdout.write(`${prStr(ast)}\nuser> `)
}

async function rep() {
  for await (const ast of read()) {
    print(eval(ast, REPL_ENV))
  }
}

print("Stage 1 LISP intrepreter:")
rep()
