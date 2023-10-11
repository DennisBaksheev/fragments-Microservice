const { readFragment, writeFragment, readFragmentData, writeFragmentData } = require('./data');
const logger = require('../logger'); // Importing the logger

class Fragment {
  static async getFragment(id) {
    try {
      const result = await readFragment(id);
      logger.info(`Successfully retrieved fragment with id: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Error retrieving fragment with id: ${id}`, err);
      throw err;
    }
  }

  static async setFragment(id, data) {
    try {
      const result = await writeFragment(id, data);
      logger.info(`Successfully set fragment with id: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Error setting fragment with id: ${id}`, err);
      throw err;
    }
  }

  static async getFragmentData(id) {
    try {
      const result = await readFragmentData(id);
      logger.info(`Successfully retrieved fragment data with id: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Error retrieving fragment data with id: ${id}`, err);
      throw err;
    }
  }

  static async setFragmentData(id, data) {
    try {
      const result = await writeFragmentData(id, data);
      logger.info(`Successfully set fragment data with id: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Error setting fragment data with id: ${id}`, err);
      throw err;
    }
  }

  static isSupportedType(type) {
    const supportedTypes = ['text/plain', 'application/json'];
    return supportedTypes.includes(type);
  }
}

module.exports = Fragment;
