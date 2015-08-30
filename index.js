'use strict';

var url = require('url');
var util = require('util');
var contra = require('contra');
var request = require('request');
var cheerio = require('cheerio');
var base = 'https://lobste.rs';

function hackerpub (options, done) {
  var o = parse(options);
  var jar = request.jar();

  contra.waterfall([
    function placement (next) {
      go(jar, 'GET', '/login', {}, next);
    },
    function login (res, body, next) {
      var data = {
        utf8: '✓',
        authenticity_token: secret(body, 'authenticity_token'),
        commit: 'Login',
        email: o.username,
        password: o.password
      }
      go(jar, 'POST', '/login', data, next);
    },
    function token (res, body, next) {
      go(jar, 'GET', '/stories/new', {}, next);
    },
    function act (res, body, next) {
      var data = {
        utf8: '✓',
        authenticity_token: secret(body, 'authenticity_token'),
        commit: 'Submit',
        story: {
          url: o.url,
          title: o.title,
          tags_a: o.tags,
          description: o.description,
          user_is_author: o.author ? 1 : 0
        }
      };
      var req = go(jar, 'POST', '/stories', data, next);
    },
    function grab (res, body, next) {
      next(null, res, body, res.url);
    }
  ], done);
}

function secret (html, field) {
  return cheerio.load(html)(util.format('[name=%s]', field)).val();
}

function parse (options) {
  if (!options) {
    return {};
  }

  var o = {};

  mov('username');
  mov('password');
  mov('title');
  mov('url');
  mov('description');
  arr('tags');
  boo('author');

  o.tags.unshift('');
  return o;

  function mov (key) {
    o[key] = typeof options[key] === 'string' ? options[key] : '';
  }
  function boo (key) {
    o[key] = typeof options[key] === 'boolean' ? options[key] : false;
  }
  function arr (key) {
    o[key] = Array.isArray(options[key]) ? options[key] : [];
  }
}

function go (jar, method, pathname, data, done) {
  return request({
    url: base + pathname,
    method: method,
    jar: jar,
    form: data,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    followAllRedirects: true,
    qsStringifyOptions: {
      arrayFormat: 'brackets'
    }
  }, done);
}

module.exports = hackerpub;
