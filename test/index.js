
const path = require('path')
const fs = require('fs')
const Promise = require('bluebird')
const { ExifTool } = require('../index')
const exiftool = new ExifTool()
const fse = Promise.promisifyAll(fs)

const imgPath = '../img'
const imgFilename = process.argv[2] || 'IMG_2583.JPG'
const img = path.join(imgPath, imgFilename)

function getImageWithBuffer () {
  return new Promise((resolve, reject) => {
    return fs.readFile(img, (err, data) => {
      if (err != null) {
        return reject(new Error(err))
      }

      return resolve(data)
    })
  })
}

;(() => {
  /**
   * read
   */
  // return getImageWithBuffer()
  // .then(buf => {
  //   return exiftool.getTags({
  //     source: buf
  //   })
  // })
  // .then(console.info)

  /**
   * write
   */
  return getImageWithBuffer()
  .then(buf => {
    return exiftool.setTags({
      source: buf,
      tags: [
        {
          tag: 'ProfileCopyright',
          value: 'FB company'
        }
      ]
    })
  })
  // .then(buf => {
  //   return exiftool.getTags({
  //     source: img
  //   })
  // })
  .then(dat => {
    return fse.writeFileAsync('bb.jpg', dat)
  })
  
  /**
   * get exif / iptc data
   */
  // return new Promise((resolve, reject) => {
  //   return fs.readFile(img, (err, data) => {
  //     if (err != null) {
  //       return reject(new Error(err))
  //     }

  //     return resolve(data)
  //   })
  // })
  // .then(buf => {
  //   return exiftool.getTags({
  //     source: buf
  //   })
  // })
  // .then(data => {
  //   console.info(data)
  // })
  // .catch(err => {
  //   console.error(err)
  // })

  /**
   * set ProfileCopyright=FB
   */
  // return new Promise((resolve, reject) => {
  //   return fs.readFile(img, (err, data) => {
  //     if (err != null) {
  //       return reject(new Error(err))
  //     }

  //     return resolve(data)
  //   })
  // })
  // .then(buf => {
  //   return exiftool.setTags({
  //     source: buf,
  //     tags: [
  //       {
  //         tag: 'ProfileCopyright',
  //         value: 'FB company'
  //       }
  //     ]
  //   })
  // })
  // .then(data => {
  //   return new Promise((resolve, reject) => {
  //     fs.writeFile(path.join('./img', 'output.jpg'), data, err => {
  //       if (err != null) {
  //         return reject(new Error(err))
  //       }

  //       return resolve()
  //     })
  //   })
  // })
  // .catch(err => {
  //   console.error(err)
  // })

  /**
   * set iptc byline data
   */
  // return new Promise((resolve, reject) => {
  //   return fs.readFile(img, (err, data) => {
  //     if (err != null) {
  //       return reject(new Error(err))
  //     }

  //     return resolve(data)
  //   })
  // })
  // .then(buf => {
  //   return exiftool.setTags({
  //     source: buf,
  //     tags: [
  //       {
  //         tag: 'iptc:By-line',
  //         value: 'Kim Hsiao'
  //       }
  //     ]
  //   })
  // })
  // .then(data => {
  //   return new Promise((resolve, reject) => {
  //     fs.writeFile(path.join('./img', 'output.jpg'), data, err => {
  //       if (err != null) {
  //         return reject(new Error(err))
  //       }

  //       return resolve()
  //     })
  //   })
  // })
  // .catch(err => {
  //   console.error(err)
  // })
})()
