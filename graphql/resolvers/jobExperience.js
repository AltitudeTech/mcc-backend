const { JobExperienceTC } = require('../composers');

const createAndUpdateCandidate = exports.createAndUpdateCandidate =  () => {
	return JobExperienceTC.get('$findByIds').wrapResolve(next => async (rp) => {
		//get contextCandidate from resolveParams (rp)
		const { contextCandidate } = rp
		const _field = contextCandidate[field]
		if (Array.isArray(_field)) {
			//add field to db and get result of createOne resolver
			const result = await next(rp);
			contextCandidate[field].push(result.recordId);
			try {
				await contextCandidate.save();
				return result;
			} catch (e) {
				//Placeholder function to stop the field from saving to the db
				result.record.remove().exec();
				throw new Error(`Unexpected error adding the document to candidate`);
			}
		} else {
			throw new Error(`Field: ${field} is not an collection field`);
		}
	});
}
