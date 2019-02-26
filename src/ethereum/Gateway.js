import Logger from "utils/Logger";
import abi from "@alice-network/gateway-ethereum/abis/Gateway";

const defaultOnError = () => {};

class Gateway {
    constructor(web3, networkName, options = {}) {
        this.web3 = web3;
        const { proxies } = require(`@alice-network/gateway-ethereum/zos.${networkName}`);
        const { address } = proxies["gateway-ethereum/Gateway"][0];
        this.address = address;
        this.gateway = new web3.eth.Contract(abi, address, {
            from: web3.eth.defaultAccount,
            ...options
        });
    }

    subscribeForETHDepositedEvent = (onEvent, onError = defaultOnError) => {
        return this.gateway.events
            .ETHDeposited()
            .on("data", event => {
                Logger.log("ethereum:event", "Gateway.ETHDeposited", event.returnValues);
                onEvent(event);
            })
            .on("error", error => {
                Logger.error("ethereum:event", "Gateway.ETHDeposited", error);
                onError(error);
            });
    };

    subscribeForERC20DepositedEvent = (onEvent, onError = defaultOnError) => {
        return this.gateway.events
            .ERC20Deposited()
            .on("data", event => {
                Logger.log("ethereum:event", "Gateway.ERC20Deposited", event.returnValues);
                onEvent(event);
            })
            .on("error", error => {
                Logger.error("ethereum:event", "Gateway.ERC20Deposited", error);
                onError(error);
            });
    };

    subscribeForERC721DepositedEvent = (onEvent, onError = defaultOnError) => {
        return this.gateway.events
            .ERC721Deposited()
            .on("data", event => {
                Logger.log("ethereum:event", "Gateway.ERC721Deposited", event.returnValues);
                onEvent(event);
            })
            .on("error", error => {
                Logger.error("ethereum:event", "Gateway.ERC721Deposited", error);
                onError(error);
            });
    };

    cancelFailedDeposit = async (depositId, onError = defaultOnError) => {
        Logger.log("ethereum.method", "Gateway.cancelFailedDeposit", { depositId });
        try {
            const method = this.gateway.methods.cancelFailedDeposit(depositId);
            const gas = await method.estimateGas({ from: this.web3.eth.defaultAccount });
            const receipt = await method.send({ gas });
            if (receipt.events.ETHDepositCancelled) {
                Logger.log(
                    "ethereum:event",
                    "Gateway.ETHDepositedCancelled",
                    receipt.events.ETHDepositCancelled.returnValues
                );
            } else if (receipt.events.ERC20DepositCancelled) {
                Logger.log(
                    "ethereum:event",
                    "Gateway.ERC20DepositCancelled",
                    receipt.events.ERC20DepositCancelled.returnValues
                );
            } else if (receipt.events.ERC721DepositCancelled) {
                Logger.log(
                    "ethereum:event",
                    "Gateway.ERC721DepositCancelled",
                    receipt.events.ERC721DepositCancelled.returnValues
                );
            }
        } catch (error) {
            Logger.error("ethereum.method", "Gateway.cancelFailedDeposit", error);
            onError(error);
        }
    };
}

export default Gateway;
