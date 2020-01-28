const assert = require('assert')
const MongoDb = require('./../db/Strategies/mongodb/mongodb')
const Context = require('./../db/Strategies/base/contexStrategy')
const HeroiSchema = require('./../db/Strategies/mongodb/schemas/heroisSchemas')


const MOCK_HEROI_CADASTRAR = {
    nome: `Homem de ferro${Date.now()}`,
    poder: 'Genialidade'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: 'Patolino',
    poder: 'Destocer a realidade'
}
let context = {}
let MOCK_ID = ''
describe('MongoDB Suite de testes',function(){
    this.beforeAll(async()=>{
        const connection = MongoDb.connect()
        context = new Context(new MongoDb(connection,HeroiSchema))
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_ID= result._id
    })
    it('verificar conexão', async()=>{
        const result = await context.isConnected()
        const expected = 'Conectado'
        assert.deepEqual(expected,result)
    })
    it('create',async()=>{
        const {nome,poder} = await context.create(MOCK_HEROI_CADASTRAR) 
        assert.deepEqual({nome,poder},MOCK_HEROI_CADASTRAR)
    })
    it('listar',async()=>{
        const [{nome,poder}] = await context.read({nome:MOCK_HEROI_CADASTRAR.nome})   
        assert.deepEqual({nome,poder},MOCK_HEROI_CADASTRAR)
    })
    it('atualizar',async()=>{
        const result = await context.update(MOCK_ID,{
            nome: 'Pernalonga'
        })
        assert.deepEqual(result.nModified,1)
    })
    it('remover', async()=>{
        const result = await context.delete(MOCK_ID)
        assert.deepEqual(result.n,1)
    })
})