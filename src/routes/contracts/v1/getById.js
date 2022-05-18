const { Contract } = require('../../../model');
/**
 * FIX ME!
 * @returns contract by id
 */
const getContractsById = async (req, res, next) => {
  const { id } = req.params;

  const contract = await Contract.findOne({ where: { id } });

  if (!contract) {
    return res.status(404).end();
  }

  res.json(contract);

  return next();
};

module.exports = getContractsById;
