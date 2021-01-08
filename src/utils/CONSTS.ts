import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";

export const TOKEN_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";  //Wrapped Ether

export namespace constants {
  export let BIGINT_ZERO = BigInt.fromI32(0);
  export let BIGINT_ONE = BigInt.fromI32(1);
  export let BIGDECIMAL_ZERO = new BigDecimal(constants.BIGINT_ZERO);
  export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  export const ZERO_BYTES32 =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
}