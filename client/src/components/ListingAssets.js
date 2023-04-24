import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { readContract, prepareWriteContract, writeContract, waitForTransaction } from "wagmi/actions";
import { nftContract, marketContract, tokenContract } from "../const/contract";
import nftABI from "../abi/nft.json";
import tokenABI from "../abi/token.json";
import marketABI from "../abi/market.json";
import { sepolia } from "wagmi";
import Web3 from "web3";
import { toast } from "react-hot-toast";

export const ListingAssets = ({ map, getListings }) => {
  const [price, setPrice] = useState(0);
  const web3 = new Web3(Web3.givenProvider);
  const account = useAccount();

  const isListed = useContractRead({
    address: marketContract,
    abi: marketABI,
    functionName: "isListed",
    args: [map.tokenId],
  });

  const buyFunc = async (tokenId, index) => {
    const mungBalance = await readContract({
      address: tokenContract,
      abi: tokenABI,
      functionName: "balanceOf",
      args: [account.address],
    });
    if (map.price.gt(mungBalance)) {
      toast.error("Insufficient Mung Token 🥹");
      return;
    }
    const isApproved = await readContract({
      address: tokenContract,
      abi: tokenABI,
      functionName: "allowance",
      args: [account.address, marketContract],
      chainId: sepolia.id,
    });
    if (web3.utils.toBN(map.price.toString()).gt(web3.utils.toBN(isApproved.toString()))) {
      const configApprove = await prepareWriteContract({
        address: tokenContract,
        abi: tokenABI,
        functionName: "approve",
        args: [marketContract, map.price.toString()],
        chainId: sepolia.id,
      });
      const { hash } = await writeContract(configApprove);
      const txDone = await waitForTransaction({ hash });

      if (txDone) {
        toast.success("Mung token approve done ✅");
      }
    }
    const config = await prepareWriteContract({
      address: marketContract,
      abi: marketABI,
      functionName: "buy",
      args: [tokenId, index],
      chainId: sepolia.id,
    });
    const { hash } = await writeContract(config);
    const buyDone = await waitForTransaction({ hash });
    console.log(buyDone);
    if (buyDone) {
      // const newListingCount = await readContract({
      //   address: marketContract,
      //   abi: marketABI,
      //   functionName: "listCount",
      // });
      getListings();
      toast.success("NFT 구매 성공 🥳");
    }
  };

  return (
    <div key={map.tokenId} className="asset-unit">
      <div className="image-wrapper">
        <img alt={map.name} src={map.image}></img>
      </div>
      <div className="asset-name">{map.name}</div>
      <div className="price">{web3.utils.fromWei(map.price.toString(), "ether")} Mung</div>
      <div className={`asset-buy `}>
        <button
          onClick={() => {
            buyFunc(map.tokenId, map.listedIndex);
          }}
        >
          Buy now
        </button>
      </div>
    </div>
  );
};
