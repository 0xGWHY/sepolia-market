import { useAccount, useContractRead } from "wagmi";
import abi from "../abi/nft.json";
import { nftContract } from "../const/contract.js";

export default function useBalance() {
  const { address } = useAccount();
  return useContractRead({
    address: nftContract,
    abi,
    functionName: "balanceOf",
    watch: true,
    ...(address && { args: [address] }),
  });
}
