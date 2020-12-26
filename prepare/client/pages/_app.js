import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import "../styles/globals.css";
import wrapper from "../store/configureStore";

const App = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default wrapper.withRedux(App);
