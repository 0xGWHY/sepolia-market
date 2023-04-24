import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { sepolia } from "wagmi/chains";
import abi from "../abi/nft.json";
import { toast } from "react-hot-toast";
import { nftContract } from "../const/contract.js";
// import useMint from "../hooks/useMint.js";
import { create } from "ipfs-http-client";
import { useState, useRef } from "react";
import { Buffer } from "buffer";
import styled from "styled-components";
import useBalance from "../hooks/useBalance.js";

export default function StepTwo() {
  Buffer.from("anything", "base64");
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [uri, setUri] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageRender, setImageRender] = useState(null);
  const nftBalance = useBalance();
  const ref = useRef(null);
  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: "Basic " + Buffer.from(`${process.env.REACT_APP_INFURA_ID}:${process.env.REACT_APP_INFURA_SECRET}`).toString("base64"),
    },
  });

  function onError(e) {
    toast.error(e.message);
  }

  const { config, error } = usePrepareContractWrite({
    address: nftContract,
    abi,
    functionName: "safeMint",
    args: [address, uri],
  });

  const { data, write, isLoading } = useContractWrite({
    ...config,
    onError,
    onSuccess: () => {
      toast.success("Tx Sended");
      setUri("");
      setName("");
      setImage(null);
      setImageRender(null);
      ref.current.value = "";
    },
  });

  const {
    isLoading: txLoading,
    isSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: data?.hash,
    onError,
    onSuccess: () => toast.success("민팅 성공 🥳"),
  });

  const handleChange = async () => {
    setUploadLoading(true);
    const uploadImage = await ipfs.add(image);
    // const imageUri = "ipfs://" + uploadImage.path;
    const json = JSON.stringify({
      description: "찍어내 막 찍어내",
      external_url: "https://twitter.com/__metaGH__",
      image: `https://ipfs.io/ipfs/${uploadImage.path}`,
      name: name,
    });
    const uploadMetaData = await ipfs.add(json);
    const metaDataUri = "ipfs://" + uploadMetaData.path;
    setUri(metaDataUri);
    setUploadLoading(false);
    return metaDataUri;
  };

  return (
    <StepTwoStyle>
      <div className="relative mt-10 overflow-visible">
        {/* <div className=" text-lg font-bold mb-2">Step 2. Mint</div> */}
        {!address && <div className="text-red-500 mb-2">Connect wallet first</div>}
        {address && chain?.id !== sepolia.id && <div className="text-red-500 mb-2">Switch to Sepolia network</div>}
        <input
          type="file"
          accept=".gif, .jpg, .png"
          ref={ref}
          onChange={(e) => {
            if (uri) {
              setUri("");
            }
            if (e.target.files[0]) {
              const imgSrc = new FileReader();
              imgSrc.readAsDataURL(e.target.files[0]);
              imgSrc.onloadend = () => {
                setImageRender(imgSrc.result);
              };

              setImage(e.target.files[0]);
            } else {
              setImageRender(null);
            }
          }}
        ></input>
        <div>
          <input
            onChange={(e) => {
              if (uri) {
                setUri("");
              }
              setName(e.target.value);
            }}
            type="text"
            placeholder="토큰 이름"
            value={name}
          ></input>
        </div>
        {uri ? (
          <button
            onClick={() => {
              if (chain?.id !== sepolia.id) {
                switchNetwork(sepolia.id);
                return;
              }

              write?.();
            }}
            disabled={chain?.id !== sepolia.id || !address || isLoading || txLoading}
          >
            {isLoading ? "Minting" : "Mint"}
          </button>
        ) : (
          <button className="upload" onClick={handleChange} disabled={uploadLoading || name.length === 0 || imageRender === null}>
            MetaData 업로드하기
          </button>
        )}
        {imageRender ? <img className="selected-image" alt="현재 선택된 이미지" src={imageRender}></img> : <div className="selected-image"></div>}
        {/* <button
        onClick={() => {
          toast.success("test");
        }}
      ></button> */}
        <div className="balance">Total count: {nftBalance.data?.toString()}</div>
      </div>
    </StepTwoStyle>
  );
}

const StepTwoStyle = styled.div`
  position: relative;
  /* height: 100%; */
  display: flex;
  padding: 2.5rem;
  flex-direction: column;
  /* justify-content: center;
  align-items: center; */

  input[type="file"]::file-selector-button {
    background-color: white;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 0.75rem;

    margin: 1rem;
    padding: 0.3rem 1rem 0.3rem 1rem;
    cursor: pointer;
    font-size: 1rem !important;
  }
  input[type="file"]::file-selector-button:hover {
    transform: scale(1.03);
    transition: 0.125s ease;
  }
  input[type="file"] {
    font-size: 0.8rem;
    width: 250px;
    font-weight: 700;
  }

  input[type="text"] {
    outline: none;
    background-color: white;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 0.75rem;
    margin: 0rem 1rem 1rem 1rem;
    padding: 0.3rem 1rem 0.3rem 1rem;
    width: 200px;
    font-weight: 700;
  }

  .upload {
    background-color: white;
    color: black;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 200px;
  }
  .upload:hover {
    color: #2176fd;
  }

  .selected-image {
    width: 10rem;
    height: auto;
    position: absolute;
    top: 4rem;
    left: 18rem;
    /* right: -11rem; */
    background-color: white;
    border-radius: 15px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }

  .selected-image {
    width: 10rem;
    height: 10rem;
  }
  .balance {
    margin: 1rem 0 0 1rem;
    font-size: 2rem;
    font-weight: bold;
  }
  button {
    background-color: white;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 0.75rem;

    margin: 1rem;
    padding: 0.3rem 1rem 0.3rem 1rem;
    cursor: pointer;
    font-size: 1rem !important;
    color: black;
  }
`;
