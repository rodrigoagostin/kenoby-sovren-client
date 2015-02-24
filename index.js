'use strict';

var soap, async, parser;
soap = require('soap');
async = require('async');
parser = require('xml2json');

module.exports = function sovrenClient(url, id, key) {
  return function (file, next) {
    async.waterfall([function (next) {
      soap.createClient(url, next);
    }, function (client, next) {
      client.ParsingService.ParsingServiceSoap12.ParseResume({'request' : {
        'AccountId'    : id,
        'ServiceKey'   : key,
        'FileBytes'    : (new Buffer(file)).toString('base64')
      }}, next);
    }, function (data, _, a, next) {
      next(null, parser.toJson(data.ParseResumeResult.Xml, {'object': true}).Resume.StructuredXMLResume);
    }], next);
  };
};