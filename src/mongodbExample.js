const Mongoose = require('mongoose')
Mongoose.connect('mongodb://joseluciano:minhasenha@localhost:27017/herois',{useNewUrlParser:true},(function(error){
    if(!error) return;
    console.log('Falha na conexão',error)
}))

const conection = Mongoose.connection



conection.once('open',()=> console.log('database rodando!!'))

// setTimeout(()=>{
//     const state = conection.readyState
//     console.log('state',state)
// },1000)

const heroisSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    insertedAt:{
        type: Date,
        default: new Date()
    }
})

const model = Mongoose.model('herois',heroisSchema)

async function main(){
    const resultCadastrar = await model.create({
        nome: 'batman',
        poder: 'riqueza'
    })
    console.log('result cadastrar',resultCadastrar)

    const listItens = await model.find()
    console.log('itens', listItens)
}
main()