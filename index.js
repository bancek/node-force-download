module.exports = forceDownload = function(filename, res) {
  var escapedName = filename.replace(/"/g, '\"');
  var asciiName = escapedName.replace(/[^\x20-\x7E]/g, "?");
  var encodedName = encodeURIComponent(escapedName);

  res.setHeader('Content-Type', 'application/force-download');
  res.setHeader('Content-Disposition', "attachment; filename=\""
    + asciiName + "\"; filename*=UTF-8''" + encodedName);
};
