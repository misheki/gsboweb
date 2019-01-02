export const listSku = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/sku/list', {
                method: 'GET',
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
            })
            .catch((error) => {
                reject(error);
            })
        )
    ])
};

export const createSku = (sku, require_activation, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/sku/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    sku,
                    require_activation
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.warn(responseJson);
                
                if (responseJson.result === 'GOOD') {
                    resolve(responseJson);   
                }
            })
            .catch((error) => {
                reject(error);
            })
        )
    ])
};

export const editSku = (sku_id, sku, require_activation, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/sku/edit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    sku_id,
                    sku,
                    require_activation
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.warn(responseJson); 
                if (responseJson.result === 'GOOD') {
                    resolve(responseJson);   
                }
            })
            .catch((error) => {
                reject(error);
            })
        )
    ])
};

export const deleteSku = (sku_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/sku/delete/' + sku_id, {
                method: 'DELETE',
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
                else if (responseJson.result === 'STOCKEXIST') {
                    resolve(responseJson);   
                }
            })
            .catch((error) => {
                reject(error);
            })
        )
    ])
};