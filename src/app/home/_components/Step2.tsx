"use client";

import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Step2Props = {
  verificationCode: string;
  onChangeVerificationCode: (value: string) => void;
  // Callback para avançar para a próxima etapa com a sessão obtida
  onNext: (session: string) => void;
  // Dados necessários para consumir a API
  phoneNumber: string;
  apiHash: string;
  apiId: string;
  phoneCodeHash: string;
  // Estados de feedback e loading
  loading: boolean;
  setLoading: (value: boolean) => void;
  setErrorMsg: (value: string) => void;
  setSuccessMsg: (value: string) => void;
};

const Step2: FC<Step2Props> = ({
  verificationCode,
  onChangeVerificationCode,
  onNext,
  phoneNumber,
  apiHash,
  apiId,
  phoneCodeHash,
  loading,
  setLoading,
  setErrorMsg,
  setSuccessMsg,
}) => {
  async function handleVerify() {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("http://82.25.77.163:3001/auth/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          apiHash,
          apiId: parseInt(apiId, 10),
          code: verificationCode,
          phone_code_hash: phoneCodeHash,
        }),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        setErrorMsg(errorResponse.error || "Erro ao verificar o código");
      } else {
        const data = await res.json();
        setSuccessMsg(data.message || "Login realizado com sucesso!");
        onNext(data.session); // Avança para a próxima etapa passando a sessão obtida
      }
    } catch (err) {
      setErrorMsg("Erro de conexão com a API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Código de Verificação (Telegram)</Label>
        <Input
          value={verificationCode}
          onChange={(e) => onChangeVerificationCode(e.target.value)}
          placeholder="Insira o código recebido"
        />
      </div>
      <Button onClick={handleVerify} disabled={loading}>
        {loading ? "Verificando..." : "Verificar Código"}
      </Button>
    </div>
  );
};

export default Step2;
