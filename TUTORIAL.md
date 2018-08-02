# Dev Workflow for Smart Contract and Client on the Hyperledger Fabric blockchain
> An opinionated tutorial showing a best practice approach 


## High level design of the Distributed App
It is important to put what we are going to develop into context.  We are developing a Distributed Application to manage the trading of commercial paper; as part of this we know that a distributed ledger is required to manage the provence and owenship of the commercial paper. As well as permit a single source of truth for transactions - that a regulator may wish to view or in the even of any disputes.

(more information on Commercial Paper, and why this is a good use case... see <ref here>.   )

## What needs to be stored in the ledger?
One of the most important questions to be handled. It is not approriate to store all the data elements in the system - only the parts that are essential to maintain the single source of truth. 

A data model of what needs to be stored and how it will be persisted is important; this will determine and be determined by the operations that are performed on this data. 

> Remember the data on the ledger can be thought of as a single 'state of key value pairs'. Operations are performed using this state (and supplied parameters), from which a set of changes to the state are produced - that are then applied to create a new state.

## This data model

For the initial minimal-viable-demo, we need to have the ability to 

- Uniquely reference a single commercial paper, and the current owner of this paper
- List the paper on a market such that ogranizations can purchase  and sell commerical paper

This decomposes to having two functions (well actually three so it's useful!)

1. Create a Commerical Paper asset
2. List the Commerical Paper on a market 
3. Retrieve the market (added so you can see what's going on!)

We also now have a starting point of the data that needs to be stored. With a real world scenario it's very straightforward to use an object based approach.

1. Commercial Paper
2. Market

To summarise the types and what data they may contain:

```
CommericalPaper {
    o CUSIP    indetifier   // the identifier of the paper
    o Integer  maturity     // the number of days before the paper matures
    o Integer  par          // par (or face) value of the paper 
}

Market {
    o String           name           // name, the identifier of the market 
    o CommericalPaper  listedPapers   // papers on the market
}
```

Remeber this is a starting point for the 'minimal-viable-demo'.


## Lets run the yeoman generator
This is the quickest way to get a starting a contract that will run in a 'chaincode container' is to run the Yeoman generator.  This will get the boiler plate code created for you.

In this git repo, the structure is that the repo is both the contract code and the application that uses it. 
Therefore the contracts will be created in a 'contracts' directory.


```
$ mkdir chaincode-commercialpaper && cd chaincode-commercialpaper
$ npm init -y
$ mkdir contracts && cd contracts
$ yo <name of the generator>
```


## Code

At present the logic is coded very simply to demonstrate how this could be written. Each function though will need to handle both the logic and the data represention.  

To support this we're going to dive the code into two files. At the moment this might look like more code is being created than is required, but when the complexity of the data and logic increases this will be important.

In the newly created lib directory create `logic.js` and `datamodel.js`.
We'll look at the datamodel first. 

The requirements for this care are to
- Create a key value to use for indexing.
- Serialize and Deserialize the object to a storable form

This is is the code to add to the `datamodel.js`

```
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


module.exports = DataModel

```

## Business Logic
The next step is write the business logic. It is in the formt of a class that extends the `Contract` type.


```
'use strict';

// SDK Library to asset with writing the logic
const { Contract } = require('fabric-contract-api');

class CommericalPaperContract extends Contract {
    //-------
}
```

### Constructor

A constructor is needed to set the namespace that will be used for this contract. A namespace is needed per contract, and (currently one contract per namespace). 

When the chaincode is first created, an instance of the class be created; that will be kept for the lifetime of the
chaincode container


```
    constructor() {
        super('org.example.commercialpaper');
        this.setBeforeFn = (ctx)=>{
            ctx.datautil = new DataModel(ctx);
        };
    }
```

Each contract will consist of a set of functions that will be executed based on the client side innvocation.
This client side innvocation will send a function name, and a set of arguments. When this function is invoked, a transactional context will be passed. This allows access to for example the current identity and the world state.

To help with processing, it is possible to set a 'beforeFn' (and an 'afterFn').  In the above constructor we're using the before fn, and givin an implementation that adds a DataModel instance to the ctx object. This allows the functions to access this later. 

## Functions

Each function that is defined on the contract class will be invokeable. It is good practice to have a function that 
can be called to setup default values, as well as one that can handle migration of data when chaincode is updated. 

```
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
```   

In this function, we're using object deconstruction to get the 'collections' and 'datautil' objects out. 
Collections is a wrapper around the existing `stub apis` that unifies the world and private collections.

The `datautil` creates a composite key, and then we use the `getCollection()` api to get access to a Collection that is then backed by the worldstate collection.

Passing an name into `getCollection()` will use this to get a private collection based on that supplied name. 



wip.... more to come



