import { ActivityRecord } from "components/admin";
import Row from "components/table/Row";
import { useState } from "react";

export default function TableRow({
  name,
  eth,
  usdt,
  f_usdt,
  f_btc,
  f_eth,
  btc,
  bots,
  deleteBot,
  tab,
  toggleBotModal,
  updateBotStatus,
  handleSetupBot,
  counter,
  ...props
}) {
  console.log({ bots });
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
        data={{ eth, usdt, btc, name, f_btc, f_eth, f_usdt, _id }}
      />
      {expanded &&
        bots.map((bot, i) => (
          <ActivityRecord
            key={i}
            id={i + 1}
            handleSetupBot={handleSetupBot}
            updateStatusHandler={updateBotStatus}
            {...bot}
            stopBot={toggleBotModal}
            tab={tab}
            deleteBot={deleteBot}
          />
        ))}
    </>
  );
}
