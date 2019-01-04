export const login = (username, password) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'oauth/token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: global.CID,
                    client_secret: global.CSECRET,
                    grant_type: 'password',
                    scope: '*',
                    username,
                    password
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.token_type === 'Bearer') {
                    sessionStorage.setItem('access_token', responseJson.access_token);
                    resolve(responseJson.access_token);
                }
            })
            .catch((error) => {
                reject(error);
            })
        })
    ])
};

export const verify = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/user', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                resolve(responseJson);
            })
            .catch((error) => {
                reject(error);
            })
        )
    ])

}