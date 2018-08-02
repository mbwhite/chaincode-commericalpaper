// if you haven't provided a 'npm start' script that runs the startChaincode app
// then you can do so programmatically, but using the standard convetions by
//
// require('fabric-shim').spi.startChaincode();



// Alternatively to use a different convention you can specifically add in the classes that export the functions
//

if (!process.env.CORE_CHAINCODE_ID_NAME){
    process.env.CORE_CHAINCODE_ID_NAME='CommercialPaper:v0';
}

require('fabric-shim').spi.registerContract( [require('./lib/logic.js')] );
