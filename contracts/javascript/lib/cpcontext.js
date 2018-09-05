
/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Context } = reqiure('fabric-contract-api');

const { CommercialPaperList } = require('./cpstate.js');

class CommericalPaperContext extends Context{
    constructor(){
        this.cpList = new CommercialPaperList(this,'COMMERCIALPAPER');
    }

    getApi(){
        return this.stub;
    }
}

module.exports = CommericalPaperContext;