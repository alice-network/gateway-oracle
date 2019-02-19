import Web3 from "web3";

class Web3Factory {
    static newInstance(providerUrl, privateKey) {
        if (!providerUrl.startsWith("ws")) {
            throw new Error("providerUrl must be ws: or wss:");
        }
        if (!privateKey.startsWith("0x")) {
            privateKey = "0x" + privateKey;
        }
        const web3 = new Web3(providerUrl);
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;
        return web3;
    }
}

export default Web3Factory;
