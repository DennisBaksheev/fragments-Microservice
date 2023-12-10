// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const crypto = require('crypto');
const { Fragment } = require('../../Model/fragment');

const createSuccessResponse = require('../../response').createSuccessResponse;
const createErrorResponse = require('../../response').createErrorResponse;

module.exports = async (req, res) => {
  const id = req.params.id;
  let user = crypto.createHash('sha256').update(req.user).digest('hex');
  const idList = await Fragment.byUser(user);

  if (idList.includes(id)) {
    const fragment = await Fragment.byId(user, id);
    if (fragment) {
      // Check if the new content type is supported
      if (Buffer.isBuffer(req.body) && Fragment.isSupportedType(req.headers['content-type'])) {
        // Update the fragment's data and mimeType
        await fragment.setData(req.body);
        fragment.mimeType = req.headers['content-type']; // Update the mimeType

        createSuccessResponse(
          res.status(200).json({
            status: 'ok',
            fragment: fragment,
          })
        );
      } else {
        createErrorResponse(
          res.status(415).json({
            status: 'error',
            message: 'Invalid file type or body empty',
          })
        );
      }
    } else {
      createErrorResponse(
        res.status(404).json({
          status: 'error',
          message: 'Fragment not found',
        })
      );
    }
  } else {
    createErrorResponse(
      res.status(404).json({
        status: 'error',
        message: 'Fragment ID does not exist for user',
      })
    );
  }
};
