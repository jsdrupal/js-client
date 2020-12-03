const request = require('@drupal/client').request;

module.exports = async () => {
  const resp = await request({
      base: 'https://cms.contentacms.io/api',
    entity: 'menus',
  });
  return resp;
};
