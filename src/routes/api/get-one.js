const logger = require('../../logger');

var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../Model/fragment');

/**
 * Get a fragment for the current user
 */
module.exports = async (req, res) => {
  try {
      const fragment = await Fragment.byId(req.user, req.params.id);

      // Check if the fragment's type is supported
      if (!Fragment.isSupportedType(fragment.type)) {
          res.status(415).json(createErrorResponse(415, 'Unsupported content type'));
          return;
      }

      // Handle different conversion types based on the extension
      switch (req.params.ext) {
          case 'html': {
              // Convert Markdown to HTML
              if (fragment.type === 'text/markdown') {
                  const markdownData = (await fragment.getData()).toString();
                  const htmlData = md.render(markdownData);
                  res.set('Content-Type', 'text/html').status(200).send(htmlData);
              } else {
                  res.status(415).json(createErrorResponse(415, 'Unsupported conversion to HTML'));
              }
              break;
          }
          case 'txt': {
              // Convert to plain text (if applicable)
              const textData = (await fragment.getData()).toString();
              res.set('Content-Type', 'text/plain').status(200).send(textData);
              break;
          }
          case undefined: {
              // Return original data
              const originalData = await fragment.getData();
              res.set('Content-Type', fragment.type).status(200).send(originalData);
              break;
          }
          default:
              // Unsupported extension
              res.status(415).json(createErrorResponse(415, 'Unsupported or unknown extension'));
              break;
      }
  } catch (err) {
      logger.error({ err }, 'error on get-one endpoint');
      res.status(404).json(createErrorResponse(404, 'No Fragment Found'));
  }
};
