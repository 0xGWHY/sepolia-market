import styled from "styled-components";
import { tokenContract } from "../const/contract";
import { useContractRead, useWaitForTransaction, useAccount, sepolia, mainnet } from "wagmi";
import { readContract, prepareWriteContract, writeContract, waitForTransaction } from "wagmi/actions";
import nftABI from "../abi/nft.json";
import marketABI from "../abi/market.json";
import { nftContract } from "../const/contract";
import { useEffect, useState } from "react";
import axios from "axios";
import { ipfsAddress, marketContract } from "../const/contract";
import { Asset } from "./Asset";
import Web3 from "web3";
import Contract from "web3-eth-contract";
import { toast } from "react-hot-toast";

export const Profile = () => {
  const [tokenIds, setTokenIds] = useState([]);
  const [tokenInfos, setTokenInfos] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const web3 = new Web3(Web3.givenProvider);
  const contract = new Contract(marketABI, marketContract);

  const account = useAccount();

  const getTokenId = async () => {
    let temp = [];
    let temp2 = [];
    let temp3 = [];
    const holding = await readContract({
      address: nftContract,
      abi: nftABI,
      functionName: "balanceOf",
      args: [account.address],
    });
    const holdingCount = Number(holding.toString() || "0");

    for (let i = 0; i < holdingCount; i++) {
      const tokenId = await readContract({
        address: nftContract,
        abi: nftABI,
        functionName: "tokenOfOwnerByIndex",
        args: [account.address, i],
      });
      temp.push(Number(tokenId.toString()));
      const tokenInfo = await readContract({
        address: nftContract,
        abi: nftABI,
        functionName: "tokenURI",
        args: [tokenId],
      });
      temp2.push({ tokenId: Number(tokenId.toString()), info: tokenInfo });
      // axios.get(`${ipfsAddress}${tokenInfo.slice(7)}`).then((res) => {
      //   // console.log(res.data);
      //   console.log(`순서-${i}`);
      //   temp3.push({ ...res.data, tokenId: Number(tokenId.toString()) });
      // });
      const res = await axios.get(`${ipfsAddress}${tokenInfo.slice(7)}`);
      temp3.push({ ...res.data, tokenId: Number(tokenId.toString()) });
    }
    setTokenIds(temp);
    setTokenInfos(temp2);
    setMetaData(temp3);
  };

  useEffect(() => {
    getTokenId();
  }, []);

  return (
    <ListingStyle>
      <div className="asset-wrapper">{metaData?.length > 0 ? metaData.map((map) => <Asset key={map.tokenId} map={map} />) : ""}</div>
    </ListingStyle>
  );
};

const ListingStyle = styled.div`
  height: 100%;
  position: relative;
  padding: 1rem;
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
      height: 3rem;
      font-size: 1rem;
      font-weight: bold;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-left: 1rem;
    }
    .asset-listing {
      display: flex;
      align-items: center;
      margin: 0 1rem 1rem 1rem;
      transition: color 0.3s;
      &.delist-button {
        justify-content: flex-end;
        button {
          color: red;
        }
      }
      &.list-button {
        justify-content: space-between;
      }
      input {
        width: 2rem;
        flex: 1 0 0;
        border-radius: 5px;
        outline: none;
        background-color: #5e5d60;
        color: white;
        border: none;
        padding: 0.3rem 0.5rem 0.3rem 0.5rem;
      }
      button {
        background-color: transparent;
        border: none;
        /* font-family: "Sedgwick Ave Display", cursive; */
        font-size: 1.2rem;
        font-weight: bold;
        color: white;
        transition: color 0.3s;
        margin-left: 1rem;
        cursor: pointer;
        &:active {
          color: var(--color-sepolia);
        }
        &:disabled,
        &[disabled] {
          color: gray !important;
          cursor: default;
        }
      }
    }
    img {
      width: 100%;
      height: auto;
    }
  }
`;
