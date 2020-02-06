class Env {
  constructor(outer = null, initialEnv = {}) {
    this.data = { outer, ...initialEnv }
  }
  set(key, value) {
    this.data[key] = value
    return value
  }
  setAll(obj) {
    Object.assign(this.data, obj)
  }
  find(key) {
    return this.data.hasOwnProperty(key) ? this.data : this.data.outer ? this.data.outer.find(key) : null
  }
  get(key) {
    const env = this.find(key)
    return env ? env[key] : null
  }
}

module.exports = Env