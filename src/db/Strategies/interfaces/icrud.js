class NotImplementedException extends Error {
    constructor() {
        super('not implemented exception')
    }
}



class Icrud {
    create(item) {
        throw new NotImplementedException()
    }

    read(query) {
        throw new NotImplementedException()
    }
    update(id, item) {
        throw new NotImplementedException()
    }
    delete(id) {
        throw new NotImplementedException()
    }
    isConnected(){
        throw new NotImplementedException() 
    }
    connect(){
        throw new NotImplementedException()
    }
}

module.exports = Icrud