import { Withdrawal } from "../generated/Contract/Contract"
import { getAccount } from "./utils/getAccount";
import { logTransaction } from "./utils/logTransaction";
import { getHistory } from "./utils/getHistory";
import { integers } from "./utils/integers";


export function handleWithdrawal(event: Withdrawal): void {
  let tx = logTransaction(event);
  let amount = event.params.wad;

  let account = getAccount(event.params.src, tx);
  account.totalETHWithdrawn = integers.increment(account.totalETHWithdrawn, amount);
  account.tokenBalance = integers.decrement(account.tokenBalance, amount);
  account.save();

  let history = getHistory(tx, event.block.number);
  history.totalSupply = integers.decrement(history.totalSupply, amount);
  history.save();
}
