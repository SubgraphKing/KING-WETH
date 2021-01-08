import { Transfer } from "../generated/Contract/Contract";
import { TokenTransfer } from "../generated/schema";
import { getAccount } from "./utils/getAccount";
import { logTransaction } from "./utils/logTransaction";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { getHistory } from "./utils/getHistory";
import { constants } from "./utils/CONSTS";
import { integers } from "./utils/integers";

//A function that gets the average (does not catch divide by zero errors)
function getAverage(totalAmount: BigInt, totalTimes: BigInt): BigDecimal {
  let totalAmountInDecimal = new BigDecimal(totalAmount);
  return totalAmountInDecimal.div(new BigDecimal(totalTimes));
}

function getPercentOfTotalSupply(
  tokenAmount: BigInt,
  totalSupply: BigInt | null
): BigDecimal {
  //In the case this function is called before a history is created, and totally supply is null, return a zero in BigDecimal
  if (totalSupply == null) {
    return constants.BIGDECIMAL_ZERO;
  }

  let tokenAmountInDecimal = new BigDecimal(tokenAmount);
  let totalSupplyInDecimal = new BigDecimal(totalSupply as BigInt);

  return tokenAmountInDecimal.div(totalSupplyInDecimal);
}

export function handleTransfer(event: Transfer): void {
  let tx = logTransaction(event);
  let history = getHistory(tx);
  let from = getAccount(event.params.src, tx);
  let to = getAccount(event.params.dst, tx);
  let amount = event.params.wad;


  // ================ Accounts ===========================================//

  /*  FROM */
  let originalBalanceFrom = from.tokenBalance;
  let fromTokenBalanceAfterTransfer = originalBalanceFrom.minus(amount);

  from.tokenTransferOutCount = integers.increment(from.tokenTransferOutCount);
  from.tokenTransferOutAmountTotal = from.tokenTransferOutAmountTotal.plus(
    amount
  );
  from.tokenBalance = fromTokenBalanceAfterTransfer;

  //Calculate Average
  from.tokenTransferAmountAverage = getAverage(
    from.tokenTransferOutAmountTotal,
    from.tokenTransferOutCount
  );

  //Update percent of Total supply owned
  //handle case when the user now has nothing
  if (fromTokenBalanceAfterTransfer == constants.BIGINT_ZERO) {
    from.percentOfTotalSupply = constants.BIGDECIMAL_ZERO;
  } else {
    from.percentOfTotalSupply = getPercentOfTotalSupply(
      fromTokenBalanceAfterTransfer,
      history.totalSupply
    );
  }
  from.save();

  /* To */

  let originalBalanceTo = to.tokenBalance;
  let toTokenBalanceAfterTransfer = originalBalanceTo.plus(amount);

  to.tokenTransferInCount = integers.increment(to.tokenTransferInCount);
  to.tokenTransferInAmountTotal = to.tokenTransferInAmountTotal.plus(amount);
  to.tokenBalance = toTokenBalanceAfterTransfer;

  //Calculate Average
  to.tokenReceivedAmountAverage = getAverage(
    to.tokenTransferInAmountTotal,
    to.tokenTransferInCount
  );

  //Update percent of Total supply owned
  //New Balance divided by total supply
  //Handle case when new balalance is zero
  if (toTokenBalanceAfterTransfer == constants.BIGINT_ZERO) {
    to.percentOfTotalSupply = constants.BIGDECIMAL_ZERO;
  } else {
    to.percentOfTotalSupply = getPercentOfTotalSupply(
      toTokenBalanceAfterTransfer,
      history.totalSupply
    );
  }
  to.save();

  // ================ Transfer Event ===========================================//

  let transferId = `${tx.id}-${event.logIndex.toString()}-tokenTransfer`;

  let transfer = new TokenTransfer(transferId);

  //Calculate total supply this represents
  let percentTotalSupply = getPercentOfTotalSupply(amount, history.totalSupply);

  transfer.transaction = tx.id;
  transfer.timestamp = event.block.timestamp;
  transfer.block = event.block.number;
  transfer.from = from.id;
  transfer.to = to.id;
  transfer.amount = event.params.wad;
  transfer.percentOfTotalSupply = percentTotalSupply;
  transfer.save();

  // ================ System History ===========================================//

  history.tokenTransferCount = integers.increment(history.tokenTransferCount);

  if (originalBalanceFrom.minus(amount) == constants.BIGINT_ZERO) {
    history.tokenHolderCount = integers.decrement(history.tokenHolderCount);
  }
  if (
    originalBalanceTo == constants.BIGINT_ONE &&
    originalBalanceTo.plus(amount) > constants.BIGINT_ONE
  ) {
    history.tokenHolderCount = integers.increment(history.tokenHolderCount);
  }
  history.save();
}
