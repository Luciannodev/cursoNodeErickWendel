const assert = require('assert')
const api = require('../api')
let app = {}
const MOCK_HEROIS_CADASTRAR = {
    nome: 'chapolin colorado',
    poder: 'marreta bionica'
}
const MOCK_HEROI_INICIAR ={
    nome: 'Gavião Negro',
    poder: 'A Mira'
}
let MOCK_ID = ''
describe.only('Suite de teste na api heros', function () {
    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: MOCK_HEROI_INICIAR
        })
        const {_id} = JSON.parse(result.payload)
        MOCK_ID = _id
    })

    it('listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10'
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })
    it('listar/herois-deve retornar somente 3 registros', async () => {
        const TAMANHO_LIMITE = 3
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)
    })
    it('listar/herois-deve retornar somente 10 registros ', async () => {
        const TAMANHO_LIMITE = 'aeee'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })
        const errorResult = { "statusCode": 400, "error": "Bad Request", "message": "child \"limit\" fails because [\"limit\" must be a number]", "validation": { "source": "query", "keys": ["limit"] } }

        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(errorResult))
    })
    it('listar/herois-deve filtrar um item ', async () => {
        const NAME = "Homem de ferro1580158966711"
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=1000&nome=${NAME}`
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.deepEqual(dados[0].nome, NAME)
    })
    it('Cadastrar POST - /HEROIS', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: MOCK_HEROIS_CADASTRAR
        })

        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, "Heroi cadastrado com sucesso!")
    })
    it('atualizar PATCH= /herois/:id',async()=>{
        const _id = MOCK_ID
        const expected = {
            poder: 'Super Mira'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Herois atualizado com sucesso!')
    })
    it('atualizar PATCH= /herois/:id-não deve atualizar com ID incorreto',async()=>{
        const _id = '5bfdb6e83f66ad3c32939fb1'
        const expected = {
            poder: 'Super Mira'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Não foi possivel atualizar')
    })
    // it('remover Delete - /herois/:id', async () => {
    //     const _id = MOCK_ID
    //     const result = await app.inject({
    //         method: 'DELETE',
    //         url: `/herois/${_id}`
    //     })
    //     const statusCode = result.statusCode
    //     const dados = JSON.parse(result.payload)

    //     assert.ok(statusCode ===200)
    //     assert.deepEqual(dados.message,'Heroi removido com sucesso')
    // })
})
