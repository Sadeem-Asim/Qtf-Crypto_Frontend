import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function Row({
  expanded,
  handleExpand,
  data = {},
  colSpan = 10,
}) {
  const { _id, name, usdt, eth, btc, f_btc, f_eth, f_usdt } = data || {};
  // console.log(_id);
  const { user } = useSelector((store) => store.user);

  const navigate = useNavigate();
  const handleConversion = (id) =>
    navigate("/conversion", { state: { userId: id } });
  const handleLeverage = (id) =>
    navigate("/leverage", { state: { userId: id } });
  const handleBot = (id) => navigate("/bot-config", { state: { userId: id } });
  const handleProfitLoss = (id) =>
    navigate("/byUser/pl-account", { state: { userId: id } });
  return (
    <tr className={""}>
      <td colSpan={colSpan} onClick={handleExpand} role="button">
        <div className="td-bg bothside-radius">
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <div className="item">{expanded ? "▼" : "➤"}</div>
            <div className="item">
              <p>User: </p>
              <p>{name}</p>
            </div>
            <div className="item">
              <p>
                USDT<sub>SPOT</sub> :{" "}
              </p>
              <p>{usdt}</p>
            </div>
            <div className="item">
              <p>
                ETH<sub>SPOT</sub> :{" "}
              </p>
              <p>{eth}</p>
            </div>
            <div className="item">
              <p>
                BTC<sub>SPOT</sub> :{" "}
              </p>
              <p>{btc}</p>
            </div>
            <div className="item">
              <p>
                USDT<sub>FUTURE</sub> :{" "}
              </p>
              <p>{f_usdt}</p>
            </div>
          </div>
        </div>
      </td>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: "#181a1c",
        }}
      >
        <button
          className="primary-btn"
          onClick={() => handleConversion(_id)}
          style={{
            borderRadius: "50px",
            boxShadow: "none",
            marginRight: "10px",
          }}
        >
          Conversion
        </button>
        <button
          className="primary-btn"
          onClick={() => handleLeverage(_id)}
          style={{
            borderRadius: "50px",
            boxShadow: "none",
            marginLeft: "10px",
          }}
        >
          Leverage
        </button>
        <button
          className="primary-btn"
          onClick={() => handleBot(_id)}
          style={{
            borderRadius: "50px",
            boxShadow: "none",
            marginLeft: "10px",
          }}
        >
          Add/Bot
        </button>
        {user?.role === "ADMIN" && (
          <>
            <button
              className="primary-btn"
              onClick={() => handleProfitLoss(_id)}
              style={{
                borderRadius: "50px",
                boxShadow: "none",
                marginLeft: "10px",
              }}
            >
              Profit/Loss
            </button>
          </>
        )}
      </div>
    </tr>
  );
}
