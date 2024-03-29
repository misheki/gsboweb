export const createOrder = (sale_channel_id, order_ref_num, customer_name, customer_email, customer_contact_num, customer_address, customer_postcode, customer_state, package_details, shipping_fee, discount, access_token) => {
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
                    package_details,
                    shipping_fee,
                    discount
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
                        case 'DUPLICATEORDERREFNUM':
                            error = 'The order reference number is already exists!';
                            break;

                        case 'CONTACTMUSTNUMBER':
                            error = 'The customer contact number must be a number!';
                            break;

                        case 'POSTCODEMUSTNUMBER':
                            error = 'The postcode must be a number!';
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

export const listPending = (date_from, date_to, search, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/list/pending', {
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

export const listReadyShip = (date_from, date_to, search, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/list/ready/ship', {
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
}

export const listCompleted = (date_from, date_to, status_id, search, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/list/completed', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    date_from,
                    date_to,
                    search,
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

export const requestStock = (order_id, package_details, customer_name, customer_email, customer_contact_num, discount, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/request/stock', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    order_id,
                    package_details,
                    customer_name,
                    customer_email,
                    customer_contact_num,
                    discount
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
                        case 'ALREADYREQUEST':
                            error = 'You have already requested the stocks for this order!';
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

export const courierList = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/courier/list', {
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
                            console.log('Technical error.');
                            error = 'Technical error.'
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

export const shippingUpdateWithCourier = (order_id, customer_address, customer_contact_num, customer_state, customer_postcode, shipping_method_id, tracking_number, shipping_fee, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/shipping/update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    order_id,
                    customer_address,
                    customer_contact_num,
                    customer_state,
                    customer_postcode,
                    shipping_method_id,
                    tracking_number,
                    shipping_fee
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

export const shippingUpdateWithoutCourier = (order_id, shipping_method_id, shipping_fee, tracking_number, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/shipping/update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    order_id,
                    shipping_method_id,
                    shipping_fee,
                    tracking_number
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

export const completeOrder = (order_id, shipping_method_id, tracking_number, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/complete', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    order_id,
                    shipping_method_id,
                    tracking_number
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
                        case 'ALREADYCOMPLETE':
                            error = 'You have already completed this order!';
                            break;
                    
                        default:
                            console.log('Technical error.');
                            error = 'Technical error.'
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

export const cancelOrder = (order_id, reason, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/cancel', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    order_id,
                    reason
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
                        case 'NOCANCEL':
                            error = 'You cannot cancel an order that is already confirmed!';
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

export const latestOrder = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/order/latest', {
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