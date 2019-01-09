export const listImportLogs = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/reports/import', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.result === 'GOOD') {
                    resolve(responseJson);   
                }
                else {
                    var error = '';

                    switch (responseJson.result) {
                        default:
                            error = responseJson.msg;
                            break;
                    }

                    reject(error);
                }
            })
            .catch((error) => {
                reject(error);
            })
        )
    ])
};
