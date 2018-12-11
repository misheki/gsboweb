export const createUser = (name, username, email, password, password_confirmation, role_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/admin/user/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    name,
                    username,
                    email,
                    password,
                    password_confirmation,
                    role_id
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

export const deleteUser = (user_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/admin/user/delete/' + user_id, {
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
            })
            .catch((error) => {
                reject(error);
            })
        )
    ])
}

export const updateUser = (user_id, name, username, email, password, password_confirmation, role_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/admin/user/update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    user_id,
                    name,
                    username,
                    email,
                    password,
                    password_confirmation,
                    role_id
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
}

export const listUser = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) =>
            fetch(global.URL + 'api/admin/user/list', {
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

export const createRole = (name, permission_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/role/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    name,
                    permission_id
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
        })
    ])
};

export const listRole = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/role/list', {
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
        })
    ])
};

export const deleteRole = (role_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/role/delete/' + role_id, {
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
            })
            .catch((error) => {
                reject(error);
            })
        })
    ])
};

export const updateRole = (role_id, name, permission_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/role/update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    role_id,
                    name,
                    permission_id
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
        })
    ])
};

export const createPermission = (name, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/permission/create', {
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
            })
            .catch((error) => {
                reject(error);
            })
        })
    ])
};

export const listPermission = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/permission/list', {
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
        })
    ])
};

export const deletePermission = (permission_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/permission/delete/' + permission_id, {
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
            })
            .catch((error) => {
                reject(error);
            })
        })
    ])
};

export const updatePermission = (permission_id, name, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/permission/update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    permission_id,
                    name
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
        })
    ])
};

export const createMenu = (name, order, role_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/menu/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    name,
                    order,
                    role_id
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
        })
    ])
};

export const listMenu = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/menu/list', {
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
        })
    ])
};

export const deleteMenu = (menu_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/menu/delete/' + menu_id, {
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
            })
            .catch((error) => {
                reject(error);
            })
        })
    ])
};

export const updateMenu = (menu_id, name, order, role_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/menu/update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    menu_id,
                    name,
                    order,
                    role_id
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
        })
    ])
};

export const createSubMenu = (menu_id, name, order, role_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/submenu/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    menu_id,
                    name,
                    order,
                    role_id
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
        })
    ])
};

export const listSubMenu = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/submenu/list', {
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
        })
    ])
};

export const deleteSubMenu = (submenu_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/submenu/delete/' + submenu_id, {
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
            })
            .catch((error) => {
                reject(error);
            })
        })
    ])
};

export const updateSubMenu = (submenu_id, menu_id, name, order, role_id, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/submenu/update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    submenu_id,
                    menu_id,
                    name,
                    order,
                    role_id
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
        })
    ])
};

export const showSideBarMenu = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/admin/sidebar/menu/show', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                resolve(responseJson);
            })
            .catch((error) => {
                reject(error);
            })
        })
    ])
};