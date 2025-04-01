  "use client";

  import { useState } from "react";
  import Step1 from "./_components/Step1";
  import Step2 from "./_components/Step2";
  import Step3 from "./_components/Step3";
  import Step4 from "./_components/Step4";

  type FunnelData = {
    funnelName: string;
    botPath: string;
    startupFile: string; 
  };

  export default function TelegramSetup() {
    const [step, setStep] = useState(1);

    // Etapa 1 e 2: dados de login
    const [phoneNumber, setPhoneNumber] = useState("");
    const [apiHash, setApiHash] = useState("");
    const [apiId, setApiId] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [phoneCodeHash, setPhoneCodeHash] = useState("");

    // Etapa 3: lista de funis (nome + caminho)
    const [selectedFunnels, setSelectedFunnels] = useState<FunnelData[]>([
      { funnelName: "", botPath: "", startupFile: "" },
    ]);

    // Etapa 4: config final
    const [channelId, setChannelId] = useState("");
    const [selectedFunnel, setSelectedFunnel] = useState("");
    const [timeUnit, setTimeUnit] = useState<"minutes" | "hours" | "days">("minutes");
    const [timeValue, setTimeValue] = useState<number>(0);

    // Estados de feedback
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // --------- ETAPA 1: Login (envia código)
    async function handleStep1Next() {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");
      try {
        const res = await fetch("http://82.25.77.163:3001/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber,
            apiHash,
            apiId: parseInt(apiId, 10),
          }),
        });
        if (!res.ok) {
          const errorResponse = await res.json();
          setErrorMsg(errorResponse.error || "Erro ao enviar código");
        } else {
          const data = await res.json();
          setSuccessMsg(data.message || "Código enviado com sucesso!");
          setPhoneCodeHash(data.phone_code_hash);
          setStep(2);
        }
      } catch (err) {
        setErrorMsg("Erro de conexão com a API");
      } finally {
        setLoading(false);
      }
    }

    function handleStep2Next(session: string) {
      setSuccessMsg("Login realizado com sucesso!");
      setStep(3);
    }

    function onChangeFunnel(index: number, funnelData: FunnelData) {
      setSelectedFunnels((prev) => {
        const copy = [...prev];
        copy[index] = funnelData;
        return copy;
      });
    }

    function onAddFunnel() {
      if (selectedFunnels.length < 5) {
        setSelectedFunnels((prev) => [...prev, { funnelName: "", botPath: "", startupFile: "" }]);
      }
    }

    function handleStep3Next(startedPaths: string[]) {
      setSuccessMsg("Funis registrados com sucesso!");
      setStep(4);
    }

    function handleStep4Submit() {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");
      if (!channelId) {
        setErrorMsg("Por favor, insira o ID do canal.");
        setLoading(false);
        return;
      }
      if (!selectedFunnel) {
        setErrorMsg("Selecione um funil.");
        setLoading(false);
        return;
      }
      if (timeValue <= 0) {
        setErrorMsg("Insira um valor de tempo válido.");
        setLoading(false);
        return;
      }
      setTimeout(() => {
        console.log({
          phoneNumber,
          apiHash,
          apiId,
          verificationCode,
          phoneCodeHash,
          selectedFunnels,
          channelId,
          selectedFunnel,
          timeUnit,
          timeValue,
        });
        setSuccessMsg("Configuração completa!");
        setLoading(false);
      }, 1000);
    }

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Configuração do Telegram</h1>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        {successMsg && <p className="text-green-500">{successMsg}</p>}

        {step === 1 && (
          <Step1
            phoneNumber={phoneNumber}
            apiHash={apiHash}
            apiId={apiId}
            onChangePhoneNumber={setPhoneNumber}
            onChangeApiHash={setApiHash}
            onChangeApiId={setApiId}
            onNext={handleStep1Next}
            loading={loading}
          />
        )}

        {step === 2 && (
          <Step2
            verificationCode={verificationCode}
            phoneNumber={phoneNumber}
            apiHash={apiHash}
            apiId={apiId}
            phoneCodeHash={phoneCodeHash}
            onChangeVerificationCode={setVerificationCode}
            onNext={handleStep2Next}
            loading={loading}
            setLoading={setLoading}
            setErrorMsg={setErrorMsg}
            setSuccessMsg={setSuccessMsg}
          />
        )}

        {step === 3 && (
          <Step3
            selectedFunnels={selectedFunnels}
            onChangeFunnel={onChangeFunnel}
            onAddFunnel={onAddFunnel}
            onNext={handleStep3Next}
            loading={loading}
            setLoading={setLoading}
            setErrorMsg={setErrorMsg}
            setSuccessMsg={setSuccessMsg}
          />
        )}

        {step === 4 && (
          <Step4
            channelId={channelId}
            selectedFunnel={selectedFunnel}
            timeUnit={timeUnit}
            timeValue={timeValue}
            onChangeChannelId={setChannelId}
            onChangeSelectedFunnel={setSelectedFunnel}
            onChangeTimeUnit={setTimeUnit}
            onChangeTimeValue={setTimeValue}
            onSubmit={handleStep4Submit}
            loading={loading}
          />
        )}
      </div>
    );
  }
