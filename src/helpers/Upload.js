export const importStocks = (stocksfile, access_token) => {
    let formData = new FormData();
    formData.append('stocksfile', stocksfile);
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/stock/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: formData
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.result === 'GOOD') {
                    resolve(responseJson);   
                }
                else{
                    reject(responseJson.msg);
                }
            })
            .catch((error) => {
                reject(error);
            })
        )
    ])
};