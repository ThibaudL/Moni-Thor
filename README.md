# Simple vue.js monitoring application to ping your services.

## To do :

### In moni-thor-server :

- create a "db" folder
- create a "logs" folder
- create a "secret" folder :
    - containing a auth.js folder :
        - containing :
        ```
            module.exports = {
                url : 'YOUR_SERVICE_URL'
            }
        ```
    - containing a jenkins.js folder :
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
