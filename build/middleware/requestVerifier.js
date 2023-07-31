export function verifyRequest(requirements, origin, req, res) {
    let requestApproved = true;
    for (let test = 0; test < requirements.length; ++test) {
        console.log("______________________________________________________");
        console.log("Result returned as: ");
        console.log(requirements[test].check);
        console.log("for the following condition: ");
        console.log(requirements[test].condition);
        console.log("actual value is: ");
        console.log(requirements[test].value);
        if (requirements[test].check) {
            res.status(400);
            requestApproved = false;
            throw new Error(`
                Error at ${origin} request.
                The condition ${requirements[test].condition} returned true - it should be false.
                The value this variable currently holds is: ${requirements[test].value}
            `);
        }
    }
    if (requestApproved) {
        console.log(`Request at ${origin} has been approved. Code now resuming execution....`);
    }
}
