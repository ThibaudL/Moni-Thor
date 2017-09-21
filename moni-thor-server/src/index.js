const express = require('express'),
    app = express(),
    port = 9000;
const DeployDb = require('./DeployDB');
const bodyParser = require('body-parser');

DeployDb.init().then(() => {
    console.log("db initialized");
    app.listen(port);
    app.use(bodyParser.json()); // for parsing application/json
    app.route('/settings')
        .get((req, res) => {
                let data = DeployDb.getSettings().data;
                if (data.length > 0) {
                    res.send(data[0]);
                }else{
                    res.sendStatus(204);
                }
            }
        )
        .post((req, res) => {
                console.log(req.body)
                DeployDb.save(DeployDb.getSettings(), req.body);
                res.send(DeployDb.getSettings().data[0]);
            }
        )
    ;
});