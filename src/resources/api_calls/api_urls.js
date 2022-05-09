module.exports = Object.freeze({
  baseUrl: "https://agkserver.herokuapp.com/api",
  localUrl: "http://localhost:4000/api",
  isLocalServer: false,
  fetchAllProducts: "/product/all-products",
  fetchInactiveProducts: "/game/all-games?isActive=false",
  listUsers: "/user/all-users",
  testRides: "/test-ride/all-test-rides",
  listProducts: "/game/all-games",
});
