/* eslint-disable no-console */
const { readdirSync, existsSync } = require('fs');

const getRoutes = () => {
  const ROUTES_PATH = './src/routes';

  return readdirSync(ROUTES_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => {
      if (!existsSync(`${ROUTES_PATH}/${dirent.name}/index.js`)) {
        console.error(
          `The route /${dirent.name} does not contain an index.js file!`,
        );

        return false;
      }

      return true;
    })
    .map((dirent) => `./${dirent.name}`);
};

const applyRoutes = (app) => {
  getRoutes().forEach((route) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    require(route)(app);
  });
};

module.exports = applyRoutes;
