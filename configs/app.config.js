module.exports = {
    backend: {
        port: 5000,
        host: '127.0.0.1',
        protocol: 'http://',
        url: `http://127.0.0.1:5000`
    },
    cluster: 0,//a number, 0 to disable
    NODE_ENV: process.env.NODE_ENV || 'local',
    responseTimeAlert: 20000,//time in ms before considering a request timeout
    morgan: {
        //more infos: https://www.npmjs.com/package/morgan
        //  tokenString: `:status :method :url :nl *userIp=:userIp userId=:userId userEmail=:userEmail :nl *body=:body :nl *browser=:browser os=:os platform=:platform :nl *origin=:origin isBot=:isBot referrer=:referrer :nl tid=:tid :nl responseTime=[*:response-time*]`,
        tokenString: `{"status"::status,"method":":method", "url":":url", "userIp":":userIp", "user": :user ,"body": :body,"browser":":browser", "os":":os", "platform":":platform" ,"origin":":origin", "isBot":":isBot", "referrer":":referrer","tid":":tid" ,"responseTime":":response-time"}`,
      // tokenString:`{"status":":status"}`
      //tokenString:':status'
    }
}