  import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Contract } from "../../generated/Contract/Contract";
import { constants, TOKEN_ADDRESS } from "./CONSTS";

export function loadToken(): Contract {
  let contract = Contract.bind(Address.fromString(TOKEN_ADDRESS));
  return contract;
}

export function loadTotalSupply(): BigInt {
  // return constants.BIGINT_ONE;
  let contract = loadToken();
  let callResult = contract.try_totalSupply();
  if (callResult.reverted) {
    return constants.BIGINT_ZERO;
  } else {
    return callResult.value;
  }
}

export function loadName(): string {
  // return constants.BIGINT_ONE;
  let contract = loadToken();
  let callResult = contract.try_name();
  if (callResult.reverted) {
    return "";
  } else {
    return callResult.value;
  }
}

export function loadSymbol(): string {
  // return constants.BIGINT_ONE;
  let contract = loadToken();
  let callResult = contract.try_symbol();
  if (callResult.reverted) {
    return "";
  } else {
    return callResult.value;
  }
}