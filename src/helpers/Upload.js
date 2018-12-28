export const importStocks = (stocksfile, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/stock/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    stocksfile,
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