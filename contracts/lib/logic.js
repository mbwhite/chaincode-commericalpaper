/*
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
'use strict';

// SDK Library to asset with writing the logic
const { Contract } = require('fabric-contract-api');

// Helper functions to process the data and produce the format to store in worldstate
const DataModel = require('./datamodel.js');


/**
 * Support the digitaization of the Commercial Paper Trading
 *
 * Extending the Contract class; this will help as 'this' functions an ability to
 * update world state, get access to the 'stub' api and 'client identity'
 */
class CommericalPaperContract extends Contract {

    /**
     * Constructor needs to register the namespace for this contract
     */
    constructor() {
        super('org.example.commercialpaper');
        this.setBeforeFn = (ctx)=>{
            ctx.datautil = new DataModel(ctx);
        };
    }

    /**
     *
     * Function call when the chain code is instantiated.
     * @param {TxContext} ctx the transaction context
     */
    async Setup({collections,datautil}){
        let key =  datautil._assetIdToKey('market','US_BLUE_ONE');
        let marketData = {
            $type:'market',
            $id:'US_BLUE_ONE',
            name:'US_BLUE_ONE trading',
            listedPaper:[]
        };

        let worldState = collections.getCollection();
        await worldState.putState(key, datautil._serialize(marketData));
    }

    /**
     * @param {TxContext} ctx the transaction context
     * @param {String} CUSIP identifier
     * @param {Integer} maturity positive integer for the maturity value
     * @param {Integer} par positive integer for the face value of the paper
    */
    async CreatePaper( {datautil,state}, CUSIP, maturity, par) {

        if (!CUSIP){
            throw new Error('CUSIP must be specified');
        }

        if (!maturity || maturity<1 || maturity>364){
            throw new Error('Maturity time must be between 1 and 364');
        }

        if (!par || par<1 ){
            throw new Error('Par value must be between 1 and 364');
        }

        // creates the key and the object to store
        let key =  datautil._assetIdToKey('paper',CUSIP);
        let asset = {
            id:key,
            maturity,par
        };

        // serialize and persist
        await state.putState(key, datautil._serialize(asset));
    }

    /**
     * @param {TxContext} ctx the transaction context
     * @param {String} market The identifier of the 'Market' to list the paper on
     * @param {Integer} discount % discount being offered
     * @param {String[]} papersToList array to list - identifiers
     *
     */
    async ListOnMarket( {datautil,state}, market, discount, papersToList) {

        // need to create a key for this.
        // create the key
        let key =  datautil._assetIdToKey('market',market);
        let marketData =  datautil._deserialize(await state.getState(key));

        let papers = papersToList.split(',');

        for (const paper of papers) {
            marketData.listedPaper.push({paper,discount});
        }

        await state.putState(key, datautil._serialize(marketData));
    }

    /**
     * @param {String} market The identifier of the 'Market' to list the paper on
     * @return {json} The full market contents
     */
    async RetrieveMarket({datautil,state} ,market) {

        // need to create a key for this.
        // create the key
        let key =  datautil._assetIdToKey('market',market);
        let marketData = await state.getState(key);

        return marketData;
    }

}

module.exports =  CommericalPaperContract;