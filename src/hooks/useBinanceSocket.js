import { useEffect } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";

import { LIVE_SERVER, LOCAL_SERVER, SOCKET_EVENTS } from "../constants";
import { setBalance, setBinanceValues } from "redux/slices/binance.slice";

const useBinanceSocket = (token = null) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    if (token) {
      const _id = user?._id;
      const api = JSON.stringify(user.api);
      const sendBinanceEvent = `${SOCKET_EVENTS.HIT_BINANCE_API}_${_id}`;
      const getBinanceDataEvent = `${SOCKET_EVENTS.SEND_BINANCE_API_DATA}_${_id}`;

      const SERVER =
        process.env.NODE_ENV === "development" ? LOCAL_SERVER : LIVE_SERVER;
      const socket = io(SERVER, { auth: { token }, query: `api=${api}` });

      socket.emit(sendBinanceEvent, socket.id);
      socket.on(getBinanceDataEvent, (data) => {
        const { balance, ...restData } = data;
        dispatch(setBinanceValues(restData));
        dispatch(setBalance(balance));
      });

      const id = setInterval(() => {
        socket.emit(sendBinanceEvent, socket.id);
        socket.on(getBinanceDataEvent, (data) => {
          const { balance, ...restData } = data;
          dispatch(setBinanceValues(restData));
          dispatch(setBalance(balance));
        });
      }, 5000);

      return () => {
        clearInterval(id);
        socket.disconnect();
      };
    }
  }, [dispatch, token]);
};

export default useBinanceSocket;
