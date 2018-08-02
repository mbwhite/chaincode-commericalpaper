'use strict';

/**
 * A simple set of helper functions to create keys, and to serialize/deserialze data from JSON/Buffer
 */
class DataModel {

    /** */
    constructor(api){
        this.stub=api;
    }

    /**
     * @param {String} type type of the object
     * @param {Object} assetid JSON structuree for the id
     * @return {String} Key
     */
    _assetIdToKey(type,assetid) {
        return this.stub.createCompositeKey(type,[assetid]);
    }

    /**
     * Serialize and object to the format needed for storing in world state
     * @param {Object} data Javascript object to serialize
     * @return {buffer} buffer with the data to store
     */
    _serialize(data){
        return Buffer.from(JSON.stringify(data));
    }

    /**
     * Deserialize  object from the format needed for storing in world state
     * @param {Object} data object to deserialize
     * @return {json} json with the data to store
     */
    _deserialize(data){
        return JSON.parse(data);
    }
}


module.exports = DataModel;