const TerminusClient=require("@terminusdb/terminusdb-client");
const query=require("./query")
const {Octokit}=require('@octokit/rest')

/*function DBConnect(opts, json){
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
}*/

function DBConnect(){
    const octokit = new Octokit({ auth: "f0fcb84cd63dfa27cd00a5901183ab44dc5e7e9c " });
    octokit.request('GET /repos/:owner/:repo/releases/latest', {
      owner: "KittyJose",
      repo: "myDev"
    }).then(response => console.log(response.data))
}

module.exports = DBConnect
