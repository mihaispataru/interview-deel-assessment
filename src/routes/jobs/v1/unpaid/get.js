/* eslint-disable no-console */
const { Contract, Job } = require('../../../../model');

const getJobsUnpaid = async (req, res, next) => {
  const profileId = req.app.get('profileId') || null;
  const profileType = req.app.get('profileType') || null;

  const queryOptions = {
    include: {
      model: Job,
      required: true,
      where: {
        paid: null,
      },
    },
  };

  if (profileType === 'client') {
    Object.assign(queryOptions, { where: { ClientId: profileId } });
  } else if (profileType === 'contractor') {
    Object.assign(queryOptions, { where: { ContractorId: profileId } });
  } else {
    return res.status(400).json({
      status: 400,
      title: 'BadRequest',
      detail: 'Unkown profile type',
    });
  }

  try {
    const result = await Contract.findAll(queryOptions);
    let unpaidJobs = [];

    result.forEach((item) => {
      unpaidJobs = unpaidJobs.concat(item.Jobs);
    });

    res.json(unpaidJobs);
  } catch (e) {
    console.error(e);

    res.status(500).json(
      {
        status: 500,
        title: 'ServerError',
        detail: e.message,
      },
    );
  }

  return next();
};

module.exports = getJobsUnpaid;
