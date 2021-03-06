const TerminusClient=require("./terminusdb-client");
const query=require("./query")
const {Octokit}=require('@octokit/rest')

function DBConnect(opts, json){
    const dbClient = new TerminusClient.WOQLClient(opts.server)

    try {
        dbClient.connect(opts)
		const WOQL=TerminusClient.WOQL
        let q=query(json)

        if(q){
            console.log('query', q)

    		dbClient.query(q).then((results) => {
    			console.log(results)
    			console.log("*******************")
    		})
    		.catch(err=>{
    			console.log('err', err)
    		})
        }

    } catch (err) {
        console.log('err', err)
    }
}



module.exports = DBConnect
