const symbol = require('./symbol')

function prStr(data) {
  if (Array.isArray(data)) {
    return `(${data.map(prStr).join(' ')})`
  }
  if (data === null) {
    return 'Nil'
  }
  switch (typeof data) {
    case 'number':
      return data.toString(10)
    case 'string':
      return `"${data}"`
    case 'boolean':
      return data.toString()
    default:
      return symbol.getValue(data)
  }
}

export default prStr