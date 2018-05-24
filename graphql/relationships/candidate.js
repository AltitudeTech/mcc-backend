const { CandidateTC, JobExperienceTC, EducationTC, CertificateTC, RefereeTC, CandidateDocumentTC, CaseFileTC } = require('../composers');

module.exports = () => {
  CandidateTC.addRelation('experience', {
      resolver: () => JobExperienceTC.getResolver('findByIds'),
      prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
        _ids: (source) => source.experience,
      },
      projection: { experience: true }, // point fields in source object, which should be fetched from DB
    }
  );
  CandidateTC.addRelation('education', {
      resolver: () => EducationTC.getResolver('findByIds'),
      prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
        _ids: (source) => source.education,
      },
      projection: { education: true }, // point fields in source object, which should be fetched from DB
    }
  );
  CandidateTC.addRelation('certificates', {
      resolver: () => CertificateTC.getResolver('findByIds'),
      prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
        _ids: (source) => source.certificates,
      },
      projection: { certificates: true }, // point fields in source object, which should be fetched from DB
    }
  );
  CandidateTC.addRelation('referees', {
      resolver: () => RefereeTC.getResolver('findByIds'),
      prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
        _ids: (source) => source.referees,
      },
      projection: { referees: true }, // point fields in source object, which should be fetched from DB
    }
  );
  CandidateTC.addRelation('documents', {
      resolver: () => CandidateDocumentTC.getResolver('findByIds'),
      prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
        _ids: (source) => source.documentsUploaded,
      },
      projection: { documentsUploaded: true }, // point fields in source object, which should be fetched from DB
    }
  );
  CandidateTC.addRelation('caseFiles', {
      resolver: () => CaseFileTC.getResolver('findByIds'),
      prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
        _ids: (source) => source.caseFiles,
      },
      projection: { caseFiles: true }, // point fields in source object, which should be fetched from DB
    }
  );
  CandidateTC.addRelation('documentsPagination', {
      resolver: () => CandidateDocumentTC.getResolver('pagination'),
      prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
        filter: (source) => ({ _ids: source.documentsUploaded}),
      },
      projection: { jobs: true }, // point fields in source object, which should be fetched from DB
    }
  );
}
