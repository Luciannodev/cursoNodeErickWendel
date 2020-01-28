const assert = require('assert')
const Postgres = require('./../db/Strategies/postgres/postgres')
const Context = require('./../db/Strategies/base/contexStrategy')
const HeroiSchema = require('../db/Strategies/postgres/schemas/heroisSchema')
const MOCK_HEROIS_CADASTRAR = {
    nome: "gavião negro",
    poder: 'flexas'
}
const MOCK_HEROIS_ATUALIZAR = {
    nome: "batman",
    poder: 'riqueza'
}
let context = {}
describe('Postgres Strategy', function () {
    this.timeout(Infinity)
    this.beforeAll(async function () {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection,HeroiSchema)
        context = new Context(new Postgres(connection,model))
        const Bd = await context.read()
        await context.delete()
        if (!Bd) {
            await context.create(MOCK_HEROIS_CADASTRAR)
        }

    })
    it('PostgreSql connection', async function () {
        const result = await context.isConnected()
        assert.equal(result, true)
    })
    it('cadastrar', async function () {
        const result = await context.create(MOCK_HEROIS_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROIS_CADASTRAR)
    })
    it('Lista', async function () {
        const [result] = await context.read({ nome: MOCK_HEROIS_CADASTRAR.nome })
        delete result.id


        assert.deepEqual(result, MOCK_HEROIS_CADASTRAR)
    })
    it('atualizar', async function () {
        const [itemAtualizar] = await context.read({nome: MOCK_HEROIS_CADASTRAR.nome})
        const novoItem = {
            ...MOCK_HEROIS_ATUALIZAR,
            nome : 'Mulher Maravilha'
        }
        const [result] = await context.update(itemAtualizar.id,novoItem)
        const [itemAtualizado] = await context.read({id:itemAtualizar.id})
        assert.deepEqual(result,1)
        assert.deepEqual(itemAtualizado.nome,novoItem.nome)
     })
     it('remover por id', async function(){
         const [item] = await context.read({})
         const result = await context.delete(item.id)
         assert.deepEqual(result,1)
     })

})
