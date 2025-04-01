"use client";

import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Step1Props = {
  phoneNumber: string;
  apiHash: string;
  apiId: string;
  onChangePhoneNumber: (value: string) => void;
  onChangeApiHash: (value: string) => void;
  onChangeApiId: (value: string) => void;
  onNext: () => void;
  loading: boolean;
};

const Step1: FC<Step1Props> = ({
  phoneNumber,
  apiHash,
  apiId,
  onChangePhoneNumber,
  onChangeApiHash,
  onChangeApiId,
  onNext,
  loading,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Telefone (código internacional + DDD + número)</Label>
        <Input
          value={phoneNumber}
          onChange={(e) => onChangePhoneNumber(e.target.value)}
          placeholder="+55 11 91234-5678"
        />
      </div>
      <div>
        <Label>API Hash do Telegram</Label>
        <Input
          value={apiHash}
          onChange={(e) => onChangeApiHash(e.target.value)}
          placeholder="Insira o API Hash"
        />
      </div>
      <div>
        <Label>API ID do Telegram</Label>
        <Input
          value={apiId}
          onChange={(e) => onChangeApiId(e.target.value)}
          placeholder="Insira o API ID"
        />
      </div>
      <Button onClick={onNext} disabled={loading}>
        {loading ? "Processando..." : "Confirmar"}
      </Button>
    </div>
  );
};

export default Step1;
