const readline = require('readline')

async function *read() {
  yield *readline.createInterface({
    input: process.stdin
  })
}

function eval(str) {
  return str
}

function print(str) {
  process.stdout.write(`${str}\nuser> `)
}

async function rep() {
  for await (const line of read()) {
    print(eval(line))
  }
}

print('Stage 0 LISP intrepreter:')
rep()