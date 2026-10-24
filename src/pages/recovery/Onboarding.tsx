// ============================================================================
// BLUMHELPS — PÁGINA DE ONBOARDING (monta ConsentScreen y navega)
// ============================================================================
import React from "react";
import { useNavigate } from "react-router-dom";
import { ConsentScreen } from "../../components/recovery/ConsentScreen";
import { recoveryStorage } from "../../lib/recovery/storage";

export function RecoveryOnboarding() {
  const navigate = useNavigate();

  const handleAccept = async (record: {
    version: string;
    acceptedAt: string;
    textHash: string;
  }) => {
    await recoveryStorage.setConsent(record.acceptedAt);
    navigate("/recuperacion");
  };

  const handleCancel = () => navigate("/");

  return (
    <ConsentScreen
      onAccept={handleAccept}
      onCancel={handleCancel}
      minReadSeconds={20}
      minScrollRatio={0.5}
    />
  );
}
