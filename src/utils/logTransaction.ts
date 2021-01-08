import { ethereum, Address } from "@graphprotocol/graph-ts";
import { Transaction } from "../../generated/schema";
import { getAccount } from "./getAccount";
import { constants } from "./CONSTS";

export function logTransaction(event: ethereum.Event): Transaction {
  let tx = new Transaction(event.transaction.hash.toHexString());

  tx.from = event.transaction.from.toHexString();
  tx.value = event.transaction.value;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp;
  tx.blockNumber = event.block.number;


  if (event.transaction.to == null) {
    let toAccountAddress = Address.fromString(constants.ZERO_ADDRESS); //Check if the "To Address is Null"
    tx.to = getAccount(toAccountAddress, tx).id;
  } else {
    tx.to = getAccount(event.transaction.to as Address, tx).id;
  }

  tx.save();

  let from = getAccount(event.transaction.from, tx);
  from.save();

  return tx as Transaction;
}
