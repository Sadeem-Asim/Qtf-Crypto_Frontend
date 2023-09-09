import { useState, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
// import { useLocation } from "react-router-dom";
// import { showToastError } from "utils";
import { apis } from "services";
import _ from "lodash";

export default function MyOrder({
  id,
  update,
  coin,
  setUpdate,
  quantity = 0.0,
}) {
  const [activeOrder, setActiveOrder] = useState({});
  console.log(activeOrder);
  //   console.log(activeOrder);
  //   console.log(activeOrder);
  useEffect(() => {
    if (id) {
      apis.getActiveOrder(id, coin).then((res) => {
        console.log(res);
        if (res.data.message === "No Active Order") {
          setActiveOrder({});
        } else {
          setActiveOrder(res.data.order);
        }
      });
    }
  }, [update, id, coin]);

  const onSubmitHandler = () => {
    const data = {
      id: activeOrder._id,
      tpsl: activeOrder.tpsl,
      takeProfit: Number(activeOrder.takeProfit),
      addBalance: Number(activeOrder.addBalance),
    };

    apis
      .updateTakeProfit(data)
      .then((res) => {
        console.log(res);
        setUpdate((update) => update + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {activeOrder?.side ? (
        <Container>
          <Form>
            <Row className="justify-content-center">
              <Col style={{ padding: "15px" }}>
                <div className="bot-box">
                  <h4 className="heading">Configuration</h4>
                  <Form>
                    <div
                      className="position-enty-price"
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <p>Balance In order</p>
                        <span>{activeOrder.balance}</span>
                      </div>
                      <div>
                        <p>Buy</p>
                        <span>{activeOrder.buy}</span>
                      </div>
                      <div>
                        <p>Sell</p>
                        <span>{activeOrder.sell}</span>
                      </div>
                    </div>

                    <span>Add Balance:</span>
                    <Form.Group className="mb-3" controlId="addBalance">
                      <Form.Control
                        className="custom-input"
                        type="number"
                        name="addBalance"
                        value={activeOrder?.addBalance}
                        placeholder="Add Balance Amount"
                        onChange={(e) => {
                          setActiveOrder({
                            ...activeOrder,
                            addBalance: e.target.value,
                          });
                        }}
                        required
                      />
                    </Form.Group>
                    <span>Take Profit:</span>
                    <Form.Group className="mb-3" controlId="takeProfit">
                      <Form.Control
                        className="custom-input"
                        type="number"
                        name="takeProfit"
                        value={activeOrder?.takeProfit}
                        placeholder="Take Profit Amount"
                        onChange={(e) => {
                          setActiveOrder({
                            ...activeOrder,
                            takeProfit: e.target.value,
                          });
                        }}
                        required
                      />
                    </Form.Group>
                  </Form>
                  <div
                    className="position-enty-price"
                    style={{
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <p>Estimated Pnl</p>
                      <span className="text-green">
                        {activeOrder?.takeProfit !== 0
                          ? activeOrder.side === "BUY"
                            ? _.round(
                                activeOrder.coin === "BTCUSDT"
                                  ? (activeOrder?.takeProfit -
                                      activeOrder.buy) *
                                      quantity
                                  : (activeOrder?.takeProfit -
                                      activeOrder.buy) *
                                      quantity,
                                4
                              )
                            : _.round(
                                activeOrder.coin === "BTCUSDT"
                                  ? (activeOrder?.takeProfit -
                                      activeOrder.sell) *
                                      quantity
                                  : (activeOrder?.takeProfit -
                                      activeOrder.sell) *
                                      quantity,
                                4
                              )
                          : 0.0}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex my-2">
                    <Form.Check
                      className="custom-switch"
                      type="switch"
                      //   id="botStatus"
                      //   name="botStatus"
                      label="Take Profit Status"
                      checked={activeOrder?.tpsl}
                      onChange={() => {
                        setActiveOrder({
                          ...activeOrder,
                          tpsl: !activeOrder?.tpsl,
                        });
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
          <div className="text-center mt-5">
            <button
              className="custom-btn primary-btn mt-2 w-50"
              // disabled={isLoading}
              onClick={onSubmitHandler}
            >
              {/* {isLoading ? "Saving" : "Save Bot Settings"} */}
              Save
            </button>
          </div>
        </Container>
      ) : (
        <div className="no-order-box ">
          <p>No Active Orders</p>
        </div>
      )}
    </div>
  );
}
