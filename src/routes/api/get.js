const Fragment = require('../../Model/fragment');

module.exports = {
  // The existing route logic
  listFragments: (req, res) => {
    // TODO: this is just a placeholder to get something working...
    res.status(200).json({
      fragments: [],
    });
  },

  // The new route logic
  getFragmentById: async (req, res) => {
    const id = req.params.id;
    try {
      const fragmentData = await Fragment.getFragment(id);
      if (fragmentData) {
        res.status(200).json(fragmentData);
      } else {
        res.status(404).send('Fragment not found.');
      }
    } catch (error) {
      res.status(500).send('Internal server error.');
    }
  },
};
