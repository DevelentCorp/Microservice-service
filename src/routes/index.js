const service = require("./service");

module.exports = (router) => {
    service(router);
    return router;
};