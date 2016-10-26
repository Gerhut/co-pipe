/* eslint-env mocha */
'use strict'

require('should')

const pipe = require('.')

const stream = require('stream')
const Readable = stream.Readable
const Writable = stream.Writable
const Duplex = stream.Duplex
const PassThrough = stream.PassThrough

describe('return', () => {
  it('should be promise', () => {
    return pipe().should.be.Promise()
  })

  it('should not throws', () => {
    return pipe(null).should.be.Promise()
  })
})

describe('arguments', () => {
  it('first one should be readable', () => {
    const writable = new Writable()
    const duplex = new Duplex()
    return pipe(writable, duplex).should.be.rejectedWith({ stream: writable })
  })

  it('last one should be writable', () => {
    const duplex = new Duplex()
    const readable = new Readable()
    return pipe(duplex, readable).should.be.rejectedWith({ stream: readable })
  })

  it('middle ones should be readable', () => {
    const duplex1 = new Duplex()
    const writable = new Writable()
    const duplex2 = new Duplex()
    return pipe(duplex1, writable, duplex2).should.be.rejectedWith({ stream: writable })
  })

  it('middle ones should be writable', () => {
    const duplex1 = new Duplex()
    const readable = new Readable()
    const duplex2 = new Duplex()
    return pipe(duplex1, readable, duplex2).should.be.rejectedWith({ stream: readable })
  })
})

describe('piping', () => {
  it('should be done from the former to the latter', () => {
    const former = new PassThrough()
    const latter = new PassThrough()

    const promise = pipe(former, latter).then(() => {
      latter.read().toString().should.be.exactly('foo')
    })
    former.end('foo')

    return promise
  })
  it('should be done from the first to the third', () => {
    const first = new PassThrough()
    const second = new PassThrough()
    const third = new PassThrough()

    const promise = pipe(first, second, third).then(() => {
      third.read().toString().should.be.exactly('bar')
    })
    first.end('bar')

    return promise
  })
})

describe('error', () => {
  it('should be rejected when the first causes error', () => {
    const readable = new Readable()
    const writable = new Writable()
    const error = new Error()

    const promise = pipe(readable, writable)
    readable.emit('error', error)
    return promise.should.be.rejectedWith({ stream: readable })
      .catch((e) => e.should.be.exactly(error))
  })
  it('should be rejected when the last causes error', () => {
    const readable = new Readable()
    const writable = new Writable()
    const error = new Error()

    const promise = pipe(readable, writable)
    writable.emit('error', error)
    return promise.should.be.rejectedWith({ stream: writable })
      .catch((e) => e.should.be.exactly(error))
  })
  it('should be rejected when the middle causes error', () => {
    const readable = new Readable()
    const duplex = new Duplex()
    const writable = new Writable()
    const error = new Error()

    const promise = pipe(readable, duplex, writable)
    duplex.emit('error', error)
    return promise.should.be.rejectedWith({ stream: duplex })
      .catch((e) => e.should.be.exactly(error))
  })
  it('should not crashed when multiple causes error', () => {
    const readable = new Readable()
    const duplex = new Duplex()
    const writable = new Writable()
    const error1 = new Error()
    const error2 = new Error()

    const promise = pipe(readable, duplex, writable)
    duplex.emit('error', error1)
    writable.emit('error', error2)
    return promise.should.be.rejectedWith({ stream: duplex })
      .catch((e) => e.should.be.exactly(error1))
  })
})
