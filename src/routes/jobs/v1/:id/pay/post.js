/* eslint-disable no-console */
const { Contract, Job, sequelize, Profile } = require('../../../../../model');

const postJobIdPay = async (req, res, next) => {
  const profileId = req.app.get('profileId') || null;
  const profileType = req.app.get('profileType') || null;
  const profile = req.app.get('profile') || null;

  const {
    id: jobId = null,
  } = req.params;

  // Restrict access to this resource only for client type profiles
  if (profileType !== 'client') {
    res.status(403).json({
      status: 403,
      title: 'Forbidden',
      detail: 'You do not have access to this resource',
    });

    return next();
  }

  // Get job data and check if it belongs to the logged in profile
  let jobData = {};
  try {
    const result = await Contract.findOne({
      where: {
        clientId: profileId,
      },
      include: {
        model: Job,
        required: true,
        where: {
          id: jobId,
        },
      },
    });

    if (result === null) {
      res.status(404).json(
        {
          status: 404,
          title: 'NotFound',
          detail: 'This resource does not exist',
        },
      );
    }

    jobData = result.toJSON();

    Object.assign(jobData, {
      job: result.Jobs[0].dataValues,
    });
    delete jobData.Jobs;
  } catch (e) {
    console.error(e);

    res.status(500).json(
      {
        status: 500,
        title: 'NotFound',
        detail: 'This resource does not exist',
      },
    );
  }

  // Execute the payment transaction
  try {
    const jobPayedTransaction = await sequelize.transaction(async (t) => {
      const getJob = await Job.findOne({
        where: {
          id: jobId,
        },
        transaction: t,
      });

      if (getJob.paid === true) {
        throw new Error('__payment_already_payed__');
      }

      const getProfile = await Profile.findOne({
        where: {
          id: profileId,
        },
        transaction: t,
      });

      if (getProfile.balance < getJob.price) {
        throw new Error('__insufficient_balance__');
      }

      // Decrement the job price from client balance
      getProfile.set('balance', getProfile.balance - getJob.price);

      await getProfile.save({
        transaction: t,
      });

      // Set the job as payed
      getJob.set('paid', 1);
      getJob.set('paymentDate', (new Date()).toISOString());

      await getJob.save({
        transaction: t,
      });

      return getJob.toJSON();
    });

    res.json(jobPayedTransaction);

    return next();
  } catch (e) {
    console.error(e);
    // Transaction was already rolled back

    switch (e.message) {
      case '__payment_already_payed__':
        res.status(400).json(
          {
            status: 400,
            title: 'BadRequest',
            detail: 'Job was already payed. Thank you.',
          },
        );
        break;
      case '__insufficient_balance__':
        res.status(400).json(
          {
            status: 400,
            title: 'BadRequest',
            detail: 'Insufficient money in balance to pay this job',
          },
        );
        break;
      default:
        res.status(500).json({
          status: 500,
          title: 'ServerError',
          detail: 'Something was wrong with the payment. Please try again.',
        });
      break;
    }
  }

  return next();
};

module.exports = postJobIdPay;
