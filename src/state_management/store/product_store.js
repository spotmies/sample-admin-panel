import { makeAutoObservable } from "mobx";
import { apiGet, apiPostPut } from "../../resources/api_calls/api_methods";
import apiUrl from "../../resources/api_calls/api_urls";

class ProductStore {
  price = 1;
  showActiveProduct = false;
  listProducts = [];
  loading = false;
  activeProductsList = [];

  constructor() {
    makeAutoObservable(this);
  }

  setPrice() {
    this.price += 1;
    console.log(this.price);
  }

  addAndFetchedProductFromAPI = async () => {
    const response = await apiGet(apiUrl.fetchAllProducts);
    if (response.status === 200) {
      // response.body.map((data) => this.listProducts.push(data));
    }
    const response2 = await apiGet(apiUrl.fetchInactiveProducts);
    if (response2.status === 200) {
      response2.body.map((data) => this.listProducts.push(data));
    }
  };

  fetchProducts = async () => {
    const response = await apiGet(apiUrl.fetchAllProducts);
    console.log("respo", response);
    this.price += response.body.length;
  };

  fetchProductFromDB = async () => {
    if (this.loading) {
      alert("loading try again later..");
      return;
    }
    console.log("getting users from db");
    this.loading = true;
    const resp = await apiGet(apiUrl.listProducts);
    const response2 = await apiGet(apiUrl.fetchInactiveProducts);

    this.loading = false;
    if (resp.status === 200) {
      this.listProducts = resp.body?.data;
      console.log(resp.body?.data);
    } else {
      console.log("went wroing", resp.status);
    }
    console.log("this response 2", response2.status, response2.body);
    if (response2.status === 200) {
      this.listProducts.push(response2.body?.data);
    } else {
      console.log("went wroing", resp.status);
    }
    this.activeProductsList = this.listProducts.filter(
      (el) => el.isActive === true
    );
  };

  deleteProduct = async (pId) => {
    if (this.loading) {
      alert("loading Please wait..");
      return;
    }
    let body = {
      isDeleted: true,
    };
    let path = `/product/products/${pId}`;
    this.loading = true;
    const resp = await apiPostPut(body, path, "PUT");
    this.loading = false;
    if (resp.status === 200 || resp.status === 204) {
      this.delete2(pId);
    }
  };

  delete2 = (pId) => {
    let remainingProds = this.listProducts.filter((user) => user._Id !== pId);
    console.log(remainingProds);
    this.listProducts = remainingProds;
  };

  getProdDetById = (pId) => {
    let index = this.listProducts.findIndex((prod) => prod._id == pId);
    if (index < 0) return "no prod here";
    //  let rideProd = this.listProducts.find((user) => user._id.toString() == pId.toString());
    // if(rideProd == null|| rideProd == undefined) return " ";
    //  console.log(rideProd);
    return this.listProducts[index];
  };

  editProductInDB = async (pId, editedData) => {
    if (this.loading) {
      alert("loading Please wait..");
      return;
    }
    let body = {
      ...editedData,
    };
    let path = `/product/products/${pId}`;
    this.loading = true;
    const resp = await apiPostPut(body, path, "PUT");
    this.loading = false;

    return resp.status;
  };

  editProductLocalStore = async (pId, editedData) => {
    let dataToBeUpdate = this.getProdDetById(pId);
    const indexTobeEdited = this.listProducts.indexOf(dataToBeUpdate);
    this.listProducts[indexTobeEdited] = { ...dataToBeUpdate, ...editedData };

    const updateStatus = this.editProductInDB(pId, editedData);
    if (updateStatus !== 200) {
      this.listProducts[indexTobeEdited] = { ...dataToBeUpdate };
    }
  };

  setActiveProduct() {
    this.activeProductsList = this.listProducts.filter(
      (el) => el.isActive === true
    );
  }

  getActiveProduct = () => {
    if (this.showActiveProduct) {
      return this.listProducts.filter((product) => product.isActive === true);
    }
  };

  addProductToDataBase = async (body) => {
    let path = `"/product/new-products"`;
    this.loading = true;
    const resp = await apiPostPut(body, path, "POST");
    this.loading = false;
    return resp.status;
  };
  addProductToLocalStore = (body) => {
    // this.listProducts.push(body)
    const len = this.listProducts.length;
    this.listProducts[len] = body;
    const updateStatus = this.addProductToDataBase(body);

    if (updateStatus !== 200) {
      this.listProducts.pop();
    }
  };
}

export default ProductStore;
