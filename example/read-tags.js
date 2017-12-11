/**
 * This is an example helps to understand how to read exif data from entity image file or buffer
 */

const path = require('path')
const ExifTool = require('../lib/exiftool-wrapper')
const { readFile } = require('../lib/utils')
const exiftool = new ExifTool()

const imageFile = path.join('./test', 'IMG_2583.JPG')

;(() => {
  return Promise.all([
    /**
     * only get exif tags from buffer
     */
    readFile(imageFile)
    .then(buffer => {
      return exiftool.getTags({
        source: buffer,
        tags: ['exif:*']
      })
    }),

    /**
     * only get all gps tags -> GPSSpeed from file
     */
    exiftool.getTags({
      source: imageFile,
      tags: ['gps:GPSSpeed']
    }),

    /**
     * get all tags from files
     */
    exiftool.getTags({
      source: [imageFile, imageFile]
    })
  ])
  .then(console.info)
  .catch(console.error)
})()
