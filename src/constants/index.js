export const RISKS = ["LOW", "MODERATE", "HIGH"];
export const COINS = { btc: "BTC", eth: "ETH" };
export const OPERATIONS = { auto: "AUTO", manual: "MANUAL" };
export const ADMIN_ROLES = { admin: "ADMIN", subAdmin: "SUB_ADMIN" };
export const INDICATORS = { rsi: "RSI", trailing: "TRAILING" };
export const EXCHANGES = { binance: "Binance" };
export const DAILY_PROFIT_DAYS = {
  SEVEN_DAYS: 7,
  FOURTEEN: 15,
  THIRTY_DAYS: 30,
};
export const TOTAL_PROFIT_DAYS = {
  SEVEN_DAYS: 7,
  FOURTEEN: 15,
  THIRTY_DAYS: 30,
};
export const STAGES = { LOW: "Q1", MODERATE: "Q2", HIGH: "Q3", DEFAULT: "?" };
export const CONFIGURED_BY = {
  AUTOMATIC: "Not Configured",
  SUB_ADMIN: "By Sub Admin",
  ADMIN: "Admin",
};
export const PROFIT_LOSS_DAYS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  FIFTEEN_DAYS: "15 Days",
  THIRTY_DAYS: "30 Days",
};

export const SOCKET_EVENTS = {
  HIT_BINANCE_API: "HIT_BINANCE_API",
  SEND_BINANCE_API_DATA: "SEND_BINANCE_API_DATA",
};

export const ADMIN_ROUTES = [
  "/",
  "/activity",
  "/portfolio",
  "/profit-loss",
  "/coin-market",
  "/market",
  "/auto-rsi",
  "/auto-trailing",
  "/manual-bot",
  "/user-management",
  "/satistics",
  "/user-assign-management",
  "/user-profit",
  "/paid-history",
  "/api-configuration",
  "/edit-user",
  "/pl-account",
  "/leverage",
  "/conversion",
  "/bot-config",
  "/user/pl-account",
  // '/bill-management/:id'
];

export const USER_ROUTES = [
  "/user/dashboard",
  "/user/paid-history",
  "/user/pl-account",
  "/user/satistics",
  "/user/prediction",
  "/user/bot-config",
  "/user/api-setting",
  "/user/market",
];

export const SUB_ADMIN_ROUTES = [
  "/sub_admin/activity",
  "/sub_admin/portfolio",
  "/sub_admin/auto-rsi",
  "/sub_admin/user-management",
  "/leverage",
  "/conversion",
  "/bot-config",
];

export const BINANCE_RSI_INTERVAL = [
  {
    header: "Minutes",
    items: ["1 minute", "5 minutes", "15 minutes", "30 minutes"],
  },
  {
    header: "Hours",
    items: ["1 hour", "2 hours", "4 hours", "12 hours"],
  },
  {
    header: "Days",
    items: ["1 day", "1 week"],
  },
];

export const KUCOIN_RSI_INTERVAL = [
  {
    header: "Minutes",
    items: ["1 minute", "3 minutes", "5 minutes", "15 minutes", "30 minutes"],
  },
  {
    header: "Hours",
    items: ["1 hour", "2 hours", "4 hours", "6 hours", "8 hours", "12 hours"],
  },
  {
    header: "Days",
    items: ["1 day"],
  },
  {
    header: "Weeks",
    items: ["1 week"],
  },
];

export const LOCAL_SERVER = "http://localhost:5000";
export const LIVE_SERVER = window.location.origin;
// export const LIVE_SERVER = 'https://cryptobot-backend.herokuapp.com'
