import { useState } from "react";
import styled from "styled-components";
import { Buynow } from "./Buynow";
import { Profile } from "./Profile";
import { Create } from "./Create";
import { Tokens } from "./Tokens";
import { useAccount } from "wagmi";

export const Pages = () => {
  const account = useAccount();
  const [selectedTab, setSelectedTab] = useState("Buy now");
  const selectTabHandler = (e) => {
    setSelectedTab(e.target.textContent);
  };
  const dylan = "0xb52b67c6A07719635EBE62290B75A45A5E94800e";
  return (
    <PagesStyle>
      <div className="left-section">
        <p onClick={selectTabHandler} className={`${selectedTab === "Buy now" ? "active" : "disable"}`}>
          Buy now
        </p>
        <p onClick={selectTabHandler} className={`${selectedTab === "Profile" ? "active" : "disable"}`}>
          Profile
        </p>
        <p
          onClick={(e) => {
            if (account.address === dylan) {
              selectTabHandler(e);
            }
          }}
          className={`${selectedTab === "Create" ? "active" : "disable"} ${account.address === dylan ? "dylan" : "not-dylan"}`}
        >
          Create
        </p>
        <p onClick={selectTabHandler} className={`${selectedTab === "Tokens" ? "active" : "disable"}`}>
          Tokens
        </p>
        {/* <p className="space"></p> */}
      </div>
      <div className="right-section">{selectedTab === "Buy now" ? <Buynow /> : selectedTab === "Profile" ? <Profile /> : selectedTab === "Create" ? <Create /> : selectedTab === "Tokens" ? <Tokens /> : ""}</div>
    </PagesStyle>
  );
};

const PagesStyle = styled.div`
  display: flex;
  flex: 1 0 0;
  height: 100%;
  width: 100%;
  border-top: 1px solid white;
  .left-section {
    /* width: 5rem; */
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    border-right: 1px solid white;
    padding-top: 1rem;
    p {
      font-family: "Sedgwick Ave Display", cursive;
      /* border-right: 1px solid white; */
      font-size: 2rem;
      /* margin: 0 0 1rem 2rem; */
      height: 5rem;
      width: 12rem;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
      /* &:nth-child(1) {
        padding-top: 2rem;
      } */
      &:hover {
        /* color: var(--color-sepolia); */
        transform: scale(1.1);
      }
      &.active {
        color: var(--color-sepolia);
      }
      &.not-dylan {
        cursor: default;
        color: gray !important;
        transform: none !important;
      }
    }
    .space {
      flex: 1 0 0;
    }
  }
  .right-section {
    flex: 1 0 0;
  }
`;
