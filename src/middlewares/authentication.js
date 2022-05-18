const { Profile } = require('../model');

const authenticationCache = new Map();

const authentication = async (req, res, next) => {
  const profileId = req.get('profile_id') || null;

  if (profileId === null) {
    return res.status(401).end();
  }

  let profile = authenticationCache.get(profileId) || null;
  if (profile === null) {
    profile = await Profile.findOne(
      {
        where: {
          id: profileId,
        },
      },
    );

    if (!profile) {
      return res.status(401).end();
    }

    authenticationCache.set(profileId, profile);
  }

  req.app.set('profile', profile.dataValues);
  req.app.set('profileId', profile.id);
  req.app.set('profileType', profile.type);

  return next();
};

module.exports = authentication;
