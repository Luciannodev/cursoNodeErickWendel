const Hapi = require('hapi')
const Mongodb = require('./db/Strategies/mongodb/mongodb')
const Context = require('./db/Strategies/base/contexStrategy')
const HeroiSchema = require('./db/Strategies/mongodb/schemas/heroisSchemas')

const app = new Hapi.Server({
    port: 5000
})
async function main() {
    const conection = Mongodb.connect()
    const context = new Context(new Mongodb(conection, HeroiSchema))

    app.route([{
        path: '/herois',
        method: 'GET',
        handler: (Request, head) => {
            return context.read()
        }
    }])
    await app.start()
    console.log('servidor rodando na porta', app.info.port)
    return app
}
module.exports = main()