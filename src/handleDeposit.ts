import { Deposit } from "../generated/Contract/Contract"
import { getAccount } from "./utils/getAccount";
import { logTransaction } from "./utils/logTransaction";
import { getHistory } from "./utils/getHistory";
import { integers } from "./utils/integers";
/*
Handle approval is for when a user gives another permission to spend their tokens. 

We want to track this, we get or create a new account for each address in the event params. 
We then create an approval: 
    `${from.id}-${to.id}-${tx.id}-${event.logIndex.toString()}-approval`
This is unique for each approval and allows us to track the history of a users approvals. 

*/
export function handleDeposit(event: Deposit): void {
  let tx = logTransaction(event);
  let amount = event.params.wad;

  let account = getAccount(event.params.dst, tx);
  account.totalETHDeposited = integers.increment(account.totalETHDeposited, amount);
  account.save();

  let history = getHistory(tx, event.block.number);
  history.totalSupply = integers.increment(history.totalSupply, amount);
  history.save();
}
