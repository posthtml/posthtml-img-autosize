import path from 'path';
import Promise from 'bluebird';

const imageSize = Promise.promisify(require('image-size'));


export default (options = {}) => {
    return function imgAutosize(tree) {
        options.root = options.root || './';
        options.includeEmpty = options.includeEmpty === undefined ? false : options.includeEmpty;

        let promises = [];
        tree.match({tag: 'img'}, imgNode => {
            let imgTagAttrs = imgNode.attrs || {};
            if (! imgTagAttrs.src) {
                return imgNode;
            }

            const isWidthDefined = options.includeEmpty ? isSizeDefined(imgTagAttrs.width) : imgTagAttrs.width !== 'auto';
            const isHeightDefined = options.includeEmpty ? isSizeDefined(imgTagAttrs.height) : imgTagAttrs.height !== 'auto';
            if (isWidthDefined && isHeightDefined) {
                return imgNode;
            }

            const imagePath = path.resolve(options.root, imgTagAttrs.src);
            let promise = imageSize(imagePath)
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



function isSizeDefined(value) {
    return !! value && value !== 'auto';
}
