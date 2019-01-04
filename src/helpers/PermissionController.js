export const checkAccess = (permissions, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/permission/check', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    permissions
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                resolve(responseJson.allowed);
            })
            .catch((error) => {
                reject(error);
            })
        )
    ])
};