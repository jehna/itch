const readline = require("readline")
const readStr = require("./reader")
const prStr = require("./printer")

const REPL_ENV = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => Math.round(a / b)
}

async function* read() {
  const rl = readline.createInterface({
    input: process.stdin
  })
  for await (const line of rl) {
    yield readStr(line)
  }
}

function eval(ast, env) {
  if (!Array.isArray(ast)) {
    return evalAst(ast, env)
  }
  if (ast.length === 0) {
    return ast
  }

  const [fn, ...args] = evalAst(ast, env)
  return fn(...args)
}

function evalAst(ast, env) {
  if (ast.hasOwnProperty('__symbol_key')) {
    return env[ast['__symbol_key']]
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
