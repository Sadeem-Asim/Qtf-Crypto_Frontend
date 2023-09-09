import _ from "lodash";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
// import { useQuery } from "react-query";
import { apis } from "services";
import Loader from "../Loader";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";

const LeverageHistory = ({ id, coin, update }) => {
  const { user } = useSelector((store) => store.user);
  const [isLoading, setLoading] = useState(false);
  const [buy, setBuy] = useState([]);
  const [sell, setSell] = useState([]);
  const [show, setShow] = useState(false);
  const [editStat, setEditStat] = useState(0);
  const [loadStats, setLoadStats] = useState(0);
  // console.log(id, coin);

  const handleEditProfit = async () => {
    const updatePrams = {
      id: editStat._id,
      profit: editStat.profit,
    };
    apis.updateProfit(updatePrams).then((res) => {
      console.log(res);
      setLoadStats((a) => a + 1);
      setShow(false);
    });
  };

  const generateData = useCallback(({ stats }, type = "MANUAL") => {
    if (!stats) return <></>;
    return (
      <Col lg={6}>
        <div className="risk-inner">
          <h4 className="heading">{type}</h4>
          <div
            className="inner-main"
            style={{
              justifyContent: "space-between",
            }}
          >
            <div className="inner">
              {stats.map((stat, index) => (
                <>
                  <span>Buy</span>
                  <h4 key={index}>{stat.buy}</h4>
                </>
              ))}
            </div>
            <div className="inner">
              {stats.map((stat, index) => (
                <>
                  <span>Sell</span>
                  <h4 key={index}>{stat.sell}</h4>
                </>
              ))}
            </div>
            <div className="inner">
              {stats.map((stat, index) => (
                <>
                  <span>Unrealized Profit</span>
                  <h4 key={index}>{_.round(stat.profit, 4)}</h4>
                </>
              ))}
            </div>

            {user?.role === "ADMIN" ? (
              <div className="inner">
                {stats.map((stat, index) => (
                  <>
                    <span>,.,,.,,.,,.,,.,,</span>
                    <h4
                      style={{
                        backgroundColor: "#604d29",
                        textAlign: "center",
                        // border: "1px solid var(--secondary)",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setEditStat(stat);
                        setShow(true);
                      }}
                    >
                      Edit
                    </h4>
                  </>
                ))}
              </div>
            ) : (
              <div className="inner">
                {stats.map((stat, index) => (
                  <>
                    <span>Take Profit</span>
                    <h4 key={index}>{stat.takeProfit}</h4>
                  </>
                ))}
              </div>
            )}

            {/* <div className="inner">
              <span>Sell</span>
              {stats.sell.length > 0 ? (
                stats.sell.map((value, index) => (
                  <h4 key={index}>{_.round(value)}</h4>
                ))
              ) : (
                <>
                  <h4>00000</h4>
                  <h4>00000</h4>
                  <h4>00000</h4>
                </>
              )}
            </div> */}
            {/* <div className="inner">
              <span>Profit</span>
              {stats.profit.length > 0 ? (
                stats.profit.map((value, index) => (
                  <h4 key={index}>{_.round(value)}</h4>
                ))
              ) : (
                <>
                  <h4>00000</h4>
                  <h4>00000</h4>
                  <h4>00000</h4>
                </>
              )}
            </div> */}
          </div>
        </div>
      </Col>
    );
  }, []);
  useEffect(() => {
    if (coin) {
      setLoading(true);
      apis
        .getLeverageStats(id, coin)
        .then((res) => {
          console.log(res.data);

          setBuy(res.data.buy);
          setSell(res.data.sell);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    }
  }, [id, coin, update, loadStats]);

  if (isLoading) return <Loader variant="light" />;

  return (
    <div className="risk-main custom-scroll">
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        centered
        className="custom-modal"
      >
        <Modal.Header>
          <Modal.Title>Edit Profit</Modal.Title>
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
          <div className="margin-usdt-box">
            <input
              type="number"
              id="numberInput"
              placeholder="USDT"
              value={editStat?.profit}
              onChange={(e) => {
                setEditStat({ ...editStat, profit: e.target.value });
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
              onClick={handleEditProfit}
            >
              Submit
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Container fluid>
        <Row>
          {(() => {
            return (
              <>
                {generateData({ stats: buy }, "Buy / Long")}
                {generateData({ stats: sell }, "Sell / Short")}
              </>
            );
          })()}
        </Row>
      </Container>
    </div>
  );
};

export default memo(LeverageHistory);
