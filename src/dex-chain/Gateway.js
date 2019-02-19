import Logger from "utils/Logger";
import abi from "@alice-network/gateway-dex-chain/abis/Gateway";

const defaultOnError = () => {};

class Gateway {
    constructor(web3, networkName, options = {}) {
        this.web3 = web3;
        const { proxies } = require(`@alice-network/gateway-dex-chain/zos.${networkName}`);
        const { address } = proxies["gateway-dex-chain/Gateway"][0];
        this.gateway = new web3.eth.Contract(abi, address, {
            from: web3.eth.defaultAccount,
            ...options
        });
    }

    subscribeForWithdrawalSubmittedEvent = (onEvent, onError = defaultOnError) => {
        return this.gateway.events
            .WithdrawalSubmitted()
            .on("data", event => {
                Logger.log("dex-chain:event", "Gateway.WithdrawalSubmitted", event.returnValues);
                onEvent(event);
            })
            .on("error", error => {
                Logger.error("dex-chain:event", "Gateway.WithdrawalSubmitted", error);
                onError(error);
            });
    };

    signPendingWithdrawal = async (withdrawalNonce, signature, onError = defaultOnError) => {
        Logger.log("dex-chain:method", "Gateway.signPendingWithdrawal", { withdrawalNonce, signature });
        try {
            const receipt = await this.gateway.methods.signPendingWithdrawal(withdrawalNonce, signature).send();
            Logger.log("dex-chain:event", "Gateway.WithdrawalSigned", receipt.events.WithdrawalSigned.returnValues);
        } catch (error) {
            Logger.error("dex-chain:method", "Gateway.signPendingWithdrawal()", error);
            onError(error);
        }
    };

    depositETH = async (depositId, owner, amount, onError = defaultOnError) => {
        Logger.log("dex-chain:method", "Gateway.depositETH", { depositId, owner, amount });
        try {
            const receipt = await this.gateway.methods.depositETH(depositId, owner, amount).send();
            Logger.log("dex-chain:event", "Gateway.ETHDeposited", receipt.events.ETHDeposited.returnValues);
        } catch (error) {
            Logger.error("dex-chain:method", "Gateway.depositETH()", error);
            onError(error);
        }
    };

    depositERC20 = async (depositId, owner, token, amount, onError = defaultOnError) => {
        Logger.log("dex-chain:method", "Gateway.depositERC20", { depositId, owner, token, amount });
        try {
            const receipt = await this.gateway.methods.depositERC20(depositId, owner, token, amount).send();
            Logger.log("dex-chain:event", "Gateway.ERC20Deposited", receipt.events.ERC20Deposited.returnValues);
        } catch (error) {
            Logger.error("dex-chain:method", "Gateway.depositERC20()", error);
            onError(error);
        }
    };

    depositERC721 = async (depositId, owner, token, tokenId, onError = defaultOnError) => {
        Logger.log("dex-chain:method", "Gateway.depositERC721", { depositId, owner, token, tokenId });
        try {
            const receipt = await this.gateway.methods.depositERC721(depositId, owner, token, tokenId).send();
            Logger.log("dex-chain:event", "Gateway.ERC721Deposited", receipt.events.ERC721Deposited.returnValues);
        } catch (error) {
            Logger.error("dex-chain:method", "Gateway.depositERC721()", error);
            onError(error);
        }
    };
}

export default Gateway;
