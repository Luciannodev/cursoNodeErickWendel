
const Hapi = require('hapi')
const Mongodb = require('./db/Strategies/mongodb/mongodb')
const Context = require('./db/Strategies/base/contexStrategy')
const HeroiSchema = require('./db/Strategies/mongodb/schemas/heroisSchemas')
const HeroRoute = require('./routes/heroRoutes')
const app = new Hapi.Server({
    port: 5000
})
function mapRoutes(instance,methods){
        return methods.map(method => instance[method]())
}
async function main() {
    const conection = Mongodb.connect()
    const context = new Context(new Mongodb(conection, HeroiSchema))

    app.route([
           ...mapRoutes(new HeroRoute(context),HeroRoute.methods()) 
    ])
    await app.start()
    console.log('servidor rodando na porta', app.info.port)
    return app
}
module.exports = main()