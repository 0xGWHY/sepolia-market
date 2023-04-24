import logo from "./logo.svg";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { Header } from "./components/Header";
import { Pages } from "./components/Pages";

function App() {
  return (
    <>
      <div className="App">
        <Header />
        <Pages />
      </div>
      <Toaster
        containerStyle={{
          top: 100,
        }}
      />
    </>
  );
}

export default App;
