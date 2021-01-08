import { Address } from "@graphprotocol/graph-ts";
import { Account, Transaction } from "../../generated/schema";
import { getHistory } from "./getHistory";
import { constants } from "./CONSTS";
import { integers } from "./integers";

export function getAccount(address: Address, tx: Transaction): Account {
  let account = Account.load(address.toHexString());

  if (account == null) {
    let history = getHistory(tx);

    account = new Account(address.toHexString());

    account.tokenBalance = constants.BIGINT_ZERO;
    account.tokenTransferOutCount = constants.BIGINT_ZERO;
    account.tokenTransferOutAmountTotal = constants.BIGINT_ZERO;
    account.tokenTransferAmountAverage = constants.BIGDECIMAL_ZERO;
    account.tokenTransferInCount = constants.BIGINT_ZERO;
    account.tokenTransferInAmountTotal = constants.BIGINT_ZERO;
    account.tokenReceivedAmountAverage = constants.BIGDECIMAL_ZERO;
    account.percentOfTotalSupply = constants.BIGDECIMAL_ZERO;
    account.txFirstSeen = tx.id;
    account.txFirstSeenBlock = tx.blockNumber;
    account.totalETHDeposited = constants.BIGINT_ZERO;
    account.totalETHWithdrawn = constants.BIGINT_ZERO;

    history.totalAddressCount = integers.increment(history.totalAddressCount);
    history.save();
    account.save();
  }

  return account as Account;
}
