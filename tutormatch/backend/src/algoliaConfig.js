import algoliasearch from 'algoliasearch';

const algoliaConfig = {
    posts: {
      appId: 'R7E5FEZGEQ',
      apiKey: 'dcb1af4231269f44fbfd224af6268aae',
      indexName: 'posts',
    },
    users: {
      appId: 'R7E5FEZGEQ',
      apiKey: '79b541af3529de1e1cb84f5df6d08c27',
      indexName: 'users',
    },
  };

  const createAlgoliaClient = (indexName) => {
    const { appId, apiKey } = algoliaConfig[indexName];
    const algoliaClient = algoliasearch(appId, apiKey);
    return algoliaClient.initIndex(algoliaConfig[indexName].indexName);
  };
  
  export { createAlgoliaClient };
