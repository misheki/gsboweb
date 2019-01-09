export const listImportLogs = (date_from, date_to, search, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/reports/import', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    date_from,
                    date_to,
                    search
                })
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
                            error = 'Technical error.';
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

export const listWriteoffLogs = (date_from, date_to, search, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/reports/writeoff', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    date_from,
                    date_to,
                    search
                })
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
                            error = 'Technical error.';
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
