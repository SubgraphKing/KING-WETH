import { BigInt } from "@graphprotocol/graph-ts";
import { History, Transaction } from "../../generated/schema";
import { constants, TOKEN_ADDRESS } from "./CONSTS";
import { loadName, loadSymbol } from "./loadContracts";

export function getHistory(
  tx: Transaction | null,
  block: BigInt | null = null
): History {

  let history = History.load(TOKEN_ADDRESS);

  if (history == null) {
    let name = "Wrapped Ether";
    let symbol = "WETH";

    history = new History(TOKEN_ADDRESS);
    history.name = name;
    history.symbol = symbol;
    history.totalSupply = constants.BIGINT_ZERO;
    history.tokenTransferCount = constants.BIGINT_ZERO;
    history.tokenHolderCount = constants.BIGINT_ZERO;
    history.totalAddressCount = constants.BIGINT_ZERO;
    history.totalWithdrawalCount = constants.BIGINT_ZERO;
    history.totalDepositCount = constants.BIGINT_ZERO;


    history.save();
  }

  return history as History;
}
