import styled from "styled-components";
import { useContractRead } from "wagmi";
import { readContract, prepareWriteContract, writeContract } from "wagmi/actions";
import marketABI from "../abi/market.json";
import nftABI from "../abi/nft.json";
import { marketContract, nftContract } from "../const/contract";
import { sepolia } from "wagmi";
import Web3 from "web3";
import { useEffect, useState } from "react";
import { ipfsAddress } from "../const/contract";
import axios from "axios";
import { Asset } from "assert";
import { ListingAssets } from "./ListingAssets";

const web3 = new Web3(Web3.givenProvider);

export const Buynow = () => {
  const [data, setData] = useState([]);
  const [txHash, setTxHash] = useState("");
  const listCount = useContractRead({
    address: marketContract,
    abi: marketABI,
    functionName: "listCount",
  });
  const listedCount = Number(listCount.data?.toString() || "0");

  const getListings = async () => {
    let tokens = [];
    let metaDatas = [];
    let dataTemp = [];

    const newListingCount = await readContract({
      address: marketContract,
      abi: marketABI,
      functionName: "listCount",
    });
    const count = Number(newListingCount.toString() || "0");

    for (let i = 0; i < count; i++) {
      const token = await readContract({
        address: marketContract,
        abi: marketABI,
        functionName: "listedItems",
        args: [i],
        chainId: sepolia.id,
      });
      tokens.push(web3.utils.toBN(token).toString());
      const metaData = await readContract({
        address: nftContract,
        abi: nftABI,
        functionName: "tokenURI",
        args: [token],
      });
      // console.log(web3.utils.toBN(token).toString());
      const price = await readContract({
        address: marketContract,
        abi: marketABI,
        functionName: "itemPrices",
        args: [token],
      });
      metaDatas.push(price);
      const res = await axios.get(`${ipfsAddress}${metaData.slice(7)}`);
      dataTemp.push({ ...res.data, tokenId: Number(web3.utils.toBN(token).toString()), price: price, listedIndex: i });
    }
    setData(dataTemp);
  };
  useEffect(() => {
    getListings(listedCount);
  }, []);

  return (
    <BuynowStyle>
      {listedCount === 0 ? (
        <p className="no-list">No NFTs listed</p>
      ) : (
        <div className="asset-wrapper">{data?.length > 0 ? data.map((map) => <ListingAssets getListings={getListings} key={map.tokenId} map={map} txHash={txHash} setTxHash={setTxHash} />) : ""}</div>
      )}
    </BuynowStyle>
  );
};

const BuynowStyle = styled.div`
  height: 100%;
  position: relative;
  padding: 1rem;
  .no-list {
    position: absolute;
    color: rgba(255, 255, 255, 0.3);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    font-family: "Sedgwick Ave Display", cursive;
    font-size: 5rem;
  }
  .asset-wrapper {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    row-gap: 1rem;
    column-gap: 1rem;
    width: 100%;
  }
  .asset-unit {
    width: 100%;
    /* border: 1.5px solid white; */
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid #f5f5f5;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    &:hover {
      border: 2px solid var(--color-sepolia);
    }
    .image-wrapper {
      /* padding: 1rem; */
      /* padding: 1rem; */
      flex: 1 0 0;
      /* overflow: hidden; */
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        /* height: 100%; */
        /* width: auto; */
        width: 100%;
        /* aspect-ratio: 1/1; */
      }
    }
    .asset-name {
      height: 2rem;
      font-size: 1.2rem;
      font-weight: bold;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-left: 0.5rem;
    }
    .price {
      height: 1.5rem;
      font-size: 1.2rem;
      font-weight: bold;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 0.5rem;
    }
    .asset-buy {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0.5rem 1rem 0.5rem 1rem;
      transition: color 0.3s;
      button {
        background-color: transparent;
        border: none;
        /* font-family: "Sedgwick Ave Display", cursive; */
        font-weight: bold;
        font-size: 1.2rem;
        color: white;
        transition: color 0.3s;
        cursor: pointer;
        &:hover {
          color: var(--color-sepolia);
        }
      }
    }
    img {
      width: 100%;
      height: auto;
    }
  }
`;
