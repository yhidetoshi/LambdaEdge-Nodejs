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

var allowUsers = {
    "admin": "pass1",
    "dev": "pass2"
}

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    if (! typeof headers.authorization) {
        callback(null, errorResponse)
    }

    let encodeAuth = headers.authorization[0].value.split(" ");
    let decodeAuth = Buffer.from(encodeAuth[1], 'base64').toString('ascii').split(":");

    const requestUser = decodeAuth[0];
    const requestPassword = decodeAuth[1];

    let exist_flag = false
    for (let key in allowUsers) {
        if (requestUser == key && requestPassword == allowUsers[key]) {
            exist_flag = true
            callback(null, request);
        }
    }
    if (exist_flag == false) {
        callback(null, errorResponse);
    }
};
