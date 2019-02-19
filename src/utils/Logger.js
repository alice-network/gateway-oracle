const toString = o => (o ? o.toString() : "null");

const Logger = {
    log: (type, name, args = {}, message = "") => {
        console.log(
            `[${type}]\t${name}(` +
                Object.keys(args)
                    .filter(key => isNaN(key))
                    .map(key => `${key}:${toString(args[key])}`)
                    .join(", ") +
                ") " +
                message
        );
    },
    error: (type, name, message) => {
        console.warn(`[${type}]\t${name} ${toString(message)}`);
    }
};
export default Logger;
