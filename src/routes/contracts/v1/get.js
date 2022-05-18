const { Contract } = require('../../../model');
/**
 * FIX ME!
 * @returns contract by id
 */
const getContracts = async (req, res, next) => {
  const profileId = req.app.get('profileId') || null;
  const profileType = req.app.get('profileType') || null;

  const contractSearch = {};

  if (profileType === 'client') {
    Object.assign(contractSearch, { ClientId: profileId });
  } else if (profileType === 'contractor') {
    Object.assign(contractSearch, { ContractorId: profileId });
  } else {
    return res.status(400).json({
      status: 400,
      title: 'BadRequest',
      detail: 'Unkown profile type',
    });
  }

  const contract = await Contract.findAll(
    {
      where: contractSearch,
    },
  );

  if (!contract) {
    return res.status(404).json({
      status: 404,
      title: 'NotFound',
      detail: 'Contract not found',
    });
  }

  res.json(contract);

  return next();
};

module.exports = getContracts;
