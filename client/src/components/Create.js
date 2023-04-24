import styled from "styled-components";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

export const Create = () => {
  return (
    <CreateStyle>
      {/* <StepOne /> */}
      <StepTwo />
      {/* <StepThree /> */}
    </CreateStyle>
  );
};

const CreateStyle = styled.div`
  height: 100%;
  /* display: flex; */
  /* justify-content: center;
  align-items: center; */
  /* flex-direction: column; */
`;
