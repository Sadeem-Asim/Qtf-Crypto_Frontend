import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  data: {
    BTC: {
      id: "bitcoin",
      name: "Bitcoin",
      low: 0,
      high: 0,
      close: 0,
      price: 0,
      change: 0,
      volume: 0,
      bestBid: 0,
      numTrades: 0,
      averagePrice: 0,
      changePercentage: 0,
      symbol: "btc",
    },
    ETH: {
      low: 0,
      high: 0,
      close: 0,
      volume: 0,
      bestBid: 0,
      change: 0,
      numTrades: 0,
      averagePrice: 0,
      changePercentage: 0,
      name: "Ethereum",
      id: "ethereum",
      symbol: "eth",
      price: 0,
    },
  },
  balance: 0.0,
  futureBTCPrice: 0,
  futureETHPrice: 0,
};

const binanceSlice = createSlice({
  name: "binance",
  initialState: INITIAL_STATE,
  reducers: {
    setBinanceValues: (state, action) => {
      state.data = action.payload;
    },
    clearBinanceValues: () => INITIAL_STATE,
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setBTCfuturePrice: (state, action) => {
      state.futureBTCPrice = action.payload;
    },
    setETHfuturePrice: (state, action) => {
      state.futureETHPrice = action.payload;
    },
  },
});

export const {
  setBinanceValues,
  clearBinanceValues,
  setBalance,
  setBTCfuturePrice,
  setETHfuturePrice,
} = binanceSlice.actions;
export default binanceSlice.reducer;
