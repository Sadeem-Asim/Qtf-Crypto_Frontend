import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { apis } from "services";
import { useLocation } from "react-router-dom";
import Conversion from "./Conversion";
import { showToastError } from "utils";
import { toast } from "react-toastify";
import { Loader } from "components";

export default function Leverage() {
  const toastOptions = {
    autoClose: 2000,
    className: "",
    position: toast.POSITION.TOP_RIGHT,
  };
  const toastSuccess = (message) => {
    console.log("Hello0 success toast");
    toast.success(message, toastOptions);
  };

  const { state } = useLocation();
  console.log(state);
  const [componentState, setComponentState] = useState({
    modalType: "available",
    orderTab: "position",
  });

  const [availableBalance, setAvailableBalance] = useState(0);
  const [leverage, setLeverage] = useState(1);
  const [amount, setAmount] = useState(0);
  const [tpsl, setTpsl] = useState(false);
  const [reduceOnly, setReduceOnly] = useState(false);
  const [futurePrices, setFuturePrices] = useState();
  const [futureCoins, setFutureCoins] = useState([
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
  ]);
  const [margin, setMargin] = useState({
    type: 1,
    amount: 0,
  });
  const [update, setUpdate] = useState(0);
  const [max, setMax] = useState(0);
  const [cost, setCost] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState({});
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const filteredCoins = futureCoins.filter((coin) =>
    coin.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
  };
  const handleModalOpen = () => {
    console.log("Opening Modal");
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearchQuery("");
  };

  const handleMarketClose = async (id, quantity, coin, type) => {
    try {
      console.log("In Market Close");
      console.log(id, quantity, coin, type);
      const data = {
        id,
        quantity,
        coin,
        type,
      };
      const res = await apis.marketClose(data);
      console.log(res);
      if (res.status === 200) {
        setPosition({});
        toastSuccess("Market closed successfully");
      } else {
        showToastError({
          message: res.data.response.msg,
        });
      }

      setUpdate((a) => a + 1);
    } catch (error) {
      showToastError({
        message: error.message.message,
      });
      return;
    }
  };
  function truncateToDecimals(num, dec = 3) {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  }
  const handleSubmit = async (type) => {
    try {
      if (
        !selectedCoin ||
        !amount ||
        !leverage ||
        !selectedCoin ||
        !state?.userId
      ) {
        showToastError({
          message: "Please Enter All Data",
        });
        return;
      }

      const data = {
        id: state?.userId,
        type: type,
        reduceOnly: reduceOnly,
        amount: amount,
        leverage: leverage,
        coin: selectedCoin,
      };
      const res = await apis.futureMarketBuySell(data);
      console.log(res);
      toastSuccess(res.data.response.msg);

      setUpdate((a) => a + 1);
    } catch (error) {
      showToastError({
        message: error.message.message,
      });
      return;
    }
  };

  const handleAdjustMargin = async () => {
    try {
      const data = {
        id: state?.userId,
        coin: selectedCoin,
        quantity: margin.amount,
        type: margin.type,
      };
      const res = await apis.adjustMargin(data);
      console.log(res);
      if (res.data.response.code === 200) {
        setShow(false);
        setMargin({ type: 1, amount: 0 });
        toastSuccess(res.data.response.msg);
        setUpdate((a) => a + 1);
      } else {
        showToastError({
          message: res.data.response.msg,
        });
      }
    } catch (error) {
      showToastError({
        message: error.message.message,
      });
      return;
    }
  };

  useEffect(() => {
    if (selectedCoin) {
      setIsLoading(true);
      apis.getPositionRisk(state?.userId, selectedCoin).then((res) => {
        if (res.data.result.positionAmt !== "0.000") {
          console.log(res.data.result);
          setPosition(res.data.result);
        }
        setIsLoading(false);
      });
    }
  }, [selectedCoin, state?.userId, update]);

  useEffect(() => {
    setLoading(true);
    apis
      .getFuturePrices(state?.userId)
      .then((res) => {
        setFutureCoins(res.data.filteredAndSortedKeys);
        setFuturePrices(res.data.futurePrices);
        setLoading(false);
      })
      .catch((err) => console.error(err));
    apis
      .getAvailableBalance(state?.userId, "USDT", "Futures Account")
      .then((res) => {
        setAvailableBalance(res.data.balance);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [state?.userId, update]);
  useEffect(() => {
    if (selectedCoin) {
      let result = (amount * leverage) / futurePrices[selectedCoin];
      result = truncateToDecimals(result);
      console.log(result);
      setMax(result);
      setCost(
        truncateToDecimals((result * futurePrices[selectedCoin]) / leverage, 2)
      );
    }
  }, [selectedCoin, amount, leverage, futurePrices]);
  return (
    <div className="dashboard-main custom-scroll">
      <div className="section transfer">
        <Container fluid>
          {loading === true ? (
            <Loader variant="light" style={{ minHeight: "100vh" }} />
          ) : (
            <Row>
              <Col md={12}>
                <div className="leverage-info">
                  <div className="modal-container">
                    {isModalOpen && (
                      <div className="modal">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h2>Select Coin</h2>
                            <button
                              className="close-modal-button"
                              onClick={handleModalClose}
                            >
                              X
                            </button>
                          </div>
                          <div className="modal-body">
                            <input
                              type="text"
                              placeholder="Search coins..."
                              value={searchQuery}
                              onChange={handleSearchChange}
                            />

                            <ul className="coin-list">
                              {filteredCoins.map((coin, i) => (
                                <li
                                  key={i}
                                  className={`coin-item ${
                                    selectedCoin === coin ? "selected" : ""
                                  }`}
                                  onClick={() => handleCoinSelect(coin)}
                                >
                                  {coin}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="modal-footer">
                            <button
                              className="select-button"
                              disabled={!selectedCoin}
                              onClick={handleModalClose}
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="open-modal-button"
                      onClick={handleModalOpen}
                    >
                      {selectedCoin ? selectedCoin : "Select Coin"}
                    </button>
                  </div>
                  <div className="amount-percent">Market</div>
                  <div className="" style={{ fontSize: "25px" }}>
                    Leverage : {leverage}x
                  </div>
                  <div class="slidecontainer" id="smallslider">
                    <input
                      type="range"
                      min="1"
                      max="125"
                      class="slider"
                      onChange={(e) => {
                        setLeverage(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <input
                      className="quantity-input"
                      placeholder="Size"
                      type="number"
                      value={amount}
                      style={{
                        marginBottom: "20px",
                      }}
                    />
                    <input
                      type="range"
                      min="1"
                      max="100"
                      class="slider"
                      onChange={(e) => {
                        const percent = e.target.value / 100;
                        let amount = percent * availableBalance;
                        amount = (Math.round(amount * 100) / 100).toFixed(2);
                        setAmount(amount);
                      }}
                    />
                  </div>

                  <div>
                    {/* <p>
                      <input
                        onChange={(e) => {
                          setTpsl((a) => !a);
                        }}
                        type="checkbox"
                        id="test1"
                        name="radio-group"
                        checked={tpsl}
                        disabled={reduceOnly}
                      />
                      <label for="test1">TP/SL</label>
                    </p> */}
                    <p>
                      <input
                        onChange={(e) => {
                          setReduceOnly((a) => !a);
                          if (!reduceOnly === true) {
                            setTpsl(false);
                          }
                        }}
                        type="checkbox"
                        id="test2"
                        name="radio-group"
                        checked={reduceOnly}
                        disabled={tpsl}
                      />
                      <label for="test2">Reduce Only</label>
                    </p>
                  </div>

                  {tpsl && (
                    <div className="tpsl-box">
                      <h4>TP/SL</h4>
                      <div className="t-box">
                        <p>Contract</p>
                        <span>BTC PERP</span>
                      </div>
                      <div className="t-box">
                        <p>Entry Price</p>
                        <span>200000</span>
                      </div>
                      <div className="t-box">
                        <p>Last Price</p>
                        <span>260000</span>
                      </div>

                      <div className="profit-box">
                        <div className="lg-input">
                          <label>Take Profit</label>
                          <div className="input-end-text">
                            <input placeholder="Price" type="text" />
                            <p>USDT</p>
                          </div>
                        </div>
                        <div className="sml-input">
                          <label>Last Price</label>
                          <div className="input-end-text">
                            <input type="text" placeholder="Percentage" />
                            <p>%</p>
                          </div>
                        </div>
                      </div>

                      <div className="profit-box">
                        <div className="lg-input">
                          <label>Take Profit</label>
                          <div className="input-end-text">
                            <input placeholder="Price" type="text" />
                            <p>USDT</p>
                          </div>
                        </div>
                        <div className="sml-input">
                          <label>Last Price</label>
                          <div className="input-end-text">
                            <input placeholder="Price" type="text" />
                            <p>%</p>
                          </div>
                        </div>
                      </div>
                      <p>Configure by amount</p>
                    </div>
                  )}

                  <div className="availabel-icon">
                    <p>Avail.</p>
                    <span>
                      {availableBalance} USDT{" "}
                      <span
                        onClick={() => {
                          setComponentState({
                            ...componentState,
                            modalType: "available",
                          });
                          setShow(true);
                        }}
                      >
                        <svg
                          version="1.1"
                          width="30"
                          height="30"
                          x="0"
                          y="0"
                          viewBox="0 0 24 24"
                        >
                          <g>
                            <g fill="#000">
                              <path
                                d="M21 11H7c-.6 0-1-.4-1-1s.4-1 1-1h11.6l-2.3-2.3c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l4 4c.3.3.4.7.2 1.1-.1.4-.5.6-.9.6zM7 19c-.3 0-.5-.1-.7-.3l-4-4c-.3-.3-.4-.7-.2-1.1s.5-.6.9-.6h14c.6 0 1 .4 1 1s-.4 1-1 1H5.4l2.3 2.3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"
                                fill="#00bf20"
                                data-original="#000000"
                                class=""
                              ></path>
                            </g>
                          </g>
                        </svg>
                      </span>
                    </span>
                  </div>
                  <div
                    className="availabel-icon"
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    <p>Cost</p>
                    <span>{cost} USDT</span>
                  </div>
                  <div
                    className="availabel-icon"
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    <p>Max</p>
                    <span>
                      {max} {selectedCoin.replace("USDT", "")}
                    </span>
                  </div>
                  <div
                    className="lvg-btns"
                    style={{
                      marginBottom: "20px",
                    }}
                  >
                    <button
                      className="lvg-buy-btn"
                      onClick={() => {
                        handleSubmit("BUY");
                      }}
                    >
                      Buy/Long
                    </button>
                    <button
                      className="lvg-sell-btn"
                      onClick={() => {
                        handleSubmit("SELL");
                      }}
                    >
                      Sell/Short
                    </button>
                  </div>
                  <div>
                    <div>
                      <button
                        className={
                          componentState.orderTab === "position"
                            ? "active-tab"
                            : "non-active-tab"
                        }
                        style={
                          position?.side === "BUY"
                            ? {
                                borderBottom: "2px solid rgb(85, 135, 4) ",
                              }
                            : position?.side === "SELL"
                            ? {
                                borderBottom: "2px solid #ff485a",
                              }
                            : {
                                // borderBottom: "2px solid #b39d64",
                              }
                        }
                        onClick={() =>
                          setComponentState({
                            ...componentState,
                            orderTab: "position",
                          })
                        }
                      >
                        Position
                      </button>
                      <button
                        className={
                          componentState.orderTab === "myOrder"
                            ? "active-tab"
                            : "non-active-tab"
                        }
                        onClick={() =>
                          setComponentState({
                            ...componentState,
                            orderTab: "myOrder",
                          })
                        }
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          setUpdate((a) => a + 1);
                        }}
                      >
                        <i class="fa-solid fa-arrows-rotate"></i>
                      </button>
                    </div>
                    {componentState.orderTab === "position" && (
                      <div>
                        {selectedCoin === position?.symbol ? (
                          <>
                            {" "}
                            <div className="position-enty-price">
                              <div>
                                <p>Symbol</p>
                                <span>{position.symbol}</span>
                              </div>
                              <div>
                                <p>Leverage</p>
                                <span>{position.leverage}x</span>
                              </div>
                              <div>
                                <p>Margin Type</p>
                                <span>Isolated</span>
                              </div>
                            </div>
                            <div className="position-enty-price">
                              <div>
                                <p>Entry Price</p>
                                <span>{position.entryPrice}</span>
                              </div>
                              <div>
                                <p>Liquidation Price</p>
                                <span>{position.liquidationPrice}</span>
                              </div>
                              <div>
                                <p>Mark Price</p>
                                <span>{position.markPrice}</span>
                              </div>
                            </div>
                            <div className="position-enty-price">
                              <div>
                                <p>QTY({selectedCoin.replace("USDT", "")})</p>
                                <span>{position.positionAmt}</span>
                              </div>
                              <div>
                                <p>Realized PNL</p>
                                <span>{position.unRealizedProfit}</span>
                              </div>
                              <div>
                                <p>
                                  Margin USDT
                                  <svg
                                    onClick={() => {
                                      setComponentState({
                                        ...componentState,
                                        modalType: "marginUsdt",
                                      });
                                      setShow(true);
                                    }}
                                    version="1.1"
                                    width="13"
                                    height="13"
                                    x="0"
                                    y="0"
                                    viewBox="0 0 512 512.006"
                                  >
                                    <g>
                                      <path
                                        d="m507.523 148.89-138.668-144a16.014 16.014 0 0 0-17.492-3.734 16.024 16.024 0 0 0-10.027 14.848V85.34h-5.332c-114.688 0-208 93.312-208 208v32c0 7.422 5.226 13.61 12.457 15.297 1.176.297 2.348.425 3.52.425 6.039 0 11.82-3.542 14.613-9.109 29.996-60.012 90.304-97.281 157.398-97.281h25.344v69.332a15.97 15.97 0 0 0 10.027 14.828c5.996 2.453 12.969.961 17.492-3.734l138.668-144c5.973-6.207 5.973-15.977 0-22.207zm0 0"
                                        fill="#ffffff"
                                        data-original="#000000"
                                      ></path>
                                      <path
                                        d="M448.004 512.004h-384c-35.285 0-64-28.711-64-64V149.34c0-35.285 28.715-64 64-64h64c11.797 0 21.332 9.535 21.332 21.332s-9.535 21.332-21.332 21.332h-64c-11.777 0-21.336 9.559-21.336 21.336v298.664c0 11.777 9.559 21.336 21.336 21.336h384c11.773 0 21.332-9.559 21.332-21.336V277.34c0-11.797 9.535-21.336 21.332-21.336 11.8 0 21.336 9.539 21.336 21.336v170.664c0 35.289-28.715 64-64 64zm0 0"
                                        fill="#ffffff"
                                        data-original="#000000"
                                      ></path>
                                    </g>
                                  </svg>
                                </p>
                                <span>{position.isolatedWallet}</span>
                              </div>
                            </div>
                            <div className="market-xlose-btn">
                              <button
                                onClick={() => {
                                  console.log(position);
                                  handleMarketClose(
                                    state?.userId,
                                    position.positionAmt,
                                    position.symbol,
                                    position.side
                                  );
                                }}
                                className="lvg-buy-btn"
                              >
                                Market Close
                              </button>
                            </div>
                          </>
                        ) : isLoading === true ? (
                          <div className="no-order-box">
                            <Loader
                              variant="light"
                              style={{ height: "inherit" }}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="no-order-box">
                              <p>No Positions Yet</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {componentState.orderTab === "myOrder" && (
                      <div className="no-order-box">
                        <p>No Orders Yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>

      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        centered
        className="custom-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {componentState.modalType === "available"
              ? "Transfer"
              : componentState.modalType === "marginUsdt"
              ? "Adjust Margin"
              : "Close With market order"}
          </Modal.Title>
          <div
            className="close-btn"
            onClick={() => {
              setShow(false);
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
        </Modal.Header>
        <Modal.Body style={{ width: "100%" }}>
          {componentState.modalType === "available" ? (
            <div>
              <Conversion isModal={true} />
            </div>
          ) : componentState.modalType === "marginUsdt" ? (
            <div className="margin-usdt-box">
              <select
                id="operationSelect"
                style={{
                  border: "1px solid transparent",
                  borderRadius: "15%",
                  margin: "5px",
                  padding: "10px",
                }}
                onChange={(e) => {
                  console.log(e);
                  setMargin({ ...margin, type: e.target.value });
                }}
              >
                <option value="1">Add</option>
                <option value="2">Remove</option>
              </select>
              <input
                type="number"
                id="numberInput"
                placeholder="USDT"
                value={margin.amount}
                onChange={(e) => {
                  setMargin({ ...margin, amount: e.target.value });
                }}
                style={{
                  border: "1px solid transparent",
                  borderRadius: "5%",
                  padding: "10px",
                }}
              />
              <button
                style={{
                  width: "100%",
                  padding: "5px",
                  fontWeight: "bold",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  marginTop: "20px",
                }}
                onClick={handleAdjustMargin}
              >
                Submit
              </button>
            </div>
          ) : (
            <div className="market-close-box">
              <div className="margin-usdt-box market-close">
                <div>
                  <p>Quantity</p>
                  <span>-0.022</span>
                </div>
                <div>
                  <p>Leverage</p>
                  <span>3000</span>
                </div>
                <div>
                  <p>Position Margin</p>
                  <span>-0.022</span>
                </div>
              </div>
              <div className="lg-input">
                <label>Take Profit</label>
                <div className="input-end-text">
                  <input placeholder="Price" type="text" />
                  <p>USDT</p>
                </div>
              </div>
              <div className="range-lvg">
                <p>0x</p>
                <p>25x</p>
                <p>50x</p>
                <p>75x</p>
                <p>100x</p>
                <p>125x</p>
              </div>
              <button className="close-market-btn">Close Market</button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
