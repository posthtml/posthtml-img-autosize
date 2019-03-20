# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.1.4] - 2019-03-20
### Added
- Option `questionMarkAsVersion` for handling images with a version in their URL.

## [0.1.3] — 2018-06-28
### Fixed
- Skip images where neither width nor height is "auto".
- Refactor code and fix some minor bugs ([#13]).

## [0.1.2] - 2018-02-25
### Added
- Added support for file paths relative to HTML file.
- Changed supported Node version (now 4).
- Removed dependency "Bluebird", using native Promises.

## [0.1.1] - 2016-01-19
### Added
- Autosize remote images.
- Autosize BMP, SVG, TIFF, and WebP.


[0.1.4]: https://github.com/posthtml/posthtml-img-autosize/compare/0.1.3...0.1.4
[0.1.3]: https://github.com/posthtml/posthtml-img-autosize/compare/0.1.2...0.1.3
[0.1.2]: https://github.com/posthtml/posthtml-img-autosize/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/posthtml/posthtml-img-autosize/compare/0.1.0...0.1.1

[#13]: https://github.com/posthtml/posthtml-img-autosize/pull/13
