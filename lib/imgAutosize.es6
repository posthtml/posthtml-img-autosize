import path from 'path';
import url from 'url';
import http from 'http';
import Promise from 'bluebird';

const imageSize = require('image-size');
const imageSizeAsPromise = Promise.promisify(imageSize);


export default (options = {}) => {
    return function imgAutosize(tree) {
        options.root = options.root || './';
        options.processEmptySize = options.processEmptySize === undefined ? false : options.processEmptySize;

        let promises = [];
        tree.match({tag: 'img'}, imgNode => {
            let imgTagAttrs = imgNode.attrs || {};
            const imgSrc = imgTagAttrs.src;
            if (! imgSrc) {
                return imgNode;
            }

            const isWidthDefined = options.processEmptySize ? isSizeDefined(imgTagAttrs.width) : imgTagAttrs.width !== 'auto';
            const isHeightDefined = options.processEmptySize ? isSizeDefined(imgTagAttrs.height) : imgTagAttrs.height !== 'auto';
            if (isWidthDefined && isHeightDefined) {
                return imgNode;
            }

            const imgUrl = url.parse(imgSrc);
            const image = imgUrl.host ? imgUrl : path.resolve(options.root, imgTagAttrs.src);

            let promise = getImageDimensions(image)
                .then(dimensions => {
                    if (! isWidthDefined) {
                        imgNode.attrs.width = dimensions.width;
                    }

                    if (! isHeightDefined) {
                        imgNode.attrs.height = dimensions.height;
                    }

                    imgNode.attrs = imgTagAttrs;
                });
            promises.push(promise);

            return imgNode;
        });


        return Promise.all(promises).then(() => tree);
    };
};



function getImageDimensions(image) {
    if (! image.host) {
        return imageSizeAsPromise(image);
    }

    return new Promise((resolve, reject) => {
        http.get(image, response => {
            let chunks = [];

            response
                .on('data', chunk => chunks.push(chunk))
                .on('end', () => resolve(imageSize(Buffer.concat(chunks))));
        }).on('error', reject);
    });
}


function isSizeDefined(value) {
    return !! value && value !== 'auto';
}
