export const createOrder = (sale_channel_id, order_ref_num, customer_name, customer_email, customer_contact_num, customer_address, customer_postcode, customer_state, package_details, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    sale_channel_id,
                    order_ref_num,
                    customer_name,
                    customer_email,
                    customer_contact_num,
                    customer_address,
                    customer_postcode,
                    customer_state,
                    package_details
                })
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

export const listPending = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/list/pending', {
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

export const listReadyShip = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/list/ready/ship', {
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
}

export const listCompleted = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/list/completed', {
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
}

export const saleChannelList = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/sale/channel/list', {
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

export const showOrders = (order_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/show', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    order_id
                })
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