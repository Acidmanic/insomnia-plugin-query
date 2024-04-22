const iconv = require('iconv-lite');

module.exports.readResponse = function(context, response) {
    
    const bodyBuffer = context.util.models.response.getBodyBuffer(response, '');
    const match = response.contentType.match(/charset=([\w-]+)/);
    const charset = match && match.length >= 2 ? match[1] : 'utf-8';

    // Sometimes iconv conversion fails so fallback to regular buffer
    let stringContent;
    try {
        stringContent = iconv.decode(bodyBuffer, charset);
    }
    catch (err) {
        stringContent = bodyBuffer.toString();
        console.warn('[response] Failed to decode body', err);
    }

    return JSON.parse(stringContent);
};


module.exports.readRequest = function(context, requestId) {
    
    const bodyBuffer = context.util.models.getById(requestId).getBodyBuffer(requestId, '');
    const match = requestId.contentType.match(/charset=([\w-]+)/);
    const charset = match && match.length >= 2 ? match[1] : 'utf-8';

    // Sometimes iconv conversion fails so fallback to regular buffer
    let stringContent;
    try {
        stringContent = iconv.decode(bodyBuffer, charset);
    }
    catch (err) {
        stringContent = bodyBuffer.toString();
        console.warn('[response] Failed to decode body', err);
    }

    return JSON.parse(stringContent);
};
