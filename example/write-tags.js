/**
 * This is an example helps to understand how to write image tages (eg. exif) data from entity image file or buffer
 */

const path = require('path')
const ExifTool = require('../lib/exiftool-wrapper')
const { readFile, writeFile } = require('../lib/utils')
const exiftool = new ExifTool()

const imagePath = './test'
const imageFile = path.join(imagePath, 'IMG_2583.JPG')

let imageBuffer = null

function getImageBuffer () {
  return (imageBuffer != null)
  ? Promise.resolve(imageBuffer)
  : readFile(imageFile)
    .then(buffer => {
      imageBuffer = buffer
      return imageBuffer
    })
}

;(() => {
  return getImageBuffer()
  .then(() => {
    return Promise.all([
      /**
       * write iptc/By-line data to buffer
       */
      exiftool.setTags({
        source: imageBuffer,
        tags: [
          {
            tag: 'iptc:By-line',
            value: 'Kim Hsiao'
          }
        ]
      })
      .then(buffer => {
        return writeFile(path.join(imagePath, 'aaa.jpg'), buffer)
      }),

      /**
       * remove Model from buffer
       */
      exiftool.setTags({
        source: imageBuffer,
        tags: [
          {
            tag: 'Model',
            value: ''
          }
        ]
      })
      .then(buffer => {
        return writeFile(path.join(imagePath, 'bbb.jpg'), buffer)
      }),

      /**
       * Remove all tags from buffer
       */
      exiftool.setTags({
        source: imageBuffer,
        tags: [
          {
            tag: 'all',
            value: ''
          }
        ]
      }).then(buffer => {
        return writeFile(path.join(imagePath, 'ccc.jpg'), buffer)
      }),

      /**
       * update Make to 'Kim Hsiao' from a file
       */
      exiftool.setTags({
        source: imageFile,
        tags: [
          {
            tag: 'Make',
            value: 'Kim Hsiao'
          }
        ]
      })
    ])
  })
  .catch(console.error)
})()
