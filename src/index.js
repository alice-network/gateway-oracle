import "@babel/polyfill";
import EthereumGateway from "ethereum/Gateway";
import EthereumWeb3Factory from "ethereum/utils/Web3Factory";
import DexChainGateway from "dex-chain/Gateway";
import DexChainWeb3Factory from "dex-chain/utils/Web3Factory";
import Signer from "utils/Signer";

require("dotenv").config();

const ethereum = {
    web3: EthereumWeb3Factory.newInstance(process.env.ETHEREUM_PROVIDER_URL, process.env.ETHEREUM_PRIVATE_KEY),
    get gateway() {
        return new EthereumGateway(this.web3, process.env.ETHEREUM_NETWORK_NAME);
    },
    get signer() {
        return new Signer(this.web3);
    }
};
const dexChain = {
    web3: DexChainWeb3Factory.newInstance(
        process.env.DEX_CHAIN_CHAIN_ID,
        process.env.DEX_CHAIN_WRITE_URL,
        process.env.DEX_CHAIN_READ_URL,
        process.env.DEX_CHAIN_PRIVATE_KEY
    ),
    get gateway() {
        return new DexChainGateway(this.web3, process.env.DEX_CHAIN_NETWORK_NAME);
    }
};

ethereum.gateway.subscribeForETHDepositedEvent(event => {
    const { depositId, owner, amount } = event.returnValues;
    dexChain.gateway.depositETH(depositId, owner, amount, () => {
        ethereum.gateway.cancelFailedDeposit(depositId);
    });
});
ethereum.gateway.subscribeForERC20DepositedEvent(event => {
    const { depositId, owner, token, amount } = event.returnValues;
    dexChain.gateway.depositERC20(depositId, owner, token, amount, () =>
        ethereum.gateway.cancelFailedDeposit(depositId)
    );
});
ethereum.gateway.subscribeForERC721DepositedEvent(event => {
    const { depositId, owner, token, tokenId } = event.returnValues;
    dexChain.gateway.depositERC721(depositId, owner, token, tokenId, () =>
        ethereum.gateway.cancelFailedDeposit(depositId)
    );
});
dexChain.gateway.subscribeForWithdrawalSubmittedEvent(event => {
    const { withdrawalNonce, foreignTokenAddress, foreignAccountAddress, value } = event.returnValues;
    const signature = ethereum.signer.sign(
        [
            { t: "uint256", v: withdrawalNonce },
            { t: "address", v: foreignTokenAddress },
            { t: "address", v: foreignAccountAddress },
            { t: "uint256", v: value }
        ],
        process.env.ETHEREUM_PRIVATE_KEY
    );
    dexChain.gateway.signPendingWithdrawal(withdrawalNonce, signature);
});
