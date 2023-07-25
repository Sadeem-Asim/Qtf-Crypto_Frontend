import { useState } from "react";
import Row from "components/table/Row";
import { ActivityRecord, PortfolioDetails } from "components/admin";

export default function PortfolioTableRow({
  name,
  leverage,
  eth,
  usdt,
  btc,
  bots,
  deleteBot,
  tab,
  toggleBotModal,
  updateBotStatus,
  handleAPIConfiguration,
  counter,
  f_usdt,
  f_btc,
  f_eth,
  ...props
}) {
  const [expanded, setExpanded] = useState(false);
  const { _id } = props;

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Row
        expanded={expanded}
        handleExpand={handleExpand}
        data={{ eth, usdt, btc, name, f_usdt, f_btc, f_eth, _id }}
        colSpan={14}
      />
      {expanded &&
        bots.map((bot, i) => (
          <PortfolioDetails
            leverage={leverage}
            key={i}
            id={i + 1}
            stopBot={toggleBotModal}
            tab={tab}
            inputAPIHandler={handleAPIConfiguration}
            updateBotStatus={updateBotStatus}
            deleteBot={deleteBot}
            {...bot}
          />
        ))}
    </>
  );
}
