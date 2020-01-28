const Icrud = require('../interfaces/icrud')
const Sequelize = require('sequelize')


class Postgres extends Icrud{
    constructor(connection,schema){
        super()
        this._connection = connection
        this._schema = schema
    }
    async isConnected(){
        try {
            await this._connection.authenticate()
            return true
        } catch (error) {
            console.log('fail',error)
            return false
        }
    }
    static async defineModel(connection,schema){
        const model = connection.define(schema.name,schema.schema,schema.options)
        await model.sync()
        return model
    }


    async create(item){
        const {dataValues}= await this._schema.create(item)
        return dataValues
    }
    async read(item ={}){
        return  this._schema.findAll({where:item,raw:true})
    }
    async update(id,item){
        return this._schema.update(item,{where:{id:id}})
    }
    async delete(id){
        const query = id ? {id}:{}
        return this._schema.destroy({where:query})
    }
    static async connect(){
       const connection = new Sequelize(
            'heroes',
            'joseluciano',
            'minhasenha',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIndetifiers: false,
                operatorAliases: false,
                logging: false
            }
        
        )
       return connection

    }
}

module.exports = Postgres