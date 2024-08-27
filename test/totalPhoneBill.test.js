import assert from "assert";
import totalPhoneBill from "../totalPhoneBill.js";

describe('Total Phone Bill Calculation', () => {

    it('should calculate the total for Plan A with 2 calls and 3 SMS', () => {
        const pricePlanA = { callCost: 2.75, smsCost: 0.65 };
        const actions = ['call', 'sms', 'call', 'sms', 'sms'];
        const total = totalPhoneBill(pricePlanA, actions);
        const expectedTotal = 7.45;

        const epsilon = 0.0001; // small tolerance value
        assert(Math.abs(total - expectedTotal) < epsilon, `Expected ${total} to be close to ${expectedTotal}`);
    });

    it('should calculate the total for Plan B with 1 call and 1 SMS', () => {
        const pricePlanB = { callCost: 3.00, smsCost: 0.50 };
        const actions = ['call', 'sms'];
        const total = totalPhoneBill(pricePlanB, actions);

        assert.strictEqual(total, 3.50); // 3.00 + 0.50 = 3.50
    });

    it('should return 0 for no actions', () => {
        const pricePlanA = { callCost: 2.75, smsCost: 0.65 };
        const actions = [];
        const total = totalPhoneBill(pricePlanA, actions);

        assert.strictEqual(total, 0);
    });

});
