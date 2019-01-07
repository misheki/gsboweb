export const createPackage = (sku_id, code, name, description, cost_price, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/package/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    sku_id,
                    code,
                    name,
                    description,
                    cost_price
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

export const listPackage = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/package/list', {
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

export const deletePackage = (package_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/package/delete/' + package_id, {
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
                else {
                    var error = '';

                    switch (responseJson.result) {
                        case 'STOCKEXIST':
                            error = 'You cannot delete this package because there are stocks under it.';
                            break;
                    
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

export const editPackage = (package_id, description, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/package/edit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    package_id,
                    description
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