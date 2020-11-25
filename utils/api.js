import URL from "./config.js"

export default (options)=>{
	let url = URL + options.url
	return new Promise((resolve,reject)=>{
		uni.request({
			url,
			data:options.data || {},
			method:options.method || "GET",
			header:options.header || {
				"content-type":"application/json"
			},
			success:resolve,
			fail:reject
			
		})
	})
}