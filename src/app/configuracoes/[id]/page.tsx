"use client";

import { useEffect, useState } from "react";
import Step4 from "@/app/home/_components/Step4"; 

// Definição do tipo de funil (de acordo com o que o backend retorna)
type FunnelData = {
  id: number;
  funnelName: string;
  botPath: string;
  startupFile: string;
};

export const dynamic = 'force-dynamic';

export default function Step4Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para a configuração final (Step 4)
  const [channelId, setChannelId] = useState("");
  const [selectedFunnel, setSelectedFunnel] = useState("");
  const [timeUnit, setTimeUnit] = useState<"minutes" | "hours" | "days">("minutes");
  const [timeValue, setTimeValue] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Ao montar a página, busca os dados do funil via GET no backend
  useEffect(() => {
    async function loadFunnel() {
      setLoading(true);
      try {
        const res = await fetch(`http://82.25.77.163:3001/funnel/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao buscar funil");
        }
        const data = await res.json();
        setFunnel(data);
        // Define o funil selecionado com base no retorno do backend
        setSelectedFunnel(data.funnelName);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadFunnel();
  }, [id]);

  // Função para disparar o POST que agenda a checagem no backend
  async function handleSubmit() {
    setErrorMsg("");
    setSuccessMsg("");

    if (!channelId) {
      setErrorMsg("Por favor, insira o ID do canal.");
      return;
    }
    if (!selectedFunnel) {
      setErrorMsg("Selecione um funil.");
      return;
    }
    if (timeValue <= 0) {
      setErrorMsg("Insira um valor de tempo válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://82.25.77.163:3001/funnel/schedule-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId,
          funnel: selectedFunnel,
          timeUnit,
          timeValue,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Erro ao agendar verificação");
      } else {
        const data = await res.json();
        setSuccessMsg(data.message || "Verificação agendada com sucesso!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao contatar a API de schedule-check");
    } finally {
      setLoading(false);
    }
  }

  // Renderiza enquanto carrega
  if (loading && !funnel) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!funnel) return null;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Configurações do Funil: {funnel.funnelName}
      </h1>
      <Step4
        channelId={channelId}
        selectedFunnel={selectedFunnel}
        timeUnit={timeUnit}
        timeValue={timeValue}
        onChangeChannelId={setChannelId}
        onChangeSelectedFunnel={setSelectedFunnel}
        onChangeTimeUnit={setTimeUnit}
        onChangeTimeValue={setTimeValue}
        onSubmit={handleSubmit}
        loading={loading}
      />
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      {successMsg && <p className="text-green-500">{successMsg}</p>}
    </div>
  );
}
