/**
 * exiftool wrapper
 */

const path = require('path')
const { spawn } = require('child_process')
const Promise = require('bluebird')

const exifFile = path.join('./bin', 'exiftool')

class ExifTool {
  /**
   * Constructor which can assign path to exiftool
   *
   * @param {String} exifBin exiftool path
   */
  constructor (exifBin = exifFile) {
    this.bin = exifBin
  }

  /**
   * Assign path to exiftool
   *
   * @param {String} exifBin exiftool path
   */
  setBin (exifBin = exifFile) {
    this.bin = exifBin
  }

  /**
   * Get all tags from given source
   *
   * @param {Object} param0
   *
   * param0: {
   *  source: image path || array of image path || buffer of image
   *  tags: tags to get || get all tags
   *  useBufferLimit: if only analyze the size of buffer to retrieve exif/iptc data
   *  maxBufferSize: Only max buffer size to retrieve exif/iptc data
   *  callback: callback function if wanna this function as callback-able
   * }
   */
  getTags ({
    source,
    tags,
    useBufferLimit = true,
    maxBufferSize = 10000,
    callback }) {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        if (!source || source == null) {
          const err = this._errorObject('type')
          this._tryCallback(callback, err)
          return reject(err)
        }

        const exifParams = this._prepareTags(tags)

        /**
         * Add export data format as json
         */
        exifParams.push('-j')

        /**
         * Add settings for convert gps location to xxx.xxxxxx format
         */
        exifParams.push('-c')
        exifParams.push('%.9f')

        let usingBuffer = false

        if (Buffer.isBuffer(source)) {
          usingBuffer = true
          /**
           * "-" is work for piping the buffer into ExifTool
           */
          exifParams.push('-')
        } else if (typeof source === 'string') {
          exifParams.push(source)
        } else if (Array.isArray(source)) {
          source.forEach(s => {
            exifParams.push(s)
          })
        } else {
          const err = this._errorObject('type')
          this._tryCallback(callback, err)
          return reject(err)
        }

        const exif = spawn(this.bin, exifParams)
        let exifData = ''
        let exifErr = ''

        if (usingBuffer === true) {
          const buf = (useBufferLimit ? source.slice(0, maxBufferSize) : source)
          exif.stdin.write(buf)
          exif.stdin.end()
        }

        exif.stdout.on('data', data => {
          exifData += data
        })

        exif.stderr.on('data', err => {
          exifErr += err
        })

        exif.once('close', code => {
          if (code === 0) {
            try {
              let parsedData = JSON.parse(exifData)

              if (parsedData.length === 1) {
                parsedData = parsedData[0]
              }

              this._tryCallback(callback, null, parsedData)
              return resolve(parsedData)
            } catch (err) {
              this._tryCallback(callback, err)
              return reject(err)
            }
          }

          const err = this._errorObject('return')
          err.commandLog = {
            stdout: exifData,
            stderr: exifErr
          }

          this._tryCallback(callback, err)
          return reject(err)
        })
      })
    })
  }

  /**
   * Set tag data to given source
   *
   * @param {Object} param0
   *
   * param0: {
   *  source: image path || array of image path || buffer of image
   *  tags: tags to get || get all tags
   *  useBufferLimit: if only analize the size of buffer to retrieve exif/iptc data
   *  maxBufferSize: Only max buffer size to retrieve exif/iptc data
   *  callback: callback function if wanna this function as callback-able
   * }
   */
  setTags ({
    source,
    tags,
    callback
  }) {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        if (!source || source == null) {
          const err = this._errorObject('type')
          this._tryCallback(callback, err)
          return reject(err)
        }

        if (!Array.isArray(tags)) {
          const err = this._errorObject('tags')
          this._tryCallback(callback, err)
          return reject(err)
        }

        tags = tags.filter(t => {
          return (typeof t === 'object' && (('tag' in t) && ('value' in t)))
        })

        if (!tags.length) {
          const err = this._errorObject('invalidTag')
          this._tryCallback(callback, err)
          return reject(err)
        }

        const exifParams = this._setPrepareTags(tags)

        /**
         * Add export converted as binary
         */
        exifParams.push('-b')

        /**
         * Add settings for convert gps location to xxx.xxxxxx format
         */
        exifParams.push('-c')
        exifParams.push('%.9f')

        let usingBuffer = false

        if (Buffer.isBuffer(source)) {
          usingBuffer = true

          /**
           * "-" is work for piping the buffer into ExifTool
           */
          exifParams.push('-')
        } else if (typeof source === 'string') {
          exifParams.push(source)
        } else if (Array.isArray(source)) {
          source.forEach(s => {
            exifParams.push(s)
          })
        } else {
          const err = this._errorObject('type')
          this._tryCallback(callback, err)
          return reject(err)
        }

        const exif = spawn(this.bin, exifParams)
        const chunks = []

        let exifErr = ''

        if (usingBuffer === true) {
          exif.stdin.write(source)
          exif.stdin.end()
        }

        exif.stdout.on('data', data => {
          chunks.push(data)
        })

        exif.stderr.on('data', err => {
          exifErr += err
        })

        exif.once('close', code => {
          if (code === 0) {
            /**
             * return generated image as buffer
             */
            return resolve(Buffer.concat(chunks))
          }

          const err = this._errorObject('return')
          err.commandLog = {
            stdout: Buffer.concat(chunks),
            stderr: exifErr
          }

          this._tryCallback(callback, err)
          return reject(err)
        })
      })
    })
  }

  /**
   * Helper method which can make the function callback-able
   *
   * @param {Function} callback Callback function
   * @param {Object} error Error object
   * @param {Any} result Result data
   */
  _tryCallback (callback, error, result) {
    if (callback && callback != null) {
      return callback(error, result)
    }
  }

  /**
   * Generate error object
   *
   * @param {String} type Type of error
   */
  _errorObject (type = 'type') {
    if (type === 'type') {
      return new TypeError(`"source" must be a string [string] or Buffer`)
    }

    if (type === 'tags') {
      return new TypeError(`"tags" must be an array with tag settings`)
    }

    if (type === 'invalidTag') {
      return new TypeError(`"tags" must provide valid object format`)
    }

    if (type === 'return') {
      return new Error(`Exiftool returned an error`)
    }
  }

  /**
   * Helper function which can convert tags to retrieve
   *
   * @param {Array} tags Tags
   */
  _prepareTags (tags) {
    if (Array.isArray(tags) && tags.length) {
      tags = tags.map(tagname => (`-${tagname}`))
      return tags
    }

    return []
  }

  /**
   * Helper function which can set new tags for given image
   *
   * @param {Object} tags New tag => value format that gives for add exif / iptc data into image
   */
  _setPrepareTags (tags) {
    if (Array.isArray(tags) && tags.length) {
      try {
        return tags.map(t => {
          const { tag, value } = t
          return `-${tag}=${value}`
        })
      } catch (err) {
        console.error(err)
        return []
      }
    }

    return []
  }
}

exports.ExifTool = ExifTool
