# Simple vue.js monitoring application to ping your services.

## To do :
Intro
### In moni-thor-server :

- create a "db" folder
- create a "logs" folder
- create a "secret" folder containing :
    - a auth.js file :
        - containing :
        ```
            module.exports = {
                url : 'YOUR_SERVICE_URL'
            }
        ```
    - a jenkins.js file :
        - containing :
        ```
            module.exports = {
                url : 'YOUR_JENSERV_URL'
            }
        ```
- run 'npm install'
- run 'npm start'

### In moni-thor-app :
- run 'npm install'
- run 'npm start'

### For Release :
- run 'npm run build' in moni-thor-app
- run 'npm publish' in moni-thor-server
- in the designated server run : 
> ``
    npm i -g moni-thor
`` to install globally

> ``
moni-thor
`` 
to launch the server

