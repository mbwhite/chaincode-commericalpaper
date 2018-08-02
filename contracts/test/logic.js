/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// test specific libraries
const chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));
const sinon = require('sinon');

// Not currently using these extensions but might be useful in later tests
// const expect = chai.expect;
// chai.use(require('chai-things'));


const CommericalPaperContract = require('../lib/logic.js');
const chaincodeStub = require('fabric-contract-api').Stub;

describe('String tasks testing',()=>{

    let apiStub;
    let sandbox;


    before(()=>{

    });

    beforeEach('Sandbox creation', () => {
        sandbox = sinon.createSandbox();
        apiStub = sandbox.createStubInstance(chaincodeStub);
    });

    afterEach('Sandbox restoration', () => {
        sandbox.restore();
    });


    describe('#createPaper',()=>{
        it ('should create new paper ',async ()=>{
            let sc = new CommericalPaperContract();
            sc.putState = sinon.stub();
            sc.createCompositeKey = sinon.stub();
            sc.putState.resolves();
            sc.createCompositeKey.returns();
            await sc.CreatePaper('cusip',240,100);

            sinon.assert.calledOnce(sc.putState);
        });


    });

    describe('#listOnMarket',()=>{
        it ('should convert to kebab case',async ()=>{
            let sc = new CommericalPaperContract();
            sc.getState = sinon.stub();
            sc.getState.resolves(JSON.stringify({listedPaper:[]}));
            sc.putState = sinon.stub();
            sc.createCompositeKey = sinon.stub();
            sc.putState.resolves();
            await sc.ListOnMarket('US_BLUE_ONE',5,'alpha,beta');
            sinon.assert.calledOnce(sc.getState);
        });

    });

});