/**
 * This is an example helps to understand how to write image tages (eg. exif) data from entity image file or buffer
 */

const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const ExifTool = require('../lib/exiftool-wrapper')
const exiftool = new ExifTool()

const fse = Promise.promisifyAll(fs)

const imagePath = './test'
const imageFile = path.join(imagePath, 'IMG_2583.JPG')

let imageBuffer = null

/**
 * Write tags data to file
 *
 * @param {String|Buffer} filePath File or Buffer to write tags
 * @param {Array} tags Array of tags to write
 */
function writeToFile (filePath, tags) {
  return exiftool.setTags({
    source: filePath,
    tags
  })
}

function getImageBuffer () {
  return Promise.resolve(
    (imageBuffer != null)
    ? imageBuffer
    : fse.readFileAsync(imageFile)
    .then(buffer => {
      imageBuffer = buffer
      return imageBuffer
    })
  )
}

;(() => {
  return getImageBuffer()
  .then(() => {
    return Promise.props({
      /**
       * update Make to 'Kim Hsiao' from a file
       */
      'writeMakeFile': writeToFile(imageFile, [
        {
          tag: 'Make',
          value: 'Kim Hsiao'
        }
      ]),

      /**
       * write iptc/By-line data to buffer
       */
      'writeBylineBuffer': writeToFile(imageBuffer, [
        {
          tag: 'iptc:By-line',
          value: 'Kim Hsiao'
        }
      ]),

      /**
       * remove Model from buffer
       */
      'removeModelBuffer': writeToFile(imageBuffer, [
        {
          tag: 'Model',
          value: ''
        }
      ]),

      /**
       * Remove all tags from buffer
       */
      'removeAllTagsBuffer': writeToFile(imageBuffer, [
        {
          tag: 'all',
          value: ''
        }
      ])
    })
  })
  .then(dat => {
    const { writeBylineBuffer, removeModelBuffer, removeAllTagsBuffer } = dat

    return Promise.all([
      fse.writeFileAsync(path.join(imagePath, 'aaa.jpg'), writeBylineBuffer),
      fse.writeFileAsync(path.join(imagePath, 'bbb.jpg'), removeModelBuffer),
      fse.writeFileAsync(path.join(imagePath, 'ccc.jpg'), removeAllTagsBuffer)
    ])
  })
  .catch(console.error)
})()
