
class RequestFieldError extends Error {
    constructor(message) {
        super(message);
        this.name = "RequestFieldError";
    }
}

module.exports = RequestFieldError;