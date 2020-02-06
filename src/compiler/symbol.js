const SYMBOL_KEY = Symbol('__symbol_key')

export const create = val => ({ [SYMBOL_KEY]: val })
export const getValue = symbol => symbol[SYMBOL_KEY]
export const isSymbol = obj => obj.hasOwnProperty(SYMBOL_KEY)
