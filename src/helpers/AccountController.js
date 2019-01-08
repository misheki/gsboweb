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
                        break;
                    case 'PASSWORDCONFIRMATION':
                        reject('Password confirmation did not match.');
                        break;
                    case 'INCOMPLETEPARAMS':
                        reject('Parameter missing.');
                        break;
                    case 'INCORRECTPASSWORD':
                        reject('Password is incorrect.');
                        break;
                    default:
                        reject('Technical error.');
                        break;
                }
            })
            .catch((error) => {
                reject(error);
            })
        )
    ])
};