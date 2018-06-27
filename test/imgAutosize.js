const expect = require('expect');
const posthtml = require('posthtml');
const imgAutosize = require('..');

describe('Plugin', () => {
    context('options.processEmptySize == false (default)', () => {
        const options = { root: './test/img' };

        it('should autosize local JPG', () => {
            return Promise.all([
                init(
                    '<img src="100x201.jpg" width="auto" height="auto"><img src="100x201.jpg" width="auto" height="auto">',
                    options
                ).then(res => {
                    expect(res).toBe(
                        '<img src="100x201.jpg" width="100" height="201"><img src="100x201.jpg" width="100" height="201">'
                    );
                }),

                init('<img src="100x201.jpg" width="auto">', options).then(
                    res => {
                        expect(res).toBe('<img src="100x201.jpg" width="100">');
                    }
                ),

                init('<img src="100x201.jpg" height="auto">', options).then(
                    res => {
                        expect(res).toBe(
                            '<img src="100x201.jpg" height="201">'
                        );
                    }
                )
            ]);
        });


        it('should autosize local PNG', () => {
            return init(
                '<img src="111x52.png" width="auto" height="104" alt="hi">',
                options
            ).then(res => {
                expect(res).toBe(
                    '<img src="111x52.png" width="222" height="104" alt="hi">'
                );
            });
        });


        it('should autosize remote PNG', () => {
            return init(
                '<img src="http://placehold.it/200x200" width="auto" height="25" alt="hi">',
                options
            ).then(res => {
                expect(res).toBe(
                    '<img src="http://placehold.it/200x200" width="25" height="25" alt="hi">'
                );
            });
        });


        it('should autosize local GIF', () => {
            return init(
                '<img src="140x83.gif" width="auto" height="auto">',
                options
            ).then(res => {
                expect(res).toBe(
                    '<img src="140x83.gif" width="140" height="83">'
                );
            });
        });


        it('should autosize local BMP', () => {
            return init(
                '<img src="33x16.bmp" width="auto" height="auto">',
                options
            ).then(res => {
                expect(res).toBe(
                    '<img src="33x16.bmp" width="33" height="16">'
                );
            });
        });


        it('should autosize local WebP', () => {
            return init(
                '<img src="163x53.webp" width="auto" height="auto">',
                options
            ).then(res => {
                expect(res).toBe(
                    '<img src="163x53.webp" width="163" height="53">'
                );
            });
        });


        it('should autosize local TIFF', () => {
            return init(
                '<img src="63x69.tiff" width="auto" height="auto">',
                options
            ).then(res => {
                expect(res).toBe(
                    '<img src="63x69.tiff" width="63" height="69">'
                );
            });
        });


        it('should autosize local SVG', () => {
            return init(
                '<img src="203x150.svg" width="auto" height="auto">',
                options
            ).then(res => {
                expect(res).toBe(
                    '<img src="203x150.svg" width="203" height="150">'
                );
            });
        });


        it('should skip <img> with empty "src"', () => {
            const html = '<div><img></div>';
            return init(html).then(res => {
                expect(res).toBe(html);
            });
        });


        it('should skip <img> with defined "width" and "height"', () => {
            const html = '<img src="foo.jpg" width="100%" height="100">';
            return init(html).then(res => {
                expect(res).toBe(html);
            });
        });


        it('should skip <img> with "width" and "height" != "auto"', () => {
            const html = '<img src="foo.jpg">';
            return init(html).then(res => {
                expect(res).toBe(html);
            });
        });


        it('should reject if the image is not found', () => {
            const html = '<img src="notExists.jpg" width="auto" height="auto">';
            return init(html)
                .then(() => {
                    throw new Error('Expected method to reject');
                })
                .catch(reason => {
                    expect(reason).toContain('ENOENT');
                    expect(reason).toContain('notExists.jpg');
                });
        });
    });

    context('options.processEmptySize == true', () => {
        const options = { root: './test/img', processEmptySize: true };

        it('should autosize <img> with empty "width" or "height"', () => {
            return Promise.all([
                init('<img src="100x201.jpg">', options).then(res => {
                    expect(res).toBe(
                        '<img src="100x201.jpg" width="100" height="201">'
                    );
                }),

                init('<img src="111x52.png" width="">', options).then(res => {
                    expect(res).toBe(
                        '<img src="111x52.png" width="111" height="52">'
                    );
                }),

                init('<img src="140x83.gif" height="auto">', options).then(
                    res => {
                        expect(res).toBe(
                            '<img src="140x83.gif" height="83" width="140">'
                        );
                    }
                )
            ]);
        });


        it('should autosize <img> and keep aspect ratio with defined "width" xor "height"', () => {
            return Promise.all([
                init('<img src="111x52.png" width="333">', options).then(
                    res => {
                        expect(res).toBe(
                            '<img src="111x52.png" width="333" height="156">'
                        );
                    }
                ),

                init(
                    '<img src="111x52.png" width="333" height="auto">',
                    options
                ).then(res => {
                    expect(res).toBe(
                        '<img src="111x52.png" width="333" height="156">'
                    );
                }),

                init('<img src="111x52.png" height="156">', options).then(
                    res => {
                        expect(res).toBe(
                            '<img src="111x52.png" height="156" width="333">'
                        );
                    }
                ),

                init(
                    '<img src="111x52.png" width="auto" height="156">',
                    options
                ).then(res => {
                    expect(res).toBe(
                        '<img src="111x52.png" width="333" height="156">'
                    );
                })
            ]);
        });


        it('should throw an error if the image is not found', () => {
            const html = '<img src="notExists.jpg">';
            return init(html, options).then(
                () => {
                    throw new Error('Expected method to reject');
                },
                reason => {
                    expect(reason).toContain('ENOENT');
                    expect(reason).toContain('notExists.jpg');
                }
            );
        });
    });
});

function init(html, options) {
    return posthtml([imgAutosize(options)])
        .process(html)
        .then(result => result.html);
}
