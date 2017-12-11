/**
 * This is an example helps to understand how to read exif data from entity image file or buffer
 */

const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const ExifTool = require('../lib/exiftool-wrapper')
const exiftool = new ExifTool()

const fse = Promise.promisifyAll(fs)

const imageFile = path.join('./test', 'IMG_2583.JPG')
// const imageFile = path.join('./test', 'abc.jpg')

/**
 * Read data from buffer
 *
 * @param {Object} buffer Buffer
 */
function readFromBuffer (buffer, tags) {
  return exiftool.getTags({
    source: buffer,
    tags
  })
}

/**
 * Read data from file path
 *
 * @param {String|Array} filepath File path, or Array of files
 */
function readFromFile (filePath, tags) {
  return exiftool.getTags({
    source: filePath,
    tags
  })
}

;(() => {
  return Promise.props({
    /**
     * only get exif tags from buffer
     */
    'allExif': fse.readFileAsync(imageFile)
    .then(buffer => {
      return readFromBuffer(buffer, ['exif:*'])
    }),

    /**
     * only get all gps tags -> GPSSpeed from file
     */
    'GPSSpeed': readFromFile(imageFile, ['gps:GPSSpeed']),

    /**
     * get all tags from files
     */
    'allGps': readFromFile([imageFile, imageFile])
  })
  .then(console.info)
  .catch(console.error)
})()
