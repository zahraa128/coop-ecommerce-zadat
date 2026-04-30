(function () {
  window.logout = function logout() {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("token");
    window.location.href = "/admin/login.html";
  };
})();
