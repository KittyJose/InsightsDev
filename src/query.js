const TerminusClient=require("@terminusdb/terminusdb-client");
const CONST=require('./constants/gitHubActions')
const axios=require('axios');



function generateStarId(json){
	return "doc:" + json.repository.id + json.sender.id + Date.now().toString().replace(/[^\w\s]/gi, '')
}

function getGitHubActionType (json) {
	if(json.action==CONST.ACTION.CREATED && json.starred_at)
		return CONST.STAR
	else if(json.action==CONST.ACTION.DELETED && json.starred_at==null)
		return CONST.UNSTAR
}

async function getUserEmail(url) {
	let json={}
	let test="https://api.github.com/users/KittyJose"
	console.log('*** test *** ', test)
	const results = await axios.get(test)
    .then((resp) => {
        json=resp
		console.log('resp', resp)
		console.log('email', resp.email)
    })
    .catch(error => {
        console.log('error', error)
    });
	//return results.email
}

const getQuery=(json, type)=>{
	let WOQL=TerminusClient.WOQL
	let repoID=json.repository.id,
		userID=json.sender.id

	//getUserEmail(json.url)

	//getUserEmail(json.url).then((results)=>{
		//let email=results
		//console.log("^^^^^^^^^^^^^ email ^^^^^^^^^", email)


		let updateUserQuery=WOQL.and(
			WOQL.idgen("doc:GitHubUser", [userID], "v:User"),
			WOQL.add_triple("v:User", "type", "scm:GitHubUser"),
			WOQL.update_triple("v:User", "label", json.sender.login),
			WOQL.update_triple("v:User", "gitHub_user_html_url", WOQL.literal(json.sender.html_url, "xdd:url")),
			WOQL.update_triple("v:User", "gitHub_user_avatar", WOQL.literal(json.sender.avatar_url, "xdd:url")),
			WOQL.update_triple("v:User", "gitHub_user_star", "v:Star")
		)

		let updateRepoQuery=WOQL.and(
			WOQL.idgen("doc:GitHubRepo", [repoID], "v:Repo"),
			WOQL.add_triple("v:Repo", "type", "scm:GitHubRepository"),
			WOQL.update_triple("v:Repo", "label", json.repository.name),
			WOQL.update_triple("v:Repo", "gitHub_repository_html_url", WOQL.literal(json.repository.html_url, "xdd:url")),
			WOQL.update_triple("v:Repo", "gitHub_repository_star", "v:Star")
		)

		switch(type){
			case CONST.STAR:
				return WOQL.and (
					WOQL.and(
						WOQL.idgen("doc:GitHubStar", [repoID, userID], "v:Star"),
						WOQL.add_triple("v:Star", "type", "scm:GitHubStar"),
						WOQL.update_triple("v:Star", "action", json.action),
						WOQL.typecast(json.starred_at, "xsd:dateTime", "v:starred_at_cast"),
						WOQL.update_triple("v:Star", "starred_at", "v:starred_at_cast")
					), updateUserQuery, updateRepoQuery
				)
			case CONST.UNSTAR:
				var curr = new Date(); // unstar event doesn not have a time stamp
				var unstartedAt = curr.toISOString();
				return WOQL.and (
					WOQL.and(
						WOQL.idgen("doc:GitHubStar", [repoID, userID], "v:Star"),
						WOQL.add_triple("v:Star", "type", "scm:GitHubStar"),
						WOQL.update_triple("v:Star", "action", json.action),
						WOQL.typecast(unstartedAt, "xsd:dateTime", "v:unstarred_at_cast"),
						WOQL.update_triple("v:Star", "unstarred_at", "v:unstarred_at_cast")
					), updateUserQuery, updateRepoQuery
				)
		}
	//})

}

const constructQueryFromJson=(json)=>{
	let actionType=getGitHubActionType(json)
	switch(actionType){
		case CONST.STAR:
				return getQuery(json, CONST.STAR)
		case CONST.UNSTAR:
				return getQuery(json, CONST.UNSTAR)
	}

}

function query(json){
	let q=constructQueryFromJson(json)
	console.log("************", q)
	return q
}


module.exports = query
