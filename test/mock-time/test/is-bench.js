'use strict'
/* global bench it */

var chai = require('chai')
var assert = chai.assert
var expect = chai.expect
chai.should()
var is = global.is || require('exam/lib/is')
var node = require('assert')

bench('Assertion', function () {
  var foo = 'bar'
  var tea = {flavors: ['assert', 'expect', 'should']}

  it('chai.assert', function () {
    assert.typeOf(foo, 'string')
    assert.equal(foo, 'bar')
    assert.lengthOf(foo, 3)
    assert.property(tea, 'flavors')
    assert.lengthOf(tea.flavors, 3)
  })

  it('chai.expect', function () {
    expect(foo).to.be.a('string')
    expect(foo).to.equal('bar')
    expect(foo).to.have.length(3)
    expect(tea).to.have.property('flavors').with.length(3)
  })

  it('should', function () {
    foo.should.be.a('string')
    foo.should.equal('bar')
    foo.should.have.length(3)
    tea.should.have.property('flavors').with.length(3)
  })

  it('node assert', function () {
    node.strictEqual(typeof foo, 'string')
    node.strictEqual(foo, 'bar')
    node.strictEqual(foo.length, 3)
    node.strictEqual(tea.flavors.length, 3)
  })

  it('is (sweet)', function () {
    is.string(foo)
    is(foo, 'bar')
    is.lengthOf(foo, 3)
    is.lengthOf(tea.flavors, 3)
  })

  it('is (raw)', function () {
    is(typeof foo, 'string')
    is(foo, 'bar')
    is(foo.length, 3)
    is(tea.flavors.length, 3)
  })
})
