document.addEventListener('alpine:init', () => {
    Alpine.data('phoneBillApp', () => ({
        pricePlans: [],
        selectedPlan: '',
        actions: '',
        total: null,
        displayForm: false,
        newPlan: { id: null, name: '', call_cost: '', sms_cost: '' },
        isEditing: false,

        async fetchPricePlans() {
const response = await fetch('/api/price_plans/');
this.pricePlans = await response.json();
console.log(this.pricePlans); 
},

        async calculateTotal() {
            const response = await fetch('/api/phonebill/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    price_plan: this.selectedPlan,
                    actions: this.actions
                })
            });

            const data = await response.json();
            this.total = data.total;
        },

        async createPlan() {
            const response = await fetch('/api/price_plan/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.newPlan)
            });


            if (response.ok) {
                this.fetchPricePlans();
                // this.pricePlans.push({ ...this.newPlan});
                // this.newPlan = { id: null, name: '', call_cost: '', sms_cost: '' };
                this.resetForm();
                this.closeModal();
            }
        },

        async updatePlan() {
if (!this.newPlan.id) {
console.error('Plan ID is missing. Cannot update.');
return;
}
const response = await fetch('/api/price_plan/update', { // Fixed URL syntax
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify(this.newPlan)
});

if (response.ok) {
await this.fetchPricePlans(); // Refresh the list of plans
this.resetForm();
this.closeModal();
} else {
console.error('Failed to update the plan');
}
},


        async deletePlan(id) {
            const response = await fetch('/api/price_plan/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                this.fetchPricePlans();
                alert("Deleted successfully!");
            }
        },

        editPlan(plan) {
this.isEditing = true;
// Ensure the ID is populated correctly
this.newPlan = {
id: plan.id,
name: plan.plan_name,
call_cost: plan.call_price,
sms_cost: plan.sms_price
};
const modalElement = document.getElementById('createPlanModal');
const createPlanModal = new bootstrap.Modal(modalElement);
createPlanModal.show();
},

closeModal() {
const modalElement = document.getElementById('createPlanModal');
const createPlanModal = bootstrap.Modal.getInstance(modalElement);
if (createPlanModal) {
createPlanModal.hide();
}
},

openCreatePlanModal() {
this.resetForm(); // Reset the form state
this.isEditing = false; // Set editing to false for creating a new plan
const modalElement = document.getElementById('createPlanModal');
const createPlanModal = new bootstrap.Modal(modalElement);
createPlanModal.show();
},

resetForm() {
    this.newPlan = { id: null, name: '', call_cost: '', sms_cost: '' };
}

    }));
});