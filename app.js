/**
 * Example template tag that generates a random number 
 * between a user-provided MIN and MAX
 */

const insomnia = require('./insomnia');
const bodyReader = require('./body');
const query = require('./query')
const trigger = require('./trigger');

module.exports.templateTags = [{
    name: 'query',
    displayName: 'Query',
    description: 'Find a value from a request body or response body by search',
    args: [
        {
            displayName: 'Look In Request\' Body',
            description: 'If True, will search in requests, if False will search in responses',
            help: 'If True, will search in requests, if False will search in responses',
            type: 'boolean',
            defaultValue: false
        },
        {
            displayName: 'Target Request',
            description: 'The request which it\'s body, Or it\'s response\'s body would be searched',
            help: 'The request which it\'s body, Or it\'s response\'s body would be searched',
            type: 'model',
            model: 'Request',
        },
        {
            displayName: 'Json Query',
            description: 'The value that is expected to be found in requests/responses being searched',
            help: 'The value that is expected to be found in requests/responses being searched',
            type: 'string',
            model: 'string',
            defaultValue: '$'
        },
        {
            displayName: 'Trigger Behavior',
            help: 'Configure when to resend the dependent request',
            type: 'enum',
            defaultValue: 'never',
            options: [
                {
                    displayName: 'Never',
                    description: 'never resend request',
                    value: 'never',
                },
                {
                    displayName: 'No History',
                    description: 'resend when no responses present',
                    value: 'no-history',
                },
                {
                    displayName: 'When Expired',
                    description: 'resend when existing response has expired',
                    value: 'when-expired',
                },
                {
                    displayName: 'Always',
                    description: 'resend request when needed',
                    value: 'always',
                },
            ],
        },
        {
            displayName: 'Max age (seconds)',
            help: 'The maximum age of a response to use before it expires',
            type: 'number',
            hide: args => args && args[4] &&  args[4].value && args[4].value !== 'when-expired',
            defaultValue: 60,
        }
    ],
    async run(context, isRequest, requestId, queryString, triggerBehavior, maxAgeSeconds) {

        let body = {};

        

        if (isRequest == true) {

            let request = await insomnia.getRequestAsync(context, requestId);

            if (request.body && request.body.mimeType && request.body.mimeType.toLocaleLowerCase() == 'application/json') {

                if (request.body.text) {

                    let textBody = request.body.text;

                    try {

                        let regex = /\{\%.*\%\}/g;

                        textBody = textBody.replaceAll(regex,'null',);

                        body = JSON.parse(textBody);

                    } catch (error) {
                        
                    }
                }
            }
        } else {

            try {
                let response = await insomnia.getResponseAsync(context, requestId);

                const shouldResend = trigger.shouldResend(context, response, triggerBehavior, maxAgeSeconds);

                if (shouldResend && context.renderPurpose === 'send') {

                    response = await context.network.sendRequest(request, [{ name: 'fromResponseTag', value: true }]);
                }

                body = bodyReader.readResponse(context, response);

            } catch (error) {

            }
        }

        let filterObject = query.execute(body, queryString);

        if (typeof filterObject === "object" && filterObject !== null) {

            return JSON.stringify(filterObject);
        }

        return filterObject;
    }
}];