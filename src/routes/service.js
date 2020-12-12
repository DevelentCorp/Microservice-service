const addcontroller = require("../controllers/service.add");
const getcontroller = require("../controllers/service.getall");
const delcontroller = require("../controllers/service.delete");
const putcontroller = require("../controllers/service.update");
const { validateToken } = require("../../utils");

module.exports = (router) => {
    router.route("/service").post(validateToken, addcontroller.add).get(validateToken, getcontroller.getAll); // This route will be protected


    router.route("/service/:serviceId").delete(validateToken, delcontroller.delete).put(validateToken, putcontroller.update);
};