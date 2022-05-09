import { makeAutoObservable } from "mobx";
import { apiGet, apiPostPut } from "../../resources/api_calls/api_methods";
import apiUrl from "../../resources/api_calls/api_urls";

class OrdersStore {
  ordersList = [];
  constructor() {
    makeAutoObservable(this);
  }
}
export default OrdersStore;
