const baseRoute = require('./base/baseRoute')
const Joi = require('joi')
const failAction = (Request, headers, erro) => {
    throw erro;
}
class HeroRoutes extends baseRoute {
    constructor(db) {
        super()
        this.db = db
    }
    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: (request, headers) => {

                try {
                    const { skip, limit, nome } = request.query
                    const query = { nome: { $regex: `.*${nome}*.` } }

                    return this.db.read(nome ? query : {}, skip, limit)


                } catch (error) {
                    console.log('Deu Ruim', error)
                    return 'erro interno no servidor'
                }
            }
        }
    }
    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                validate: {
                    failAction,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(3).max(50)
                    }
                },
                handler: async (request) => {
                    try {
                        const { nome, poder } = request.payload
                        const result = await this.db.create({ nome, poder })
                        return {
                            message: "Heroi cadastrado com sucesso!",
                            _id: result._id
                        }
                    } catch (error) {
                        console.log('deu ruim', error)
                        return 'internal Erro!'
                    }
                }

            }
        }
    }
    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(50)
                    }
                }
            },
            handler:async(request)=>{
                try{
                    const {id} = request.params
                    const {payload} = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id,dados)
                    if(result.nModified !==1)return{
                        message: 'Não foi possivel atualizar'
                    }
                    return{
                        message:'Herois atualizado com sucesso!'
                    }
                }catch(error){
                    console.error('deu ruim',error)
                    return 'erro interno'
                }
            }
        }
    }

    // delete(){
    //     return{
    //         path: '/herois/{id}',
    //         method: 'DELETE',
    //         config:{
    //             validate:{
    //                 failAction,
    //                 params:{
    //                     id: Joi.string().required().m
    //                 }
    //             }
    //         },
    //         handler: async(request)=>{
    //             try{
    //                 const {id} = request.params
    //                 const result = await this.db.delete(id)
    //                 if (result.n!== 1)
    //                     return{
    //                     message: "Não foi possivel remover o item"
    //                 }
    //                 return{
    //                     message: 'Heroi removido com sucesso'
    //                 }

    //             }catch(error){
    //                 console('deu ruim',error)
    //                 return 'erro interno'
    //             }
    //         }
    // }
    // }


}
module.exports = HeroRoutes