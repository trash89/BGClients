import "normalize.css";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import Layout from "../components/layout";

function MyApp({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ||
    ((page) => {
      return (
        <Provider store={store}>
          <Layout>{page}</Layout>
        </Provider>
      );
    });
  return getLayout(
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
