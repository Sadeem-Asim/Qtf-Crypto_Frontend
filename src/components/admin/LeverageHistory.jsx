import _ from "lodash";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useQuery } from "react-query";

import { apis } from "services";
import Loader from "../Loader";

const LeverageHistory = ({ id, coin, update }) => {
  const [isLoading, setLoading] = useState(false);
  const [buy, setBuy] = useState([]);
  const [sell, setSell] = useState([]);
  console.log(id, coin);

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
                  <h4 key={index}>{stat.profit}</h4>
                </>
              ))}
            </div>

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
  }, [id, coin, update]);

  if (isLoading) return <Loader variant="light" />;

  return (
    <div className="risk-main custom-scroll">
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
