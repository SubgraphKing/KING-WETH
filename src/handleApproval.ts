import { Approval } from "../generated/Contract/Contract"
import { getAccount } from "./utils/getAccount";
import { logTransaction } from "./utils/logTransaction";
import { TokenApproval } from "../generated/schema";

/*
Handle approval is for when a user gives another permission to spend their tokens. 

We want to track this, we get or create a new account for each address in the event params. 
We then create an approval: 
    `${from.id}-${to.id}-${tx.id}-${event.logIndex.toString()}-approval`
This is unique for each approval and allows us to track the history of a users approvals. 

*/
export function handleApproval(event: Approval): void {
  let tx = logTransaction(event);
  let from = getAccount(event.params.src, tx);
  let to = getAccount(event.params.guy, tx);

  let approvalId = `${from.id}-${to.id}-${tx.id}-${event.logIndex.toString()}-approval`
  let approval = new TokenApproval(approvalId);
  approval.transaction = tx.id;
  approval.timestamp = event.block.timestamp;
  approval.block = event.block.number;
  approval.from = from.id;
  approval.to = to.id;
  approval.amount = event.params.wad;

  approval.save();
}
