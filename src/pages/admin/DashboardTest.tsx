/**
 * Dashboard Test - Versão Simplificada para Debug
 */

const DashboardTest = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">🎉 DASHBOARD CARREGOU!</h1>

      <div className="space-y-4">
        <div className="p-4 bg-primary/10 rounded-lg">
          <h2 className="font-bold text-xl">✅ AdminRoute funcionando!</h2>
          <p className="text-muted-foreground">Você está vendo esta página porque o AdminRoute permitiu acesso em DEV_MODE.</p>
        </div>

        <div className="p-4 bg-accent/10 rounded-lg">
          <h2 className="font-bold text-xl">📊 Dados do Banco (via SQL)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
            <li>Total Usuários: 4</li>
            <li>Assinaturas Ativas: 3</li>
            <li>MRR: R$ 232,00</li>
            <li>Novos Hoje: 3</li>
          </ul>
        </div>

        <div className="p-4 bg-green-500/10 rounded-lg">
          <h2 className="font-bold text-xl">🚀 Próximo Passo</h2>
          <p className="text-sm">Agora vamos conectar com dados reais do Supabase usando useQuery.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardTest;
