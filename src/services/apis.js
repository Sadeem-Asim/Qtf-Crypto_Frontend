import axios from "axios";
import { LIVE_SERVER, LOCAL_SERVER } from "../constants";

const createBackendServer = (baseURL) => {
  axios.defaults.withCredentials = true;

  const api = axios.create({
    baseURL: `${baseURL}/api`,
    headers: {
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    timeout: 60 * 1000,
  });

  //Interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error?.response?.data;
      error.message = message ?? error.message;
      /*if(error?.response?.data?.errors)
                error.errors = error?.response?.data?.errors;*/
      return Promise.reject(error);
    }
  );

  const logout = () => api.get("auth/logout");
  const authenticate = (body) => api.post("auth", body);
  const registration = (body) => api.post("users", body);
  const saveApiKeys = (body) => api.post("users/api_keys", body);
  const getApiKeys = () => api.get("users/api_keys");

  // Bots Requests
  const allBots = () => api.get("bots");
  const createBot = (body) => api.post("bots", body);
  const updateBot = ({ _id, body }) => api.put(`bots/${_id}`, body);
  const userBots = (user_id) => api.get(`bots/user-orders/${user_id}`);
  const userOrdersBot = ({ queryKey: [status] }) =>
    api.get(`bots/${status}-orders`);
  const getBotStats = ({ queryKey: [id] }) =>
    api.get(`bots/settings/stats/${id}`);

  // PredictionModel Requests
  const getPredictions = ({ queryKey }) =>
    api.get(`prediction?currency=${queryKey[1]}`);
  const paidHistory = ({ queryKey }) =>
    api.get(`profit_loss/paid_history?coin=${queryKey[0]}`);
  const userDashboard = ({ queryKey }) =>
    api.get(`profit_loss/user_dashboard?exchange=${queryKey[0]}`);
  const profitLossAccountDetails = ({ queryKey }) =>
    api.get(`profit_loss/account?currency=${queryKey[0]}`);
  const profitLossAccountDetailsByUser = ({ queryKey }) =>
    api.get(`profit_loss/account/${queryKey[1]}?currency=${queryKey[0]}`);
  const getProfitLoss = () => api.get(`admin/profit_loss/details`);
  // Binance Routes
  const binance = () => api.get("binance");
  const balance = () => api.get("binance/balance");
  const binanceCloseOrder = (body) => api.post("binance/close_order", body);
  const kucoinCloseOrder = (body) => api.post(`kucoin/order/close`, body);
  const getAvailableBalance = (id, coin, account) =>
    api.get(`binance/availableBalance/${id}/${coin}/${account}`);
  const universalTransfer = (body) => api.post(`binance/transfer`, body);
  const universalConversion = (body) => api.post(`binance/convert`, body);

  const getFuturePrices = (id) => api.get(`binance/futurePrices/${id}`);
  const futureMarketBuySell = (body) => api.post(`binance/futureMarket`, body);
  const getPositionRisk = (id, coin) =>
    api.get(`binance/positionRisk/${id}/${coin}`);
  const marketClose = (body) => api.post(`binance/marketClose`, body);
  const adjustMargin = (body) => api.post(`binance/adjustMargin`, body);
  const getLeverageStats = (id, coin) =>
    api.get(`binance/leverageHistory/${id}/${coin}`);
  // ADMIN ROUTES
  const deleteBot = (id) => api.delete(`admin/bot/${id}`);
  const allUsers = () => api.get("users/all");
  const allSubAdmin = () => api.get("admin/sub_admin");
  const usersPortfolio = () => api.get("admin/user_portfolio");
  const getRSIValues = ({ queryKey: [exchange, symbol, interval] }) =>
    api.get(
      `taapi/rsi?exchange=${exchange}&symbol=${symbol}&interval=${interval}`
    );

  const getActiveOrder = (id, coin) =>
    api.get(`binance/activeOrder/${id}/${coin}`);
  const updateTakeProfit = (body) => api.put(`binance/takeProfit`, body);
  const updateProfit = (body) => api.put(`binance/profit`, body);
  const userAssignAdmin = (body) => api.put(`admin/sub_admin`, body);
  const deleteSubAdmin = (id) => api.delete(`admin/sub_admin/${id}`);
  const configureBotSetting = ({ id, body }) =>
    api.put(`bots/settings/${id}`, body);
  const profitLossStatisticsAdmin = () =>
    api.get(`admin/profit_loss/statistics`);
  const profitLossAccountDetailsAdmin = (type) =>
    api.get(`admin/profit_loss/dashboard?exchange=${type}`);
  const fetchUserApiKeys = ({ queryKey: [id] }) =>
    api.get(`admin/user_api_keys/${id}`);
  const updateUserApiKeys = ({ id, body }) =>
    api.put(`admin/user_api_keys/${id}`, body);
  const getUser = ({ queryKey: [id] }) => api.get(`admin/user/${id}`);
  const updateUser = ({ id, body }) => api.put(`admin/user/${id}`, body);
  const deleteUserAndBots = (id) =>
    api.delete(`admin/user/delete_user_orders/${id}`);
  const getUserBills = ({ queryKey: [id] }) => api.get(`admin/bill/${id}`);
  const addUserBill = (body) => api.post(`admin/bill`, body);
  const updateUserPaidStatus = (id) => api.put(`admin/bill/update/${id}`);
  const deleteUserBill = (id) => api.delete(`admin/bill/${id}`);
  const addUserBillRecipt = (body) => api.put(`admin/bill/recipt`, body);
  const clearData = () => api.get("admin/clear_data");
  const exportData = () => api.get("admin/export/bot");
  const activityRecords = () => api.get("admin/activity");
  //Returning all the API
  return {
    deleteBot,
    exportData,
    logout,
    allBots,
    binance,
    balance,
    getUser,
    userBots,
    allUsers,
    createBot,
    updateUser,
    getBotStats,
    getProfitLoss,
    deleteUserAndBots,
    updateBot,
    binanceCloseOrder,
    kucoinCloseOrder,
    getApiKeys,
    saveApiKeys,
    paidHistory,
    allSubAdmin,
    getRSIValues,
    authenticate,
    getAvailableBalance,
    registration,
    userDashboard,
    userOrdersBot,
    usersPortfolio,
    getPredictions,
    userAssignAdmin,
    fetchUserApiKeys,
    updateUserApiKeys,
    configureBotSetting,
    profitLossAccountDetails,
    profitLossAccountDetailsByUser,
    profitLossStatisticsAdmin,
    profitLossAccountDetailsAdmin,
    updateUserPaidStatus,
    getUserBills,
    addUserBill,
    deleteUserBill,
    clearData,
    addUserBillRecipt,
    activityRecords,
    universalTransfer,
    getFuturePrices,
    futureMarketBuySell,
    getPositionRisk,
    marketClose,
    adjustMargin,
    getLeverageStats,
    universalConversion,
    deleteSubAdmin,
    getActiveOrder,
    updateTakeProfit,
    updateProfit,
  };
};

const apis =
  process.env.NODE_ENV === "development"
    ? createBackendServer(LOCAL_SERVER)
    : createBackendServer(LIVE_SERVER);

export default apis;
