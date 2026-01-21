"use client";

import { useState } from "react";
import { getPlayerGearRequests } from "@/lib/mockData";

interface LockerViewProps {
  playerId: string;
}

const gearItems = [
  { name: "SV Training Pullover", sizes: ["S", "M", "L", "XL", "XXL"] },
  { name: "SV Dri-Fit Polo", sizes: ["S", "M", "L", "XL", "XXL"] },
  { name: "SV Cap", sizes: ["6 7/8", "7", "7 1/8", "7 1/4", "7 3/8", "7 1/2"] },
  { name: "SV Backpack", sizes: ["One Size"] },
  { name: "SV Hoodie", sizes: ["S", "M", "L", "XL", "XXL"] },
  { name: "SV Shorts", sizes: ["S", "M", "L", "XL", "XXL"] },
];

export default function LockerView({ playerId }: LockerViewProps) {
  const existingRequests = getPlayerGearRequests(playerId);

  const [formData, setFormData] = useState({
    item_name: "",
    size: "",
    quantity: 1,
  });
  const [submitted, setSubmitted] = useState(false);

  const selectedItem = gearItems.find((g) => g.name === formData.item_name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ item_name: "", size: "", quantity: 1 });
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return "badge-success";
      case "shipped":
        return "badge-info";
      case "approved":
        return "badge-warning";
      case "pending":
        return "badge-neutral";
      default:
        return "badge-neutral";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-foreground mb-2">My Locker</h1>
        <p className="text-foreground-muted">
          Request Stadium Ventures gear and track your orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request form */}
        <div className="card">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Request Gear
          </h2>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-success mb-2">
                Request Submitted!
              </h3>
              <p className="text-foreground-muted text-center">
                Row added to Google Sheet! (Simulated)
                <br />
                Your gear request is being processed.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Item selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Item
                </label>
                <select
                  value={formData.item_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      item_name: e.target.value,
                      size: "",
                    })
                  }
                  className="select"
                  required
                >
                  <option value="">Choose an item...</option>
                  {gearItems.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size selection */}
              {selectedItem && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFormData({ ...formData, size })}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          formData.size === size
                            ? "bg-sv-gold text-background border-sv-gold"
                            : "bg-background border-border text-foreground hover:border-sv-gold"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        quantity: Math.max(1, formData.quantity - 1),
                      })
                    }
                    className="btn btn-secondary w-10 h-10"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold text-foreground w-12 text-center">
                    {formData.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        quantity: Math.min(5, formData.quantity + 1),
                      })
                    }
                    className="btn btn-secondary w-10 h-10"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!formData.item_name || !formData.size}
                className="btn btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
            </form>
          )}
        </div>

        {/* Existing requests */}
        <div className="card">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            My Orders
          </h2>

          {existingRequests.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 mx-auto text-foreground-muted mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="text-foreground-muted">No gear orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {existingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sv-navy flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-sv-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {request.item_name}
                      </div>
                      <div className="text-foreground-muted text-sm">
                        Size: {request.size} | Qty: {request.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`badge ${getStatusBadge(request.status)} capitalize`}
                    >
                      {request.status}
                    </span>
                    <div className="text-foreground-muted text-xs mt-1">
                      {new Date(request.request_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
