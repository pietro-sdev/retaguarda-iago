"use client";

import { FC, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type FunnelData = {
  id: number;
  funnelName: string;
};

type Step4Props = {
  channelId: string;
  selectedFunnel: string;
  timeUnit: "minutes" | "hours" | "days";
  timeValue: number;

  onChangeChannelId: (val: string) => void;
  onChangeSelectedFunnel: (val: string) => void;
  onChangeTimeUnit: (val: "minutes" | "hours" | "days") => void;
  onChangeTimeValue: (val: number) => void;
  onSubmit: () => void;

  loading: boolean;
};

const Step4: FC<Step4Props> = ({
  channelId,
  selectedFunnel,
  timeUnit,
  timeValue,
  onChangeChannelId,
  onChangeSelectedFunnel,
  onChangeTimeUnit,
  onChangeTimeValue,
  onSubmit,
  loading,
}) => {
  const [funnelList, setFunnelList] = useState<FunnelData[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadFunnels() {
      try {
        const res = await fetch("http://82.25.77.163:3001/funnel/list-funnels");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao carregar funis");
        }
        const data = await res.json();
        setFunnelList(data);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar funis");
      }
    }
    loadFunnels();
  }, []);

  async function handleSubmit() {
    // Você pode manter ou remover onSubmit() do pai, mas o essencial
    // é fazer a chamada POST /funnel/schedule-check aqui.
    setError("");
    setSuccess("");

    if (!channelId) {
      setError("Por favor, insira o ID do canal.");
      return;
    }
    if (!selectedFunnel) {
      setError("Selecione um funil.");
      return;
    }
    if (timeValue <= 0) {
      setError("Insira um valor de tempo válido.");
      return;
    }

    try {
      // Chama a rota /funnel/schedule-check
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
        setError(data.error || "Erro ao agendar verificação");
      } else {
        const data = await res.json();
        setSuccess(data.message || "Verificação agendada com sucesso!");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao contatar a API de schedule-check");
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <Label className="font-semibold">ID do Canal</Label>
      <Input
        value={channelId}
        onChange={(e) => onChangeChannelId(e.target.value)}
        placeholder="Ex: -1001234567890"
      />

      <div>
        <Label className="font-semibold">Selecione o Funil</Label>
        {error && <p className="text-red-500">{error}</p>}

        <Select
          value={selectedFunnel}
          onValueChange={(val) => onChangeSelectedFunnel(val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Escolha um funil" />
          </SelectTrigger>
          <SelectContent>
            {funnelList.map((f) => (
              <SelectItem key={f.id} value={f.funnelName}>
                {f.funnelName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-semibold">Unidade de Tempo</Label>
        <Select
          value={timeUnit}
          onValueChange={(val) =>
            onChangeTimeUnit(val as "minutes" | "hours" | "days")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione a unidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minutes">Minutos</SelectItem>
            <SelectItem value="hours">Horas</SelectItem>
            <SelectItem value="days">Dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-semibold">Tempo</Label>
        <Input
          type="number"
          value={timeValue}
          onChange={(e) =>
            onChangeTimeValue(parseInt(e.target.value, 10) || 0)
          }
          placeholder="Ex: 30"
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processando..." : "Confirmar Configuração"}
      </Button>
    </div>
  );
};

export default Step4;
