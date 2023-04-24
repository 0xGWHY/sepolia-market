import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { readContract, prepareWriteContract, writeContract, waitForTransaction } from "wagmi/actions";
import { nftContract, marketContract } from "../const/contract";
import nftABI from "../abi/nft.json";
import marketABI from "../abi/market.json";
import { sepolia } from "wagmi";
import Web3 from "web3";
import { toast } from "react-hot-toast";

export const Asset = ({ map }) => {
  const [price, setPrice] = useState(0);
  const web3 = new Web3(Web3.givenProvider);
  const [isListed, setIsListed] = useState(false);

  const listingCheck = async () => {
    const data = await readContract({
      address: marketContract,
      abi: marketABI,
      functionName: "isListed",
      args: [map.tokenId],
    });
    setIsListed(data);
  };

  useEffect(() => {
    listingCheck();
  }, []);

  const listingFunc = async (tokenId, price) => {
    if (price === 0) {
      return;
    }
    const isApproved = await readContract({
      address: nftContract,
      abi: nftABI,
      functionName: "getApproved",
      args: [tokenId],
    });
    if (isApproved.data !== marketContract) {
      const config = await prepareWriteContract({
        address: nftContract,
        abi: nftABI,
        functionName: "approve",
        args: [marketContract, tokenId],
        chainId: sepolia.id,
      });
      const { hash } = await writeContract(config);
      const data = await waitForTransaction({
        hash: hash,
      });
      if (data.isSuccess) {
        toast.success("NFT approve done ✅");
      }
    }
    const config = await prepareWriteContract({
      address: marketContract,
      abi: marketABI,
      functionName: "list",
      args: [tokenId, web3.utils.toBN(price).mul(web3.utils.toBN(1000000000000000000)).toString()],
      chainId: sepolia.id,
    });
    const { hash } = await writeContract(config);
    const listingDone = await waitForTransaction({
      hash,
    });
    if (listingDone) {
      toast.success("NFT listing Success ✅");
      listingCheck();
    }
  };

  const deListingFunc = async (tokenId) => {
    const listCount = await readContract({
      address: marketContract,
      abi: marketABI,
      functionName: "listCount",
    });
    const listedCount = Number(listCount.toString() || "0");
    let tokens = {};
    for (let i = 0; i < listedCount; i++) {
      const token = await readContract({
        address: marketContract,
        abi: marketABI,
        functionName: "listedItems",
        args: [i],
        chainId: sepolia.id,
      });
      tokens[web3.utils.toBN(token).toString()] = i;
    }
    const config = await prepareWriteContract({
      address: marketContract,
      abi: marketABI,
      functionName: "deList",
      args: [tokens[tokenId]],
      chainId: sepolia.id,
    });
    const { hash } = await writeContract(config);
    const listingDone = await waitForTransaction({
      hash,
    });
    if (listingDone) {
      toast.success("NFT de-listing Success ✅");
      listingCheck();
    }
  };

  return (
    <div key={map.tokenId} className="asset-unit">
      <div className="image-wrapper">
        <img alt={map.name} src={map.image}></img>
      </div>
      <div className="asset-name">{map.name}</div>
      <div className={`asset-listing ${isListed ? "delist-button" : "list-button"}`}>
        {isListed ? (
          <button
            onClick={() => {
              deListingFunc(map.tokenId);
            }}
          >
            Delist
          </button>
        ) : (
          <>
            <input onChange={(e) => setPrice(e.target.value)} value={price}></input>
            <button
              disabled={price === 0}
              onClick={() => {
                listingFunc(map.tokenId, price);
              }}
            >
              Listing
            </button>
          </>
        )}
      </div>
    </div>
  );
};
