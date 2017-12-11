/**
 * utils
 */

const fs = require('fs')

module.exports = {
  readFile: filename => {
    return new Promise((resolve, reject) => {
      return fs.readFile(filename, (err, data) => {
        if (err != null) {
          return reject(new Error(err))
        }

        return resolve(data)
      })
    })
  },

  writeFile: (filename, content) => {
    return new Promise((resolve, reject) => {
      return fs.writeFile(filename, content, err => {
        if (err != null) {
          return reject(new Error(err))
        }

        return resolve()
      })
    })
  },

  unlinkFile: filename => {
    return new Promise((resolve, reject) => {
      return fs.unlink(filename, err => {
        if (err != null) {
          return reject(new Error(err))
        }

        return resolve()
      })
    })
  }
}
