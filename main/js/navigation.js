
document.addEventListener('DOMContentLoaded', function () {
    const cur_location = window.location.href;
    const token = Authorization();
    if (!token && !cur_location.endsWith('login.html')) {
        window.location.href = 'login.html';
    } else if (token && cur_location.endsWith('login.html')) {
        window.location.href = 'index.html';
    }
});
