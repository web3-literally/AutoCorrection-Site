

function Authorization() {
    return localStorage.getItem(AUTHORIZATION);
}

function SetAuthorization(authorization) {
    localStorage.setItem(AUTHORIZATION, authorization);
}

function SetAccessToken(access_token) {
    localStorage.setItem(ACCESS_TOKEN, access_token);
}

function SetAdminData(admin_data) {
    localStorage.setItem(ADMIN_DATA, admin_data);
}

