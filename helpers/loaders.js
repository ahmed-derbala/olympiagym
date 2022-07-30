const fs = require('fs');
const appRootPath = require('app-root-path');




module.exports.routes = (app) => {
    let directories = fs.readdirSync(`${appRootPath}/src/`)
    let endpoint_root
    for (dir of directories) {
        files = fs.readdirSync(`${appRootPath}/src/${dir}`)
        if (files.length > 0) {
            for (file of files) {
                if (file.includes('api.route.js')) {
                    endpoint_root = file.substring(0, file.indexOf('.api.route.js'))
                    app.use(`/api/${endpoint_root}`, require(`../src/${dir}/${file}`));
                }
                if (file.includes('view.route.js')) {
                    endpoint_root = file.substring(0, file.indexOf('.view.route.js'))
                    app.use(`/${endpoint_root}`, require(`../src/${dir}/${file}`));
                }
            }
        }
    }
    app.use(`/`, require(`../src/index/index.view.route`));//make sure main url works with src/index
}

