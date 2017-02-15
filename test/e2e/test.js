process.env.NODE_ENV = 'testing'

var should = require('should');
var Nightmare = require('nightmare');

// Set different ports so we can run tests while dev server is running
process.env.WEB_PORT = 8081

// Web tests
require('../../build/server');

console.log("~~~~ Webpack & API servers up, starting e2e tests ~~~~")

var url = `http://localhost:${process.env.WEB_PORT}`;
var testTimeout = 30000

function newNightmare() {
  return new Nightmare({
    show: false
  })
}

Nightmare.prototype.loginPlayer = function (username) {
  return this
    .goto(url)
    .type('#choosenickname', username)
    .click('#write-btn')
}

describe('Start page', function () {
  this.timeout(testTimeout);

  it('should show login form when loaded', function (done) {
    newNightmare()
      .goto(url)
      .evaluate(function () {
        return document.querySelectorAll('div.home').length;
      })
      .run(function (err, result) {
        result.should.equal(1);
        done();
      })
      .catch(done);
  });
});

describe('Game page', function () {
  this.timeout(testTimeout);

  it("should contain the 'Players'", function (done) {
    newNightmare().loginPlayer('john').run(() => {});
    newNightmare().loginPlayer('doe').run(() => {});
    newNightmare().loginPlayer('sinbad')
      .wait('div.game')
      .evaluate(function () {
        return document.querySelectorAll('div.game')[0].innerHTML;
      })
      .run(function (err, result) {
        result.should.containEql("Players");
        done();
      })
      .catch(done);
  });

  it("should contain the current user's name", function (done) {
    var players = ['sinbad', 'ali', 'baba'];
    newNightmare().loginPlayer(players[0]).run(() => {});
    newNightmare().loginPlayer(players[1]).run(() => {});
    newNightmare().loginPlayer(players[2])
      .wait('div.game')
      .evaluate(function () {
        return document.querySelectorAll('div.game')[0].innerHTML;
      })
      .end()
      .then(function (result) {
        // Check for all players
        result.should.containEql(players[0]);
        result.should.containEql(players[1]);
        result.should.containEql(players[2]);
        done();
      })
      .catch(done);
  });

  it("should return to home page when quit button is pressed", function (done) {
    newNightmare().loginPlayer('ali').run(() => {});
    newNightmare().loginPlayer('baba').run(() => {});
    var nightmare = newNightmare().loginPlayer('sinbad')
    nightmare
      .wait('div.game')
      .evaluate(function () {
        return document.querySelectorAll('#write-btn').length;
      })
      .then(function (result) {
        // No 'write' buttons found
        result.should.eql(0);
      })
      .then(function () {
        return nightmare
          .click('#quit-btn')
          .wait('div.home')
          .evaluate(function () {
            return document.querySelectorAll('#write-btn').length;
          })
      })
      .then(function (result) {
        // After quitting, we should have a write button
        result.should.eql(1);
        done();
      })
      .catch(done);
  });

  xit("should select a player's suggestion if its get a majority vote", function (done) {
    var suggestion = "Dolly was a little lamb";
    var players = ['sinbad', 'ali', 'baba'];
    var p1 = newNightmare().loginPlayer(players[0]).run(() => {});
    var p2 = newNightmare().loginPlayer(players[1]).run(() => {});
    var p3 = newNightmare().loginPlayer(players[2])
      .wait('div.game')
      .evaluate(function () {
        return document.querySelectorAll('div.game')[0].innerHTML;
      })
      .end()
      .then(function (result) {
        // Check for all players
        result.should.containEql(players[0]);
        result.should.containEql(players[1]);
        result.should.containEql(players[2]);
        done();
      })
      .then(function () {
        p1.type('.suggestion', suggestion)
          .evaluate(function () {
            return document.querySelectorAll('#story')
          })
          .end()
          .then(function (result) {
            result.should.not.containEql(suggestion)
          })
        p2.click(".vote-button[0]").run();
        p3.click(".vote-button[0]").run();
        p1.evaluate(function () {
            return document.querySelectorAll('#story')
          })
          .end()
          .then(function (result) {
            result.should.containEql(sugestion)
          })
      })
      .catch(done);
  });
})

describe('Queue page', function () {
  this.timeout(testTimeout);

  // https://github.com/write-io/groupwrite.io/issues/24
  xit("should kick a player out if they disconnect", function (done) {
    var nightmare = newNightmare()
    nightmare
      .loginPlayer('sinbad')
      .wait('div.queue')
      .evaluate(function () {
        return document.querySelectorAll('.waiting')[0].innerHTML;
      })
      .then(function (result) {
        // 1 player logged in
        result.should.containEql("Waiting for players 1/3");
      })
      .then(function () {
        return nightmare
          .loginPlayer('ali')
          .wait('div.queue')
          .evaluate(function () {
            return document.querySelectorAll('.waiting')[0].innerHTML;
          })
      })
      .then(function (result) {
        // We left the page, so we should not see our shadow in the queue!
        result.should.containEql("Waiting for players 1/3");
        done();
      })
      .catch(done)
  });
})
