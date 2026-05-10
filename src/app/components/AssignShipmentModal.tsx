"use client";

import { X, Package, MapPin, Truck, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { usePickup } from "@/app/contexts/PickupContext";
import { useB2B } from "@/app/contexts/B2BContext";
import type { B2BPartnerExtended } from "@/app/contexts/B2BContext";
import { useWallet } from "@/app/contexts/WalletContext";

interface AssignShipmentModalProps {
  partner: B2BPartnerExtended | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignShipmentModal({ partner, isOpen, onClose }: AssignShipmentModalProps) {
  const { requests } = usePickup();
  const { assignShipment, assignedRequestIds } = useB2B();
  const { addPoints } = useWallet();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const availableBatches = requests.filter(
    (r) => r.status === "Completed" && !assignedRequestIds.has(r.id)
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      setSelectedRequestId(null);
      setSuccess(false);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleAssign = async () => {
    if (!selectedRequestId || !partner) return;
    setIsAssigning(true);

    const request = requests.find((r) => r.id === selectedRequestId);
    const tons = (request?.items.reduce((s, i) => s + i.expectedWeightKg, 0) ?? 0) / 1000;

    await new Promise((r) => setTimeout(r, 300));

    assignShipment(partner.id, selectedRequestId, parseFloat(tons.toFixed(3)));

    /* ── B2B Bonus: award 10% of shipment weight (kg) as bonus points ── */
    const kgShipped = tons * 1000;
    const bonusPoints = Math.max(1, Math.round(kgShipped * 0.1));
    addPoints(bonusPoints, `B2B Bonus — Shipment to ${partner.name}`);

    setIsAssigning(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 450);
  };

  if (!isOpen || !partner) return null;

  return (
    <>
      <div
        onClick={!isAssigning ? onClose : undefined}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      >
        {/* Success Overlay */}
        {success && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center gap-4 rounded-3xl">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800">Shipment Assigned!</p>
              <p className="text-sm text-gray-500 mt-1">Batch routed to {partner.name}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${partner.avatarColor} rounded-xl flex items-center justify-center font-bold text-white`}>
                {partner.initials}
              </div>
              <div>
                <h2 className="font-bold text-white">Assign Shipment</h2>
                <p className="text-white/70 text-sm">Route a completed batch → {partner.name}</p>
              </div>
            </div>
            {!isAssigning && (
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {availableBatches.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-semibold text-gray-700 mb-1">No Available Batches</p>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                All completed pickup batches have already been assigned to B2B partners,
                or there are no completed pickups yet.
              </p>
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 mx-auto w-fit">
                <AlertCircle className="w-4 h-4" />
                Complete more pickups to create new batches
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Select a completed batch to route to this partner. Each batch can only be assigned once.
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {availableBatches.map((req, i) => {
                  const totalKg = req.items.reduce((s, it) => s + it.expectedWeightKg, 0);
                  const isSelected = selectedRequestId === req.id;

                  return (
                    <button
                      key={req.id}
                      onClick={() => setSelectedRequestId(isSelected ? null : req.id)}
                      className={`stagger-in w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                        isSelected
                          ? "border-violet-400 bg-violet-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      style={{ animationDelay: `${i * 14}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? "bg-violet-100" : "bg-emerald-50"}`}>
                            <Package className={`w-4 h-4 ${isSelected ? "text-violet-600" : "text-emerald-600"}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-800">{req.id}</p>
                            <p className="text-xs text-gray-500">{req.citizen.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-gray-800">{totalKg.toFixed(1)} kg</p>
                          <p className="text-xs text-gray-500">{req.items.map((it) => it.plasticType).join(", ")}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {req.zone.name}
                        </span>
                        {req.driver && (
                          <span className="flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            {req.driver.name}
                          </span>
                        )}
                        <span className="ml-auto text-emerald-600 font-medium">
                          +{req.pointsAwarded ?? 0} pts
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {availableBatches.length > 0 && (
          <div className="flex items-center gap-3 p-5 pt-0">
            <button
              onClick={onClose}
              disabled={isAssigning}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedRequestId || isAssigning}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAssigning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  Assign Shipment
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}