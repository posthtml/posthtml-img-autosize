const url = require('url');
const path = require('path');
const http = require('http');
const imageSize = require('image-size');

module.exports = {
    default: function(options) {
        options = options || {};
        options.root = options.root || '.';
        options.processEmptySize = options.processEmptySize || false;

        const projectRoot = path.resolve(options.root);

        return function(tree) {
            const htmlRelativePath = path.relative(process.cwd(), path.dirname(tree.options.to || ''));

            const promises = [];

            tree.match({ tag: 'img' }, img => {
                img.attrs = img.attrs || {};

                if (!img.attrs.src) {
                    return img;
                }

                const imagePath = translatePath(projectRoot, htmlRelativePath, img.attrs.src);

                const updateWidth = shouldUpdateDimension(img.attrs.width);
                const updateHeight = shouldUpdateDimension(img.attrs.height);

                if (!updateWidth && !updateHeight) {
                    return img;
                }

                promises.push(
                    getImageDimensions(imagePath).then(dimensions => {
                        if (updateWidth) {
                            img.attrs.width = dimensions.width;
                        }

                        if (updateHeight) {
                            img.attrs.height = dimensions.height;
                        }
                    })
                );

                return img;
            });

            return Promise.all(promises).then(
                () => tree,
                () => {}
            );
        };

        function shouldUpdateDimension(attributeValue) {
            if (attributeValue == 'auto') {
                return true;
            }

            if (!attributeValue) {
                return options.processEmptySize;
            }

            return false;
        }
    }
};

function translatePath(projectRoot, htmlRelativePath, imgPath) {
    const img = url.parse(imgPath);

    if (img.host) {
        return imgPath;
    }

    const imgProjectPath = path.resolve('/' + htmlRelativePath, imgPath);
    const imgAbsolutePath = path.join(projectRoot, imgProjectPath);

    return imgAbsolutePath;
}

function getImageDimensions(imgPath) {
    const img = url.parse(imgPath);

    if (!img.host) {
        return new Promise((resolve, reject) => {
            imageSize(imgPath, (err, dimensions) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(dimensions);
                }
            });
        });
    }

    return new Promise((resolve, reject) => {
        http.get(imgPath, response => {
            const chunks = [];

            response
                .on('data', chunk => chunks.push(chunk))
                .on('end', () => resolve(imageSize(Buffer.concat(chunks))));
        }).on('error', reject);
    });
}
