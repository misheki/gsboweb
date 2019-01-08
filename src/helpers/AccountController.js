export const changePassword = (current, password, password_confirmation, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/password/change', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    current,
                    password,
                    password_confirmation
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                switch (responseJson.result) {
                    case 'GOOD':
                        resolve(true);   
                    case 'PASSWORDCONFIRMATION':
                        reject('Password confirmation did not match.');
                    case 'INCOMPLETEPARAMS':
                        reject('Parameter missing.');
                    case 'INCORRECTPASSWORD':
                        reject('Password is incorrect.');
                    default:
                        reject('Technical error.');
                }
            })
            .catch((error) => {
                reject(error);
            })
        )
    ])
};