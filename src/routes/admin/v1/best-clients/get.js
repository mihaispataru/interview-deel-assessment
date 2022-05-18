/* eslint-disable no-console */
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../../../model');

// start: 1597438800; end: 1597697999
const getBestClients = async (req, res, next) => {
  const {
    start: startTime = null,
    end: endTime = null,
    limit = 2,
  } = req.query;

  if ((startTime === null || endTime === null)) {
    res.status(400).json({
      status: 400,
      title: 'BadRequest',
      detail: 'start and end filters are mandatory',
    });

    return next();
  }

  // Convert limit to number
  const queryLimit = parseInt(limit, 10);

  const query = `
    SELECT
      Profiles.id AS id,
      (Profiles.firstName || ' ' || Profiles.lastName) as fullName,
      SUM(Jobs.price) as paid
    FROM 
      Profiles 
        INNER JOIN Contracts ON Profiles.id = Contracts.ClientId
        INNER JOIN Jobs ON Contracts.id = Jobs.ContractId
    WHERE
      Profiles.type = 'client' AND
      Jobs.paid IS NOT NULL
    GROUP BY
      Profiles.id
    ORDER BY
      paid DESC
    LIMIT :queryLimit
  `;

  const queryOptions = {
    replacements: {
      startTime: (new Date(startTime * 1000)).toISOString(),
      endTime: (new Date(endTime * 1000)).toISOString(),
      queryLimit,
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

module.exports = getBestClients;
