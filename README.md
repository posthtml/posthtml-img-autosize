# posthtml-img-autosize [![npm version](https://badge.fury.io/js/posthtml-img-autosize.svg)](http://badge.fury.io/js/posthtml-img-autosize) [![Build Status](https://travis-ci.org/posthtml/posthtml-img-autosize.svg?branch=master)](https://travis-ci.org/posthtml/posthtml-img-autosize)

[PostHTML](https://github.com/posthtml/posthtml) plugin that automatically sets `width` and `height` of `<img>`.
It supports JPG, PNG, GIF, BMP, TIFF, SVG, and WebP.
It autosizes both local and remote images.


## Usage
By default the plugin will autosize only images with `width="auto"` and `height="auto"`:

```js
var posthtml = require('posthtml');

posthtml([require('posthtml-img-autosize')()])
    .process('<img src="photo.png" width="auto" height="auto"><img src="user.jpg">')
    .then(function (result) {
        console.log(result.html);
    });

// <img src="photo.png" width="111" height="52">
// <img src="user.jpg">
```


But if you set `processEmptySize: true`, the plugin will autosize all images with undefined or empty `width` and `height`:
```js
posthtml([
    require('posthtml-img-autosize')({
        root: './', // Path to images base directory (default: './')
        processEmptySize: true
    })
])
    .process('<img src="photo.png" width="auto" height="auto"><img src="user.jpg">')
    .then(function (result) {
        console.log(result.html);
    });

// <img src="photo.png" width="111" height="52">
// <img src="user.jpg" width="100" height="201">
```




### Error handling
You can use the usual `Promise.catch()` to handle errors:

```js
posthtml([require('posthtml-img-autosize')()])
    .process('<img src="notExists.jpg" width="auto" height="auto">')
    .then(function (result) {
        // ...
    })
    .catch(function (error) {
        console.log(error.message);
    });

// ENOENT: no such file or directory, open '/notExists.jpg'
```
