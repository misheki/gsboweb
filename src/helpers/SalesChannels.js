export const createSalesChannel = (name, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/saleschannel/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    name
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

export const listSalesChannels = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/saleschannel/list', {
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

export const deleteSalesChannel = (salechannel_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/saleschannel/delete/' + salechannel_id, {
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
                        case 'ORDEREXIST':
                            error = 'You cannot delete this sale channel because it has orders under it.'
                            break;
                    
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

export const editSalesChannel = (salechannel_id, name, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/saleschannel/edit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    salechannel_id,
                    name
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