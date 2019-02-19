class Signer {
    constructor(web3) {
        this.web3 = web3;
    }

    sign = (data, privateKey) => {
        if (!privateKey.startsWith("0x")) {
            privateKey = "0x" + privateKey;
        }
        const message = this.web3.utils.soliditySha3(...data);
        return this.web3.eth.accounts.sign(message, privateKey).signature;
    };

    recover = (message, signature, preFixed) => this.web3.eth.accounts.recover(message, signature, preFixed);
}

export default Signer;
