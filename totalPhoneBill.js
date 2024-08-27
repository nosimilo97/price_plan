
export default function totalPhoneBill(pricePlan, actions) {
    let total = 0;

    actions.forEach(action => {
        if (action === 'call') {
            total += pricePlan.callCost;
        } else if (action === 'sms') {
            total += pricePlan.smsCost;
        }
    });

    return total;
}