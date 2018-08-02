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
const expect = chai.expect;
chai.use(require('chai-as-promised'));
// chai.use(require('chai-things'));
const sinon = require('sinon');

const mlog= require('mocha-logger');
const NumericTasks = require('../lib/numerictasks')

const chaincodeStub = require('fabric-shim').Stub;

describe('Exported Functions',()=>{

    let apiStub;
    let sandbox;
    let startingValue;
    let wrongType;

    before(()=>{
    })

    beforeEach('Sandbox creation', () => {
        sandbox = sinon.createSandbox() 
    });

    afterEach('Sandbox restoration', () => {
        sandbox.restore();
    });

    describe('#setup', ()=>{
        it('should call the correct setup function',async ()=>{
            let sc = require('../index.js');
            let ownProps = Object.getOwnPropertyNames(sc);
            expect(ownProps).to.include.members(['contracts'])

            sc.contracts.length.should.equal(2);
        });
    });

   
})