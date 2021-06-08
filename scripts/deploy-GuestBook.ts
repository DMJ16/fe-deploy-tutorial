import { providers, Wallet, utils, ContractFactory } from "ethers";
import * as fs from "fs";
import abi from "../output/GuestBook/GuestBook_abi.json";
require("dotenv").config();

const network = "goerli";
const provider = new providers.JsonRpcProvider(
  `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`,
  network
);
const wallet = new Wallet(process.env.DEV_PRIVATE_KEY as string, provider);
const bytecode = fs
  .readFileSync("output/GuestBook/GuestBook.bin")
  .toString("hex");
const constructorParams: any[] = [];
const overrides = {
  gasPrice: utils.parseEther("0.000000138").toHexString(),
  gasLimit: "0x895440", // 9000000
};

async function deploy(): Promise<void> {
  try {
    const factory = new ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy(...constructorParams, overrides);
    await contract.deployed();
    console.log("Contract deployed at:", contract.address);
  } catch (err) {
    console.error(err);
  }
}

deploy()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
