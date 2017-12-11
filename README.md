# Exiftool-kit

This is a package is [exiftool] nodejs wrapped version. With this wrapped version, you can read / create / edit / remove image exif / iptc settings very easy.

This package don't depend on any other npm packages, and you may also set your own exiftool binary file as you wish.

## installation

```bash
$ npm install --save exiftool-kit
```

## how to use

### set your own exiftool (not necessary, unless you really wanna set your own exiftool binary)

```javascript
const ExifTool = require('exiftool-kit')
const exiftool = new ExifTool(pathToYourOwnExifTool)
```

*or*

```javascript
const ExifTool = require('exiftool-kit')
const exiftool = new ExifTool()

exiftool.setBin(pathToYourOwnExifTool)
```

### read tags

#### read a single file

```javascript
const ExifTool = require('exiftool-kit')
const exiftool = new ExifTool()

exiftool.getTag({
    source: file
})
```

#### read files

```javascript
const ExifTool = require('exiftool-kit')
const exiftool = new ExifTool()

exiftool.getTag({
    source: [file1, file2]
})
```

#### read buffer

```javascript
const ExifTool = require('exiftool-kit')
const exiftool = new ExifTool()

exiftool.getTag({
    source: buffer
})
```

### edit (write | update | remove) tags

#### write / update tags

```javascript
const ExifTool = require('exiftool-kit')
const exiftool = new ExifTool()

exiftool.setTags({
    source: image,
    tags: [
        { tag: 'iptc:By-line', value: 'Kim Hsiao' }
    ]
})
```
#### remove tags

```javascript
const ExifTool = require('exiftool-kit')
const exiftool = new ExifTool()

exiftool.setTags({
    source: imageBuffer,
    tags: [
        { tag: 'Model', value: '' }
    ]
})
```

#### remove all tags

```javascript
const ExifTool = require('exiftool-kit')
const exiftool = new ExifTool()

exiftool.setTags({
    source: imageBuffer,
    tags: [
        { tag: 'all', value: '' }
    ]
})
```

### example

You may check [example], to get more detail example code

## Note

When you edit tags to a file, this will return the given file name. If you edit tags from a buffer, it will return a updated buffer.

[exiftool]: https://www.sno.phy.queensu.ca/~phil/exiftool/
[example]: https://github.com/poyhsiao/exiftool-kit/tree/master/example
