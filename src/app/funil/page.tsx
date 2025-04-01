"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type FunnelBot = {
  id: number;
  funnelName: string;
  startupFile: string;
  createdAt: string;
};

export default function BotsListPage() {
  const [bots, setBots] = useState<FunnelBot[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [botStatuses, setBotStatuses] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function loadBots() {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch("http://82.25.77.163:3001/funnel/list-funnels");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao carregar funis");
        }
        const data = await res.json();
        const mapped = data.map((f: FunnelBot) => ({
          ...f,
          status: "inactive",
        }));
        setBots(mapped);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadBots();
  }, []);

  async function toggleBot(botId: number) {
    const isStarting = !botStatuses[botId];
    setBotStatuses((prev) => ({
      ...prev,
      [botId]: isStarting,
    }));

    if (isStarting) {
      try {
        const res = await fetch("http://82.25.77.163:3001/funnel/start-bot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: botId,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao iniciar funil");
        }
        const data = await res.json();
        console.log("Funil iniciado:", data.message);
      } catch (err) {
        console.error(err);
        setBotStatuses((prev) => ({
          ...prev,
          [botId]: false,
        }));
      }
    } else {
      try {
        const res = await fetch("http://82.25.77.163:3001/funnel/stop-bot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: botId,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao parar funil");
        }
        const data = await res.json();
        console.log("Funil parado:", data.message);
      } catch (err) {
        console.error(err);
        setBotStatuses((prev) => ({
          ...prev,
          [botId]: true,
        }));
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configurações de Funis</h1>
        <Link href="/home">
          <Button>Adicionar Funil</Button>
        </Link>
      </div>

      {loading && <p>Carregando lista de funis...</p>}

      {!loading && bots.length === 0 && (
        <p className="text-muted-foreground">Nenhum funil encontrado.</p>
      )}

      {errorMsg && <p className="text-red-600 font-semibold">{errorMsg}</p>}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {bots.map((bot) => (
          <Card key={bot.id}>
            <CardHeader>
              <CardTitle className="font-semibold">{bot.funnelName}</CardTitle>
              <CardDescription className="font-semibold">
                {bot.startupFile}
              </CardDescription>
            </CardHeader>
            <CardContent className="-mt-3">
              <p className="text-sm text-muted-foreground font-semibold">
                Criado em:{" "}
                {new Date(bot.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex gap-10">
                <Link href={`/configuracoes/${bot.id}`}>
                  <Button variant="outline" className="hover:text-white">
                    Entrar
                  </Button>
                </Link>
                <Button
                  className={
                    botStatuses[bot.id]
                      ? "bg-yellow-600 hover:bg-red-600"
                      : "bg-green-600 hover:bg-green-800"
                  }
                  onClick={() => toggleBot(bot.id)}
                >
                  {botStatuses[bot.id] ? "Rodando" : "Iniciar"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
