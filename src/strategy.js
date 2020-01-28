class NotImplementedException extends Error {
    constructor() {
        super('not implemented exception')
    }
}


const contextMongo = new ContextStrategy(new MongoDB())
contextMongo.create()

const contextpostgres = new ContextStrategy(new Postgres())
contextpostgres.create()

