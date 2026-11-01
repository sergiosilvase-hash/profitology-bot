export default function ProfitologyBot() {
  const [activeTab, setActiveTab] = useState('radar');
  const [selectedBroker, setSelectedBroker] = useState('Pocket Option');
  const [selectedAsset, setSelectedAsset] = useState('EUR/USD OTC');
  const [timeframe, setTimeframe] = useState('1m');
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ wins: 0, losses: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [serverTime, setServerTime] = useState(new Date());

  // Relógio do Servidor em Tempo Real
  useEffect(() => {
    const timer = setInterval(() => {
      setServerTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const assetsList = [
    { name: 'EUR/GBP OTC', payout: '93%', assertiveness: '94%', trend: 'CALL' },
    { name: 'EUR/USD OTC', payout: '92%', assertiveness: '91%', trend: 'PUT' },
    { name: 'GBP/USD OTC', payout: '90%', assertiveness: '88%', trend: 'CALL' },
    { name: 'USD/CAD OTC', payout: '89%', assertiveness: '85%', trend: 'PUT' },
    { name: 'EUR/JPY', payout: '87%', assertiveness: '82%', trend: 'CALL' },
    { name: 'GBP/JPY', payout: '88%', assertiveness: '84%', trend: 'PUT' },
    { name: 'USD/CHF', payout: '85%', assertiveness: '79%', trend: 'CALL' },
  ];

  const filteredAssets = assetsList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateSignal = () => {
    setLoading(true);
    setSignal(null);
    setTimeout(() => {
      const isCall = Math.random() > 0.5;
      setSignal({
        type: isCall ? 'CALL (COMPRA)' : 'PUT (VENDA)',
        color: isCall ? 'text-emerald-400 border-emerald-500 bg-emerald-950/40' : 'text-rose-400 border-rose-500 bg-rose-950/40',
        asset: selectedAsset,
        tf: timeframe,
        confidence: (85 + Math.floor(Math.random() * 12)) + '%'
      });
      setLoading(false);
    }, 1200);
  };

  const handleResult = (type) => {
    if (type === 'win') setStats(s => ({ ...s, wins: s.wins + 1 }));
    if (type === 'loss') setStats(s => ({ ...s, losses: s.losses + 1 }));
    setSignal(null);
  };

  const forceRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans max-w-md mx-auto shadow-2xl border-x border-slate-800">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <h1 className="font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            PROFITOLOGY BOT
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={forceRefresh} 
            title="Atualizar App (F5)" 
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 border border-slate-700 transition"
          >
            🔄 F5
          </button>
          <div className="text-xs bg-slate-800 px-2 py-1 rounded-md border border-slate-700 font-mono text-cyan-400">
            {serverTime.toLocaleTimeString()}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pb-20 space-y-4 overflow-y-auto">
        {activeTab === 'radar' && (
          <div className="space-y-4 animate-fade-in">
            {/* Broker & Settings Banner */}
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block">Corretora Selecionada</span>
                <select 
                  value={selectedBroker} 
                  onChange={(e) => setSelectedBroker(e.target.value)}
                  className="bg-slate-800 text-emerald-400 font-bold text-sm px-2 py-1 rounded border border-slate-700 mt-0.5 outline-none"
                >
                  <option value="Pocket Option">Pocket Option</option>
                  <option value="Deriv">Deriv (Demo/Real)</option>
                  <option value="Quotex">Quotex</option>
                  <option value="IQ Option">IQ Option</option>
                </select>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Placar da Sessão</span>
                <span className="text-sm font-bold text-emerald-400">⚡ {stats.wins}W</span>
                <span className="text-sm font-bold text-rose-400 ml-2">❌ {stats.losses}L</span>
              </div>
            </div>

            {/* Asset Selection & Search */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">Radar de Ativos & Assertividade</label>
                <input 
                  type="text" 
                  placeholder="Buscar par..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs px-2.5 py-1 rounded-lg text-slate-200 w-32 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredAssets.map((asset) => (
                  <div 
                    key={asset.name}
                    onClick={() => setSelectedAsset(asset.name)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex justify-between items-center ${
                      selectedAsset === asset.name 
                        ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-950/30' 
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                        {asset.name}
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                          Payout {asset.payout}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">Tendência: <strong className="text-slate-200">{asset.trend}</strong></span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 block">🔥 {asset.assertiveness}</span>
                      <span className="text-[10px] text-slate-500">Assertividade</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeframe Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tempo de Expiração (Vela)</label>
              <div className="grid grid-cols-4 gap-2">
                {['1m', '3m', '5m', '15m'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      timeframe === tf 
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {tf.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Candlestick Preview */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Gráfico Ao Vivo ({selectedAsset})</span>
                <span className="text-cyan-400 font-mono animate-pulse">Nova Vela em: 00:{(60 - (serverTime.getSeconds() % 60)).toString().padStart(2, '0')}</span>
              </div>
              
              {/* Simulated Candlestick Chart UI */}
              <div className="h-28 bg-slate-950 rounded-lg border border-slate-800 flex items-end justify-around px-4 pb-2 pt-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                
                {/* Candles */}
                <div className="w-3 bg-emerald-500 h-14 rounded-sm relative flex justify-center"><div className="w-0.5 bg-emerald-300 h-20 -top-3 absolute"></div></div>
                <div className="w-3 bg-rose-500 h-10 rounded-sm relative flex justify-center"><div className="w-0.5 bg-rose-300 h-16 -top-2 absolute"></div></div>
                <div className="w-3 bg-emerald-500 h-20 rounded-sm relative flex justify-center"><div className="w-0.5 bg-emerald-300 h-24 -top-2 absolute"></div></div>
                <div className="w-3 bg-rose-500 h-12 rounded-sm relative flex justify-center"><div className="w-0.5 bg-rose-300 h-16 -top-3 absolute"></div></div>
                <div className="w-3 bg-emerald-500 h-16 rounded-sm relative flex justify-center animate-pulse"><div className="w-0.5 bg-emerald-300 h-22 -top-4 absolute"></div></div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateSignal}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-950/50 transition transform active:scale-95 disabled:opacity-50 text-sm tracking-wider"
            >
              {loading ? 'ANALISANDO MERCADO...' : GERAR SINAL PARA ${selectedAsset}}
            </button>

            {/* Signal Result Box */}
            {signal && (
              <div className={p-4 rounded-xl border ${signal.color} space-y-3 animate-bounce-subtle}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider">Sinal Confirmado</span>
                  <span className="text-xs font-mono font-bold bg-black/40 px-2 py-0.5 rounded">Confiança: {signal.confidence}</span>
                </div>
                <div className="text-center py-1">
                  <span className="text-2xl font-black tracking-widest">{signal.type}</span>
                  <p className="text-xs opacity-80 mt-1">Ativo: {signal.asset} | Expiração: {signal.tf}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <button 
                    onClick={() => handleResult('win')}
                    className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition"
                  >
                    ✅ DEU WIN
                  </button>
                  <button 
                    onClick={() => handleResult('loss')}
                    className="py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow transition"
                  >
                    ❌ DEU LOSS
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-slate-900 border-t border-slate-800 p-3 flex justify-around fixed bottom-0 max-w-md w-full z-50">
        <button 
          onClick={() => setActiveTab('radar')}
          className={text-xs font-bold flex flex-col items-center gap-1 transition ${activeTab === 'radar' ? 'text-emerald-400' : 'text-slate-400'}}
        >
          <span>📊</span> Radar & Sinais
        </button>
      </nav>
    </div>
  );
}
