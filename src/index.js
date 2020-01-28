const ContextStrategy =  require('./Strategies/base/contexStrategy')
const Postgres =  require('./Strategies/postgres')
const MongoDB =  require('./Strategies/mongodb')



const contextMongo = new ContextStrategy(new MongoDB())
contextMongo.create()

const contextpostgres = new ContextStrategy(new Postgres())
contextpostgres.create()

