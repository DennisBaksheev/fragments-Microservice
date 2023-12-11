const crypto = require('crypto');
const { Fragment } = require('../../Model/fragment');
const md = require('markdown-it')();
const { htmlToText } = require('html-to-text');
const sharp = require('sharp');
const createErrorResponse = require('../../response').createErrorResponse;

const getExtensionContentType = (extension) => {
  switch (extension) {
    case 'txt':
      return 'text/plain';
    case 'md':
      return 'text/markdown';
    case 'html':
      return 'text/html';
    case 'json':
      return 'application/json';
    case 'png':
      return 'image/png';
    case 'jpg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return null;
  }
};

const convertData = async (data, from, to) => {
  let convertedData = data;
  switch (from) {
    case 'text/markdown':
      if (to === 'txt') {
        convertedData = md.render(data.toString());
        convertedData = htmlToText(convertedData);
      } else if (to === 'html') {
        convertedData = md.render(data.toString());
      }
      break;
    case 'text/html':
      if (to === 'txt') {
        convertedData = htmlToText(data.toString());
      }
      break;
    case 'application/json':
      if (to === 'txt') {
        convertedData = JSON.stringify(data);
      }
      break;
    case 'image/png':
    case 'image/jpeg':
    case 'image/webp':
    case 'image/gif':
      convertedData = await sharp(data).toFormat(to.split('/')[1]).toBuffer();
      break;
  }
  return convertedData;
};

function validConversion(contentType, extension) {
  let formats = [];
  switch (contentType) {
    case 'text/plain':
      formats = ['.txt'];
      break;
    case 'text/markdown':
      formats = ['.md', '.html', '.txt'];
      break;
    case 'text/html':
      formats = ['.html', '.txt'];
      break;
    case 'application/json':
      formats = ['.json', '.txt'];
      break;
    case 'image/png':
    case 'image/jpeg':
    case 'image/webp':
    case 'image/gif':
      formats = ['.png', '.jpg', '.webp', '.gif'];
      break;
    default:
      return false;
  }
  return formats.some((element) => element.includes('.' + extension));
}

module.exports = async (req, res) => {
  const idWithExt = req.params.id;
  let user = crypto.createHash('sha256').update(req.user).digest('hex');
  const idWithExtArray = idWithExt.split('.');
  let id, ext;

  if (idWithExtArray.length > 1) {
    id = idWithExtArray[0];
    ext = idWithExtArray[1];
  } else {
    id = idWithExtArray[0];
    ext = null;
  }

  const idList = await Fragment.byUser(user);
  if (!idList.includes(id)) {
    return createErrorResponse(
      res.status(404).json({
        message: 'Fragment not found!',
      })
    );
  }

  const fragmentObject = await Fragment.byId(user, id);
  let fragment = fragmentObject instanceof Fragment ? fragmentObject : new Fragment(fragmentObject);
  let dataResult = await fragment.getData();

  if (ext) {
    if (validConversion(fragment.mimeType, ext)) {
      const extensionType = getExtensionContentType(ext);
      const convertedData = await convertData(dataResult, fragment.mimeType, extensionType);

      res.setHeader('Content-Type', extensionType);
      res.status(200).send(convertedData);
    } else {
      // Handle unsupported conversion
      return createErrorResponse(
        res.status(415).json({
          message: 'Unsupported conversion',
        })
      );
    }
  } else {
    res.setHeader('Content-Type', fragment.mimeType);
    res.status(200).send(dataResult);
  }
};
