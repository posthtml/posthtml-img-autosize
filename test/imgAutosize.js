const expect = require('expect');
const posthtml = require('posthtml');
const imgAutosize = require('..');

describe('Plugin', () => {
    context('options.processEmptySize == false (default)', () => {
        it('should autosize local JPG', () => {
            return Promise.all([
                init(
                    '<img src="test/img/100x201.jpg" width="auto" height="auto">',
                    '<img src="test/img/100x201.jpg" width="100" height="201">'
                ),

                init(
                    '<img src="test/img/100x201.jpg" width="auto">',
                    '<img src="test/img/100x201.jpg" width="100">'
                ),

                init(
                    '<img src="test/img/100x201.jpg" height="auto">',
                    '<img src="test/img/100x201.jpg" height="201">'
                )
            ]);
        });


        it('should autosize local PNG', () => {
            return init(
                '<img src="img/111x52.png" width="auto" height="104" alt="hi">',
                '<img src="img/111x52.png" width="222" height="104" alt="hi">',
                {root: './test'}
            );
        });


        it('should autosize remote PNG', () => {
            return init(
                '<img src="http://placehold.it/200x200" width="auto" height="25" alt="hi">',
                '<img src="http://placehold.it/200x200" width="25" height="25" alt="hi">'
            );
        });


        it('should autosize local GIF', () => {
            return init(
                '<img src="140x83.gif" width="auto" height="auto">',
                '<img src="140x83.gif" width="140" height="83">',
                {root: './test/img'}
            );
        });


        it('should autosize local BMP', () => {
            return init(
                '<img src="33x16.bmp" width="auto" height="auto">',
                '<img src="33x16.bmp" width="33" height="16">',
                {root: './test/img'}
            );
        });


        it('should autosize local WebP', () => {
            return init(
                '<img src="163x53.webp" width="auto" height="auto">',
                '<img src="163x53.webp" width="163" height="53">',
                {root: './test/img'}
            );
        });


        it('should autosize local TIFF', () => {
            return init(
                '<img src="63x69.tiff" width="auto" height="auto">',
                '<img src="63x69.tiff" width="63" height="69">',
                {root: './test/img'}
            );
        });


        it('should autosize local SVG', () => {
            return init(
                '<img src="203x150.svg" width="auto" height="auto">',
                '<img src="203x150.svg" width="203" height="150">',
                {root: './test/img'}
            );
        });


        it('should skip <img> with empty "src"', () => {
            const html = '<div><img></div>';
            return init(html,html);
        });


        it('should skip <img> with defined "width" and "height"', () => {
            const html = '<img src="foo.jpg" widht="100%" height="100">';
            return init(html, html);
        });


        it('should skip <img> with "width" and "height" != "auto"', () => {
            const html = '<img src="foo.jpg">';
            return init(html, html);
        });


        it('should throw an error if the image is not found', () => {
            const html = '<img src="notExists.jpg" width="auto" height="auto">';
            return init(html, html).catch(error => {
                expect(error.message)
                    .toInclude('ENOENT')
                    .toInclude('notExists.jpg');
            });
        });
    });




    context('options.processEmptySize == true', () => {
        it('should autosize <img> with empty "width" or "height"', () => {
            const options = {processEmptySize: true};

            return Promise.all([
                init(
                    '<img src="test/img/100x201.jpg">',
                    '<img src="test/img/100x201.jpg" width="100" height="201">',
                    options
                ),

                init(
                    '<img src="test/img/111x52.png" width="">',
                    '<img src="test/img/111x52.png" width="111" height="52">',
                    options
                ),

                init(
                    '<img src="test/img/140x83.gif" height="auto">',
                    '<img src="test/img/140x83.gif" height="83" width="140">',
                    options
                )
            ]);
        });
    });
});


function init(html, expectedHtml, options) {
    return posthtml([imgAutosize(options)])
        .process(html)
        .then(result => {
            expect(result.html).toBe(expectedHtml);
        });
}
