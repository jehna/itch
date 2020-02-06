const readline = require('readline')
const readStr = require('./reader')
const prStr = require('./printer')

async function *read() {
  const rl = readline.createInterface({
    input: process.stdin
  })
  for await (const line of rl) {
    yield readStr(line)
  }
}

function eval(ast) {
  return ast
}

function print(ast) {
  process.stdout.write(`${prStr(ast)}\nuser> `)
}

async function rep() {
  for await (const ast of read()) {
    print(eval(ast))
  }
}

print('Stage 1 LISP intrepreter:')
rep()