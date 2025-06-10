module.exports = {
  nodeClasses: {
    Flowtly: require('./dist/nodes/Flowtly/Flowtly.node.js').Flowtly,
  },
  credentialClasses: {
    FlowtlyApi: require('./dist/credentials/FlowtlyApi.credentials.js').FlowtlyApi,
  },
}; 