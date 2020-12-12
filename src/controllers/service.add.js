const mongoose = require("mongoose");
const axios = require('axios');
const qs = require('querystring');

const connUri = process.env.MONGO_LOCAL_CONN_URL;
const Service = require("../models/service");
const crypto = require('crypto');


const config = {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
};

module.exports = {
    add: function (req, res, next) {
        mongoose.connect(
            connUri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            },
            (err) => {
                let result = {};
                let status = 201;
                const payload = req.decoded;
                if (payload && payload.user.useraccesslevel === '1') {
                    axios.get('http://172.105.62.12:8010/api/v1/users/' + payload.user._id)
                        .then((response) => {
                            //console.log(response)
                            var credits = response.result.credits;

                            const plan = req.body.plan;
                            let planid;
                            let subplanid;
                            let price;
                            if (plan === 'TEST-1G') {
                                planidi = 2
                                subplanidi = 2
                            } else if (plan === '5Mbps-1month') {
                                planidi = 40;
                                subplanidi = 41;
                                price = 222;
                            } else if (plan === '50Mbps-1Month') {
                                planidi = 41;
                                subplanidi = 42;
                                price = 400;
                            } else if (plan === '100Mbps-1Month') {
                                planidi = 42;
                                subplanidi = 43;
                                price = 600;
                            } else if (plan === '250Mbps-1month') {
                                planidi = 69;
                                subplanidi = 74;
                                price = 1200;
                            } else {
                                planidi = 40;
                                subplanidi = 41;
                                price = 222;
                            }

                            const planid = planidi;
                            const subplanid = subplanidi;
                            const newcredits = credits - price;
                            const password = crypto.randomBytes(10).toString('hex');
                            const location_code = req.body.location_code;
                            const sub_location_code = req.body.sub_location_code;
                            const protocol = req.body.protocol;
                            const connectivity = req.body.connectivity;
                            const prepaid_postpaid = 'Prepaid';
                            const installation_address = 'same';
                            const billing_address = 'same';
                            const email = req.body.email;
                            const data = {
                                userid: 7,
                                api_key: "68b05b2b5c94606aeeb6aaff983241a04d09f6d41dc3664a3a",
                                email: email
                            }
                            axios.post("http://103.141.78.11/crm/api/customer/list",
                                qs.stringify(data),
                                config
                            )
                                .then((result) => {
                                    //console.log(result.data);
                                    const a = result.data.result[0]

                                    const Body = {
                                        userid: 7,
                                        api_key: "68b05b2b5c94606aeeb6aaff983241a04d09f6d41dc3664a3a",
                                        customerid: a['id'],
                                        planid: planid,
                                        subplanid: subplanid,
                                        username: a['email'],
                                        password: password,
                                        location_code: location_code,
                                        sub_location_code: sub_location_code,
                                        protocol: protocol,
                                        connectivity: connectivity,
                                        prepaid_postpaid: prepaid_postpaid,
                                        installation_address: installation_address,
                                        billing_address: billing_address,
                                    }
                                    const data = {
                                        credits: newcredits
                                    }
                                    Service.save(Body, function (err, service) {
                                        if (err)
                                            next(err);
                                        else {
                                            res.json({ status: "success", message: "Test2 updated successfully!!!", data: service });
                                            axios.post("http://103.141.78.11/crm/api/service/create",
                                                qs.stringify(Body),
                                                config

                                            )
                                                .then((result) => {
                                                    console.log(result.data);
                                                })

                                                .catch((err) => {
                                                    console.log(err);
                                                });
                                            axios.put("http://172.105.62.12:8010/api/v1/users/" + payload.user._id,
                                                qs.stringify(data),
                                                config

                                            )
                                                .then((result) => {
                                                    console.log(result.data);
                                                })

                                                .catch((err) => {
                                                    console.log(err);
                                                });
                                        }
                                    });
                                });
                        });
                } else {
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;
                    res.status(status).send(result);

                    mongoose.connection.close(() => {
                        console.log('DATABASE CONNECTION STATUS : DISCONNECTED !!!')
                    });
                }
            },
        )
    },
};