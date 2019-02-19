import Web3 from "web3";
import LoomTruffleProvider from "loom-truffle-provider";

class Web3Factory {
    static newInstance(chainId, writeUrl, readUrl, privateKey) {
        if (!writeUrl.startsWith("ws")) {
            throw new Error("writeUrl must be ws: or wss:");
        }
        if (!readUrl.startsWith("ws")) {
            throw new Error("readUrl must be ws: or wss:");
        }
        const provider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey).getProviderEngine();
        const web3 = new Web3(provider);
        const account = [...provider.accounts.keys()][0];
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account;
        return web3;
    }
}

export default Web3Factory;
