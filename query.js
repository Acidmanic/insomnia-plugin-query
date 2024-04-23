


function parseEvaluationPhrase(obj, phrase) {


    let cleanPhrase = phrase.trim();

    if (cleanPhrase.startsWith('(') && cleanPhrase.endsWith(')')) {

        let term = cleanPhrase.substring(1, cleanPhrase.length - 1);

        term = term.replace('@', 'o.');

        let evaluationFunction = new Function('o', "{ return (" + term + ");}");

        return { success: true, term: term, evaluationFunction };
    }



    return {
        success: false
    };


}


function evaluate(obj, segments, index) {


    if (index >= segments.length) {

        return obj;
    }

    let seg = segments[index];

    if (seg == '$') {

        return evaluate(obj, segments, index + 1);
    }

    let foundAsProperty = obj[seg];

    if (foundAsProperty) {

        return evaluate(foundAsProperty, segments, index + 1);
    }


    let foundEvaluator = parseEvaluationPhrase(obj, seg);

    if (foundEvaluator && foundEvaluator.success) {

        for (const property in obj) {

            try {
                if (foundEvaluator.evaluationFunction(obj[property])) {

                    return evaluate(obj[property], segments, index + 1);
                }
            } catch (error) {

            }
        }

    }

    return {};
}



module.exports.execute = function (body, query) {

    const sanitizedQuery = query.trim();

    let querySegments = sanitizedQuery.split('.');

    if (querySegments && querySegments.length > 0 && querySegments[0] == '$') {


        return evaluate(body, querySegments, 0);
    }

    return {};
}