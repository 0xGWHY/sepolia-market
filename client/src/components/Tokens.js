import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { prepareWriteContract, writeContract, waitForTransaction, readContract } from "wagmi/actions";
import { tokenContract } from "../const/contract";
import tokenABI from "../abi/token.json";
import Web3 from "web3";
import { toast } from "react-hot-toast";

export const Tokens = () => {
  const account = useAccount();
  const [balance, setBalance] = useState(0);
  const web3 = new Web3(Web3.givenProvider);

  const getBalance = async () => {
    const mungBalance = await readContract({
      address: tokenContract,
      abi: tokenABI,
      functionName: "balanceOf",
      args: [account.address],
    });
    setBalance(web3.utils.fromWei(mungBalance.toString(), "ether"));
  };

  const tokenMint = async () => {
    const config = await prepareWriteContract({
      address: tokenContract,
      abi: tokenABI,
      functionName: "mint",
      args: [account.address, "100000000000000000000"],
    });
    const { hash } = await writeContract(config);
    const result = await waitForTransaction({
      hash,
    });
    if (result) {
      toast.success("Mung token claim done 🥳");
      getBalance();
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <TokensStyle>
      <div className="section">
        <p className="title">Claim Mung Token</p>
        <button onClick={tokenMint}>Claim</button>
      </div>
      <div className="section">
        <p className="title">Your Balance</p>
        <p className="balance">{`${balance} Mung`}</p>
      </div>
    </TokensStyle>
  );
};

const TokensStyle = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
  .section {
    margin-bottom: 2rem;
  }
  .title {
    font-family: "Sedgwick Ave Display", cursive;
    font-size: 2rem;
  }
  .balance {
    margin-top: 1rem;
    font-size: 2rem;
  }
  button {
    background-color: black;
    /* box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); */
    border: 2px solid var(--color-sepolia);
    color: var(--color-sepolia);
    border-radius: 0.75rem;
    font-family: "Sedgwick Ave Display", cursive;
    margin: 1rem;
    padding: 0.3rem 1rem 0.3rem 1rem;
    cursor: pointer;
    font-size: 1.5rem !important;
  }
`;
