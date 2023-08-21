import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.19",

    networks: {
        bsctestnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            chainId: 97,
            accounts: ["PRIVATE_KEY_HERE"],
        },
    },
};

export default config;
