import algoliasearch from "algoliasearch";
import dotenv from "dotenv";

dotenv.config();

const algoliaConfig = {
  posts: {
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_POST_API_KEY,
    indexName: "posts",
  },
  users: {
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_USER_API_KEY,
    indexName: "users",
  },
};

const createAlgoliaClient = (indexName) => {
  const { appId, apiKey } = algoliaConfig[indexName];
  const algoliaClient = algoliasearch(appId, apiKey);
  return algoliaClient.initIndex(algoliaConfig[indexName].indexName);
};

export { createAlgoliaClient };
