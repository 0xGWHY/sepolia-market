import { ConnectButton } from "@rainbow-me/rainbowkit";
import styled from "styled-components";
import "@rainbow-me/rainbowkit/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useAccount } from "wagmi";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const account = useAccount();

  return (
    <HeaderStyle>
      <div className="logo">
        <p>Sepolia Market</p>
      </div>
      <div className="menu-section">
        <ConnectButton accountStatus="address" />
      </div>
    </HeaderStyle>
  );
};

const HeaderStyle = styled.div`
  /* background-color: yellow; */
  margin: 0 2rem 0 2rem;
  height: 10rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    color: white;
    /* font-weight: bold; */
    /* font-size: 5rem; */
    p {
      font-family: "Sedgwick Ave Display", cursive;
      font-size: 4rem;
      color: white;
    }
  }
  .menu-section {
    display: flex;
    div {
      button {
        background-color: transparent;
        border: none;
        font-family: "Sedgwick Ave Display", cursive;
        font-size: 2.5rem;
        color: white;
        div {
          font-family: "Sedgwick Ave Display", cursive;
          color: white;
          border: none;
        }
      }
    }
  }
`;
