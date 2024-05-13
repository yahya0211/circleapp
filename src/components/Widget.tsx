import { Box } from "@chakra-ui/react";
import { Fragment } from "react";
import Watermark from "./Watermark";
import Profile from "./Profile";
import Suggested from "./Suggested";

export default function Widget() {
  return (
    <Fragment>
      <Box w={{ base: "30%", "2xl": "30%" }} px={5} py={5} style={{ borderLeft: "3px solid #3a3a3a" }} overflow={"auto"} className="hide-scroll" display={{ base: "block", xl: "block" }}>
        <Profile />
        <Suggested />
        <Watermark />
      </Box>
    </Fragment>
  );
}
