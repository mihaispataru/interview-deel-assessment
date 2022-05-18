/* eslint-disable no-console */
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../../../model');

// start: 1597438800; end: 1597697999
const getBestProfession = async (req, res, next) => {
  const {
    start: startTime = null,
    end: endTime = null,
  } = req.query;

  if ((startTime === null || endTime === null)) {
    res.status(400).json({
      status: 400,
      title: 'BadRequest',
      detail: 'start and end filters are mandatory',
    });

    return next();
  }

  const query = `
    SELECT
      Profiles.profession,
      SUM(Jobs.price) as total_earned
    FROM 
      Profiles 
        INNER JOIN Contracts ON Profiles.id = Contracts.ContractorId
        INNER JOIN Jobs ON Contracts.id = Jobs.ContractId
    WHERE
      Profiles.type = 'contractor' AND
      Jobs.paid IS NOT NULL AND
      paymentDate >= :startTime AND paymentDate <= :endTime
    GROUP BY
      Profiles.profession
    ORDER BY
      total_earned DESC
  `;

  const queryOptions = {
    replacements: {
      startTime: (new Date(startTime * 1000)).toISOString(),
      endTime: (new Date(endTime * 1000)).toISOString(),
    },
    type: QueryTypes.SELECT,
  };

  try {
    const queryResult = await sequelize.query(
      query,
      queryOptions,
    );

    const result = [];

    queryResult.forEach((item) => {
      result.push(item);
    });

    res.json(result);
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

module.exports = getBestProfession;
