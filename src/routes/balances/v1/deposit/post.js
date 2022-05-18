/* eslint-disable no-console */
const {
  Contract,
  Job,
  sequelize,
  Profile,
} = require('../../../../model');

const postBalancesDeposit = async (req, res, next) => {
  const profileId = req.app.get('profileId') || null;
  const profileType = req.app.get('profileType') || null;

  const {
    ammount = null,
  } = req.body;

  if (ammount === null) {
    res.status(400).json({
      status: 400,
      title: 'BadRequest',
      detail: 'The ammount is mandatory',
    });

    return next();
  }

  // Restrict access to this resource only for client type profiles
  if (profileType !== 'client') {
    res.status(403).json({
      status: 403,
      title: 'Forbidden',
      detail: 'You do not have access to this resource',
    });

    return next();
  }

  // Execute the deposit transaction
  try {
    const jobPayedTransaction = await sequelize.transaction(async (t) => {
      // Decrement the job price from client balance
      const getProfile = await Profile.findOne({
        where: {
          id: profileId,
        },
        transaction: t,
      });

      const getJobs = await Contract.findAll({
        where: {
          ClientId: profileId,
        },
        include: {
          model: Job,
          required: true,
          where: {
            paid: null,
          },
        },
      });

      // Calculate the outstanding ammount
      let outstandingAmmount = -1;
      getJobs.forEach((contract) => {
        contract.Jobs.forEach((job) => {
          outstandingAmmount += job.price;
        });
      });

      if (((ammount / outstandingAmmount).toFixed(2) * 100) > 25) {
        throw new Error('__ammount_to_high__');
      }

      getProfile.set('balance', getProfile.balance + ammount);

      await getProfile.save({
        transaction: t,
      });

      return getProfile.toJSON();
    });

    res.json(jobPayedTransaction);

    return next();
  } catch (e) {
    console.error(e);
    // Transaction was already rolled back
    switch (e.message) {
      case '__ammount_to_high__':
        res.status(400).json(
          {
            status: 400,
            title: 'BadRequest',
            detail: 'You cannot deposit more than 25% of your outstanding payments.',
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

module.exports = postBalancesDeposit;
