# co-pipe

[![Greenkeeper badge](https://badges.greenkeeper.io/Gerhut/co-pipe.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/Gerhut/co-pipe.svg?branch=master)](https://travis-ci.org/Gerhut/co-pipe)
[![Coverage Status](https://coveralls.io/repos/github/Gerhut/co-pipe/badge.svg?branch=master)](https://coveralls.io/github/Gerhut/co-pipe?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![dependencies Status](https://david-dm.org/Gerhut/co-pipe/status.svg)](https://david-dm.org/Gerhut/co-pipe)
[![devDependencies Status](https://david-dm.org/Gerhut/co-pipe/dev-status.svg)](https://david-dm.org/Gerhut/co-pipe?type=dev)

Wait the completion of piping.

## Install

    $ npm install co-pipe

## Usage

### Vanilla Promise

```javascript
const fs = require('fs')
const pipe = require('co-pipe')

const reader = fs.createReadStream('foo.txt')
const writer = fs.createWriteStream('bar.txt')

pipe(reader, writer).then(
  () => console.log('File successfully copied.'),
  (error) => console.log(`Something was wrong with ${
    error.stream === reader ? 'reader' : 'writer'
  }`)
)
```

### Use with co

```javascript
const fs = require('fs')
const co = require('co')
const pipe = require('co-pipe')

co(function * () {
  const reader = fs.createReadStream('foo.txt')
  const writer = fs.createWriteStream('bar.txt')

  try {
    yield pipe(reader, writer)
    console.log('File successfully copied.')
  } catch (error) {
    console.log(`Something was wrong with ${
      error.stream === reader ? 'reader' : 'writer'
    }`)
  }
})
```

### Use with koa

```javascript
const fs = require('fs')
const koa = require('koa')
const pipe = require('co-pipe')

const app = koa()

app.use(function * () {
  const writer = fs.createWriteStream('foo.txt')
  yield pipe(this.req, writer)
  this.body = 'Request successfully written to foo.txt'
})
```

### Multiple Streams

```javascript
const fs = require('fs')
const zlib = require('zlib')
const pipe = require('co-pipe')

const reader = fs.createReadStream('foo.txt')
const gzip = zlib.createGzip()
const writer = fs.createWriteStream('bar.txt.gz')

pipe(reader, gzip, writer).then(
  () => console.log('File successfully gzipped.'),
  (error) => console.log(`Something was wrong with ${
    error.stream === reader ? 'reader' :
      (error.stream === gzip ? 'gzip' : 'writer')
  }`)
)
```

# License

MIT
