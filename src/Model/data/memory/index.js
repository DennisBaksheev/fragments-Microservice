const MemoryDB = require('./memory-db.js');
const db = new MemoryDB();

module.exports = {
  readFragment: (id) => db.get('fragments', id),
  writeFragment: (id, data) => db.put('fragments', id, data),
  readFragmentData: (id) => db.get('fragmentData', id),
  writeFragmentData: (id, data) => db.put('fragmentData', id, data),
};
