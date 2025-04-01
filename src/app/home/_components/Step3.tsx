"use client";

import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type FunnelData = {
  funnelName: string;
  botPath: string;
  startupFile: string; // novo campo
};

type Step3Props = {
  // Lista de funis que o usuário preencheu
  selectedFunnels: FunnelData[];

  // Callback p/ atualizar um funil específico
  onChangeFunnel: (index: number, funnelData: FunnelData) => void;

  // Callback p/ adicionar mais um funil na lista
  onAddFunnel: () => void;

  // Chamada quando o registro no backend dá certo
  // Ex.: onNext(data.started)
  onNext: (startedPaths: string[]) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;
  setErrorMsg: (value: string) => void;
  setSuccessMsg: (value: string) => void;
};

const Step3: FC<Step3Props> = ({
  selectedFunnels,
  onChangeFunnel,
  onAddFunnel,
  onNext,
  loading,
  setLoading,
  setErrorMsg,
  setSuccessMsg,
}) => {
  async function handleRegister() {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Valida se há 1..5 funis
    if (selectedFunnels.length < 1 || selectedFunnels.length > 5) {
      setErrorMsg("Você precisa ter entre 1 e 5 funis.");
      setLoading(false);
      return;
    }

    // Valida se todos têm funnelName e botPath (startupFile pode ser opcional, dependendo da lógica)
    for (const funnel of selectedFunnels) {
      if (!funnel.funnelName || !funnel.botPath) {
        setErrorMsg("Todos os funis precisam de um nome e de um caminho de bot.");
        setLoading(false);
        return;
      }
      // startupFile pode ser vazio se quiser
    }

    try {
      // Faz POST /funnel/register-funnels enviando { funnels: [...] }
      const res = await fetch("http://82.25.77.163:3001/funnel/register-funnels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funnels: selectedFunnels }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMsg(errorData.error || "Erro ao registrar funis");
      } else {
        const data = await res.json();
        // data pode ser { message, total, started: [...] }
        setSuccessMsg(data.message || "Funis registrados com sucesso!");
        // Se o backend retorna data.started, chamamos onNext(data.started)
        onNext(data.started || []);
      }
    } catch (err) {
      setErrorMsg("Erro de conexão com a API de registro de funis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Label>Registre de 1 a 5 Funis (nome, caminho do bot e arquivo de inicialização)</Label>

      {selectedFunnels.map((funnel, index) => (
        <div key={index} className="space-y-2 border p-2 rounded-md mb-2">
          <Label className="font-semibold">{`Funil ${index + 1}`}</Label>

          {/* Nome do Funil */}
          <Input
            placeholder="Nome do Funil (ex: DarkFlow1)"
            value={funnel.funnelName}
            onChange={(e) =>
              onChangeFunnel(index, {
                ...funnel,
                funnelName: e.target.value,
              })
            }
          />

          {/* Caminho do Bot */}
          <Input
            placeholder="Caminho do Bot (ex: C:\\meuBot )"
            value={funnel.botPath}
            onChange={(e) =>
              onChangeFunnel(index, {
                ...funnel,
                botPath: e.target.value,
              })
            }
          />

          {/* Nome do Arquivo de Inicialização */}
          <Input
            placeholder="Nome do arquivo de inicialização (ex: main.py)"
            value={funnel.startupFile}
            onChange={(e) =>
              onChangeFunnel(index, {
                ...funnel,
                startupFile: e.target.value,
              })
            }
          />
        </div>
      ))}

      <div className="flex gap-4">
        <Button onClick={onAddFunnel} disabled={selectedFunnels.length >= 5}>
          Adicionar Funil
        </Button>
        <Button onClick={handleRegister} disabled={loading}>
          {loading ? "Carregando..." : "Registrar Funis"}
        </Button>
      </div>
    </div>
  );
};

export default Step3;
