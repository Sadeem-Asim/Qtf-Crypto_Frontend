import { useState, useEffect } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { showToastError } from "utils";
import { useSelector } from "react-redux";
import { apis } from "services";

export const TRANSFER_COINS = ["USDT", "BTC", "ETH"];

export default function Conversion({ isModal }) {
  const { state } = useLocation();
  const { data: coins } = useSelector((store) => store.binance);
  // console.log(coins);
  console.log(state);
  const [update, setUpdate] = useState(0);
  const [fromCoin, setFromCoin] = useState(TRANSFER_COINS[0]);
  const [toCoin, setToCoin] = useState(TRANSFER_COINS[1]);
  const [amount, setAmount] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [submitButton, setSubmitButton] = useState("Convert");
  const [transferAmount, setTransferAmount] = useState(0);
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (fromCoin === toCoin) {
        showToastError({ message: "From coin and to coin cannot be same" });
        return;
      }

      if (!state?.userId) {
        return;
      }

      if (!submitButton === "Loading") {
        console.log("It's Loading");
        return;
      }
      if (amount === 0 || !amount) {
        showToastError({ message: "Amount Cannot Be Null" });
        return;
      }
      if (!availableBalance) {
        return;
      }
      if (amount > availableBalance) {
        showToastError({
          message: "Amount Cannot Be Greater Than Available Balance",
        });
        return;
      }
      const body = {
        id: state?.userId,
        fromCoin: fromCoin,
        toCoin: toCoin,
        quantity: amount,
      };
      let res = await apis.universalConversion(body);
      console.log(res);
      setUpdate((prev) => prev + 1);
      setAmount(0);
      console.log("Form submitted");
    } catch (error) {
      showToastError({
        message: "Error Plz Try Again",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    if (fromCoin === "USDT") {
      setTransferAmount(availableBalance / coins[toCoin]?.price);
    } else if (
      (fromCoin === "BTC" || fromCoin === "ETH") &&
      (toCoin === "BTC" || toCoin === "ETH")
    ) {
      setTransferAmount(
        (availableBalance * coins[fromCoin]?.price) / coins[toCoin]?.price
      );
    } else {
      setTransferAmount(availableBalance * coins[fromCoin]?.price);
    }
  }, [coins, fromCoin, availableBalance, update, toCoin]);

  useEffect(() => {
    // console.log("HELLO");
    setSubmitButton("Loading");
    apis
      .getAvailableBalance(state?.userId, fromCoin, "Main Account")
      .then((res) => {
        setAvailableBalance(res.data.balance);
        setSubmitButton("Convert");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fromCoin, state?.userId, update]);

  return (
    <div className="dashboard-main custom-scroll">
      <div className="section transfer">
        <Container fluid>
          <Row className="mt-5">
            <Col
              xs={12}
              md={{ span: 6, offset: 3 }}
              id={`${isModal ? "isModal" : ""}`}
            >
              <div className="border rounded p-4 bg-dark">
                <h2 className="text-center mb-4">Conversions</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Coin</Form.Label>
                    <Form.Select
                      // onChange={onChangeHandler}
                      required
                      className="custom-input"
                      aria-label="Default select example"
                      name="coin"
                      id="coin"
                      onChange={(e) => setFromCoin(e.target.value)}
                    >
                      {TRANSFER_COINS.map((_coin, index) => (
                        <option
                          key={index}
                          value={_coin}
                          selected={fromCoin === _coin}
                        >
                          {_coin}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Coin</Form.Label>
                    <Form.Select
                      // onChange={onChangeHandler}
                      required
                      className="custom-input"
                      aria-label="Default select example"
                      name="coin"
                      id="coin"
                      onChange={(e) => setToCoin(e.target.value)}
                    >
                      {TRANSFER_COINS.map((_coin, index) => (
                        <option
                          key={index}
                          value={_coin}
                          selected={toCoin === _coin}
                        >
                          {_coin}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Transfer Amount ({fromCoin})</Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        className="custom-input remove-left-border"
                        aria-label="Amount (to the nearest dollar)"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                        }}
                      />
                      <InputGroup.Text
                        role="button"
                        className="balance"
                        onClick={() => {
                          setAmount(availableBalance);
                        }}
                      >
                        Available Balance:{" "}
                        {/* {(Math.round(availableBalance * 100) / 100).toFixed(2)} */}
                        {availableBalance}
                      </InputGroup.Text>
                    </InputGroup>
                    <Form.Label>
                      Transfer Amount ({fromCoin}): {transferAmount}
                    </Form.Label>
                  </Form.Group>
                  <Button
                    type="submit"
                    className="w-100 custom-btn primary-btn mt-3"
                  >
                    {submitButton}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
