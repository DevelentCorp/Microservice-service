const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("mongoose-type-email");

// schema maps to a collection
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    userid: {
        type: String,
        required: true,
        trim: true,
    },
    api_key: {
        type: String,
        required: true,
        trim: true,
    },
    customerid: {
        type: String,
        required: true,
        trim: true,
        //unique: true,
    },
    plan: {
        type: String,
        enum: ['TEST-1G', '5Mbps-1month', '50Mbps-1Month', '100Mbps-1Month', '250Mbps-1month'],
        default: '5Mbps-1month',
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    location_code: {
        type: String,
        required: true,
        trim: true,
    },
    sub_location_code: {
        type: String,
        required: true,
        trim: true,
    },
    protocol: {
        type: String,
        required: true,
        trim: true,
    },
    connectivity: {
        type: String,
        required: true,
        trim: true,
    },
    prepaid_postpaid: {
        type: String,
        required: true,
        trim: true,
        default: 'Prepaid',
        //unique: true,
    },
    installation_address: {
        type: String,
        required: true,
        trim: true,
        default: 'same'
    },
    billing_address: {
        type: String,
        required: true,
        trim: true,
        default: 'same'
    },
    createdat: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now,
    },
    updatedat: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now,
    },
    registeredby: {
        type: String,
        required: true,
        trim: true
    }
});


module.exports = mongoose.model("Service", serviceSchema);