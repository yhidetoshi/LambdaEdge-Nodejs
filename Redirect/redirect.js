
// すべてのリクエストを別ホストにリダイレクトする //
/*
'use strict';

var REDIRECT_TARGET_URL = 'http://fuga.cloudfront.net';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;


    var redirectResponse = {
        status: '301',
        statusDescription: 'Moved Permanently',
        body: 'Authentication Failed',
        headers: {
            'location': [
                {
                    key: 'Location',
                    value: REDIRECT_TARGET_URL
                }
            ]
        },
    }
    callback(null, redirectResponse);
}
*/

// 特定のパス配下のアクセスを同じホストの別パスにリダイレクトする //
//  /v1/ --> /v2/
//  hoge.cloudfront.net/v1/index.html --> hoge.cloudfront.net/v2/index.html

'use strict';

var PATH_PATTERN = '^\/v1\/';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const host = headers.host[0].value;
    const uri = request.uri;

    const redirectURL = 'http://' + host + '/v2/index.html'

    if (uri.match(PATH_PATTERN)) {
        var redirectResponse = {
            status: '301',
            statusDescription: 'Moved Permanently',
            body: 'Authentication Failed',
            headers: {
                'location': [
                    {
                        key: 'Location',
                        value: redirectURL
                    }
                ]
            },
        }
        callback(null, redirectResponse);
    }
    callback(null, request)
}
