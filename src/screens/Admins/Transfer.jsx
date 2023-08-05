import { useState, useEffect } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { showToastError } from "utils";
import { apis } from "services";

export const TRANSFER_COINS = ["USDT", "BTC", "ETH"];
export const TRANSFER_ACCOUNTS = [
  { label: "Futures Account" },
  { label: "Main Account" },
];

export default function Transfer({ isModal }) {
  const { state } = useLocation();
  console.log(state);
  const [update, setUpdate] = useState(0);
  const [coin, setCoin] = useState("USDT");
  const [fromAccount, setFromAccount] = useState(TRANSFER_ACCOUNTS[1].label);
  const [toAccount, setToAccount] = useState(TRANSFER_ACCOUNTS[0].label);
  const [amount, setAmount] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [submitButton, setSubmitButton] = useState("Convert");
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (!state?.userId) {
        return;
      }

      if (!submitButton === "Loading") {
        console.log("It's Loading");
        return;
      }

      if (fromAccount === toAccount) {
        showToastError({ message: "To And From Account Cannot Be Same" });
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
        coin: coin,
        fromAccount: fromAccount,
        toAccount: toAccount,
        amount: amount,
      };
      await apis.universalTransfer(body);
      setUpdate((prev) => prev + 1);
      setAmount(0);
      console.log("Form submitted");
    } catch (error) {
      showToastError({
        message:
          "This Function Requires Universal Transfer Permit. Check Your Api Key Permissions",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log("HELLO");
    setSubmitButton("Loading");
    apis
      .getAvailableBalance(state?.userId, coin, fromAccount)
      .then((res) => {
        setAvailableBalance(res.data.balance);
        setSubmitButton("Convert");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [coin, fromAccount, state?.userId, update]);

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
                <h2 className="text-center mb-4">Transfer</h2>
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
                      onChange={(e) => setCoin(e.target.value)}
                    >
                      {TRANSFER_COINS.map((_coin, index) => (
                        <option
                          key={index}
                          value={_coin}
                          selected={coin === _coin}
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
                    <Form.Label>From</Form.Label>
                    <Form.Select
                      required
                      className="custom-input"
                      aria-label="Default select example"
                      name="fromAccount"
                      id="fromAccount"
                      onChange={(e) => setFromAccount(e.target.value)}
                      defaultValue={fromAccount}
                    >
                      {TRANSFER_ACCOUNTS.map(({ label }) => (
                        <option value={label} selected={fromAccount === label}>
                          {label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <div className="d-flex justify-content-center">
                    <i
                      className="fa fa-arrows-up-down"
                      role="button"
                      onClick={() => {
                        const f = fromAccount;
                        setFromAccount(toAccount);
                        setToAccount(f);
                      }}
                    ></i>
                  </div>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>To</Form.Label>
                    <Form.Select
                      required
                      className="custom-input"
                      aria-label="Default select example"
                      name="toAccount"
                      id="toAccount"
                      onChange={(e) => setToAccount(e.target.value)}
                      defaultValue={toAccount}
                    >
                      {TRANSFER_ACCOUNTS.map(({ label }) => (
                        <option value={label} selected={toAccount === label}>
                          {label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Transfer Amount ({coin})</Form.Label>
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
                        {(Math.round(availableBalance * 100) / 100).toFixed(2)}
                      </InputGroup.Text>
                    </InputGroup>
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
