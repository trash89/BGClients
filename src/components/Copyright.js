import Wrapper from "../assets/wrappers/Copyright";

export default function Copyright() {
  return (
    <Wrapper>
      <footer className="footer">
        {"© "} {new Date().getFullYear()}
        {" by "}
        <a href="https://github.com/trash89/" target="_blank">
          trash89
        </a>
        {". All rights reserved. Built with "}{" "}
        <a href="https://reactjs.org/" target="_blank">
          React
        </a>
      </footer>
    </Wrapper>
  );
}
