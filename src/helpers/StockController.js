export const listStock = (serial_number, sku_id, package_id, status_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/stock/list', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    serial_number,
                    sku_id,
                    package_id,
                    status_id
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

export const writeOff = (stock_id, remarks, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/stock/writeoff', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    stock_id,
                    remarks
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