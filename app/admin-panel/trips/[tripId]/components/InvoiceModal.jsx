'use client'
import { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { ServerUrl } from "@/app/config";
import auth from "@/utils/auth";
const defaultForm = {
    invoiceDate: new Date().toISOString().slice(0, 10),
    paymentMethod: "",
    transactionId: "",
    gstin: "",
    gst: 5,
    cgst: 5,
    notes: "",
    tripName: "",
    packageSelected: "",
    customerAddress: ""
};

// customerId,
//                 invoiceDate,
//                 paymentMethod,
//                 transactionId,
//                 gstin,
//                 notes,
//                 tripName,
//                 packageSelected,
//                 customerAddress

// customer: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Customer",
//             required: true,
//         },
//         invoiceNumber: {
//             type: String,
//             required: true,
//             unique: true,
//         },
//         invoiceDate: {
//             type: Date,
//             required: true,
//         },
//         agreedPrice: {
//             type: Number,
//             required: true,
//         },
//         tripName: {
//             type: String,
//             required: true,
//         },
//         packageSelected: {
//             type: String,
//             required: true,
//         },
//         customerAddress: {
//             type: String,
//             required: true,
//         },
//         cgst: {
//             type: Number,
//             required: true,
//         },
//         sgst: {
//             type: Number,
//             required: true,
//         },
//         total: {
//             type: Number,
//             required: true,
//         },
//         paymentMethod: {
//             type: String,
//         },
//         transactionId: {
//             type: String,
//         },
//         gstin: {
//             type: String,
//         },
//         notes: {
//             type: String,
//         },

//         createdBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User", // assuming you have a user model
//         },

export default function InvoiceModal({ customer, onClose }) {
    // console.log("Customer in InvoiceModal:", customer);
    const [form, setForm] = useState({
        ...defaultForm,
        tripName: "",

    });
    const [submitting, setSubmitting] = useState(false);
    const token = auth.getToken();
    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data } = await axios.post(
                `${ServerUrl}/customer/invoices/generate`,
                {
                    customerId: customer._id,
                    ...form,

                    invoiceDate: form.invoiceDate,
                    paymentMethod: form.paymentMethod,
                    transactionId: form.transactionId,
                    gstin: form.gstin,
                    gst: form.gst,
                    cgst: form.cgst,
                    notes: form.notes,
                    tripName: form.tripName,
                    packageSelected: form.packageSelected,
                    customerAddress: form.customerAddress
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob"
                }
            );
            saveAs(new Blob([data]), `invoice-${customer.name}-${customer._id}.pdf`);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to generate invoice");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl w-full max-w-lg p-2 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Generate invoice for {customer.name}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Invoice date */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Invoice Date</span>
                        <input
                            type="date"
                            name="invoiceDate"
                            value={form.invoiceDate}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Trip Name</span>
                        <input
                            type="text"
                            name="tripName"
                            value={form.tripName}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </label>

                    {/* Package Selected */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Package</span>
                        <input
                            type="text"
                            name="packageSelected"
                            value={form.packageSelected}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </label>

                    {/* Customer Address */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Customer Address</span>
                        <textarea
                            name="customerAddress"
                            rows="2"
                            value={form.customerAddress}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </label>


                    {/* Payment method */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Payment Method</span>
                        <input
                            type="text"
                            name="paymentMethod"
                            placeholder="e.g. UPI / NEFT"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>

                    {/* Transaction id */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Transaction ID</span>
                        <input
                            type="text"
                            name="transactionId"
                            value={form.transactionId}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>

                    {/* GSTIN – optional */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Customer GSTIN (optional)</span>
                        <input
                            type="text"
                            name="gstin"
                            value={form.gstin}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>
                    {/* gst */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">GST (Percentage)</span>
                        <input
                            type="number"
                            name="gst"
                            value={form.gst}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>
                    {/* cgst */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">CGST (Percentage)</span>
                        <input
                            type="number"
                            name="cgst"
                            value={form.cgst}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>

                    {/* Notes */}
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Additional Notes</span>
                        <textarea
                            name="notes"
                            rows="3"
                            value={form.notes}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? "Generating…" : "Download PDF"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
