'use strict';

var fs = require('fs');

var got = require('got');
var FormData = require('form-data');

module.exports = function(options, cb) {
  var deploymentName   = options.data && options.data.deploymentName,
      tenantId         = options.data && options.data.tenantId || '',
      file             = options.data && options.data.file || {},
      done             = cb || function() {},
      config           = options.config;


  if (!deploymentName) {
    return done(
      new Error(
        'Failed to deploy process, deployment name must be provided.'
      )
    );
  }

  if (!file.fileType || !file.name || !file.path) {
    return done(
      new Error(
        'Failed to deploy process, file name and path must be provided.'
      )
    );
  }

  var url = (config.get('workspace').endpoints || [])[0];
  if (!url) {
    return done(
      new Error(
        'Failed to deploy process, endpoint url must not be empty.'
      )
    );
  }

  const form = new FormData();

  form.append('deployment-name', deploymentName);
  form.append('tenant-id', tenantId);
  form.append(file.name, fs.createReadStream(file.path));

  got.post(url, {
    body: form
  }).then(function(response) {
    done(null, response.body);
  }).catch(function(error) {
    done(error);
  });
};
