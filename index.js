'use strict'

module.exports = function () {
  if (arguments.length === 0) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    const streams = Array.from(arguments)
    const headStream = streams[0]
    const tailStream = streams[streams.length - 1]
    for (const stream of streams) {
      if (!stream.writable && stream !== headStream) {
        const error = new TypeError('Stream is not writable')
        error.stream = stream
        throw error
      }
      if (!stream.readable && stream !== tailStream) {
        const error = new TypeError('Stream is not writable')
        error.stream = stream
        throw error
      }
    }

    let lastStream
    for (const stream of streams) {
      if (lastStream != null) {
        lastStream.pipe(stream)
      }
      stream.on('error', (error) => {
        error.stream = stream
        reject(error)
      })
      lastStream = stream
    }
    lastStream.on('finish', resolve)
  })
}
