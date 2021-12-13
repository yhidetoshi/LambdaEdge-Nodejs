'use strict';

var errorResponse = {
    status: '401',
    statusDescription: 'Unauthorized',
    body: 'Authentication Failed',
    headers: {
        'www-authenticate': [
            {
                key: 'WWW-Authenticate', value: 'Basic'
            }
        ]
    },
}

var allowIp = ['X.X.X.X', 'X.X.X.X']

var allowUsers = {
    "admin": "pass1",
    "dev": "pass2"
}


exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const clientIp = request.clientIp

    if (validateClientIp(clientIp)) {
        callback(null, request)
    }

    if (! typeof headers.authorization) {
        callback(null, errorResponse)
    }

    let encodeAuth = headers.authorization[0].value.split(" ");
    let decodeAuth = Buffer.from(encodeAuth[1], 'base64').toString('ascii').split(":");

    const requestUser = decodeAuth[0];
    const requestPassword = decodeAuth[1];
    if (validateAuth(requestUser, requestPassword)) {
        callback(null, request)
    } else {
        callback(null, errorResponse)
    }
};

function validateAuth(user, password) {
    let exist_flag = false
    for (let key in allowUsers) {
        if (user === key && password === allowUsers[key]) {
            exist_flag = true
            return true;
        }
    }
    if (exist_flag === false) {
        return false;
    }
}

function validateClientIp(clientIp) {
    if (allowIp.indexOf(clientIp) !== -1) {
        return true
    } else {
        return false
    }
}