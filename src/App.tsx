import React, { useState, useMemo } from "react";
import {
  Settings,
  Info,
  Activity,
  ChevronRight,
  Sliders,
  Target,
  Database,
} from "lucide-react";

const App = () => {
  // 核心狀態
  const [target] = useState(0); // 規格中心值固定為 0
  const [actualMean, setActualMean] = useState(15.0);
  const [tolerance, setTolerance] = useState(200);
  const [sigma, setSigma] = useState(30.0);

  // 數學計算
  const offset = Math.abs(actualMean - target);
  const halfT = tolerance / 2;
  const caPercent = (offset / halfT) * 100;

  // 動態配色與等級範圍定義
  const gradeConfig = (val) => {
    if (val <= 12.5)
      return {
        grade: "A",
        label: "良好",
        color: "#10b981",
        bg: "bg-emerald-500",
        text: "text-emerald-600",
        border: "border-emerald-200",
        light: "bg-emerald-50",
      };
    if (val <= 25)
      return {
        grade: "B",
        label: "尚可",
        color: "#f59e0b",
        bg: "bg-amber-400",
        text: "text-amber-600",
        border: "border-amber-200",
        light: "bg-amber-50",
      };
    if (val <= 50)
      return {
        grade: "C",
        label: "不足",
        color: "#f97316",
        bg: "bg-orange-500",
        text: "text-orange-600",
        border: "border-orange-200",
        light: "bg-orange-50",
      };
    return {
      grade: "D",
      label: "極差",
      color: "#ef4444",
      bg: "bg-red-500",
      text: "text-red-600",
      border: "border-red-200",
      light: "bg-red-50",
    };
  };

  const grade = gradeConfig(caPercent);

  // 文字光暈樣式 (僅用於偏移量文字，防止被線條遮擋)
  const textHaloStyle = {
    paintOrder: "stroke",
    stroke: "#ffffff",
    strokeWidth: "3.5px",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fontWeight: "normal",
  };

  // 生成靜態常態分佈路徑 (Base Shape)
  const basePath = useMemo(() => {
    const points = [];
    for (let x = -250; x <= 250; x += 1) {
      const y =
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow(x / sigma, 2));
      points.push(`${x},${100 - y * 4200}`);
    }
    return `M ${points.join(" L ")} L 250,100 L -250,100 Z`;
  }, [sigma]);

  return (
    <div className="min-h-screen bg-slate-50 text-black font-sans antialiased selection:bg-blue-100 selection:text-blue-900 text-left overflow-x-hidden">
      {/* 頂部導覽列 */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-md shadow-blue-200 text-white">
              <Activity size={20} />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight text-black">
                Cₐ 準確度評估互動實驗室
              </h1>
              <p className="text-[10px] text-slate-400 uppercase font-medium tracking-widest">
                Statistical Process Control Lab
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-normal text-black text-left">
            <div className="flex items-center gap-1.5">
              <Target size={14} className="text-blue-600" /> 規格中心值
            </div>
            <div className="flex items-center gap-1.5">
              <Database size={14} className="text-blue-600" /> 規格量程
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 左側：數據與控制面板 */}
          <div className="lg:col-span-4 space-y-6 text-left order-2 lg:order-1">
            {/* 數據分析卡片 */}
            <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
              <div
                className={`absolute top-0 right-0 w-32 h-32 ${grade.bg} opacity-5 blur-3xl -translate-y-1/2 translate-x-1/2`}
              ></div>
              <div className="relative text-left">
                <header className="flex justify-between items-center mb-6">
                  <span className="text-[11px] font-medium uppercase text-slate-400 tracking-widest">
                    評估結果分析
                  </span>
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-medium border-2 ${grade.border} text-black bg-white`}
                  >
                    GRADE {grade.grade}
                  </div>
                </header>

                <div className="space-y-3">
                  <div className="flex items-baseline gap-3 mb-2">
                    <div className="text-6xl font-mono font-medium tracking-tighter text-black">
                      {caPercent.toFixed(1)}
                      <span className="text-2xl ml-1 text-slate-400">%</span>
                    </div>
                  </div>
                  {/* 已更新：將等級與評價文字分行顯示 */}
                  <div className="flex flex-col gap-1">
                    <span className={`text-2xl font-medium ${grade.text}`}>
                      等級 {grade.grade}
                    </span>
                    <h3 className="text-2xl font-medium text-left text-black">
                      Cₐ 準確度{grade.label}
                    </h3>
                  </div>
                </div>

                {/* 計算公式區 */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3 text-left">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm"></div>
                    <span className="text-xs font-normal text-slate-600 tracking-wide underline underline-offset-4 decoration-blue-100 decoration-2 font-normal">
                      計算公式參考：
                    </span>
                  </div>
                  <div className="bg-blue-50 px-3 py-6 rounded-2xl border border-blue-100 shadow-inner overflow-hidden">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex items-center gap-2 text-black whitespace-nowrap">
                        <span className="text-base font-medium uppercase tracking-tight flex-shrink-0">
                          Cₐ =
                        </span>
                        <div className="flex flex-col items-center flex-shrink-0">
                          <span className="px-1 pb-1 border-b border-blue-900/20 text-[13px] font-normal uppercase tracking-tight text-center leading-tight">
                            | 實測平均值 - 規格中心值 |
                          </span>
                          <span className="pt-1 text-[15px] font-normal uppercase tracking-tight leading-tight">
                            規格公差 / 2
                          </span>
                        </div>
                      </div>
                      <div className="w-full text-center text-[15px] text-blue-700 font-mono font-medium mt-4 pt-3 border-t border-blue-200/50">
                        代入數值: | {actualMean.toFixed(1)} - 0.0 | /{" "}
                        {(tolerance / 2).toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 控制面板 */}
            <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-left">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-8 uppercase tracking-wider">
                <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                  <Settings size={16} />
                </span>{" "}
                參數模擬
              </h3>

              <div className="space-y-10">
                <div className="space-y-4 text-left text-black">
                  <div className="flex justify-between items-end text-left">
                    <label className="text-[11px] font-normal uppercase tracking-widest text-left">
                      實測中心 (x̄)
                    </label>
                    <span className="text-xl font-mono font-medium text-blue-600">
                      {actualMean.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={actualMean}
                    onChange={(e) => setActualMean(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] font-normal text-slate-400 uppercase tracking-tight text-left">
                    <span>LSL</span>
                    <span>規格中心值</span>
                    <span>USL</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50 text-left text-black">
                  <div className="flex justify-between items-end text-left">
                    <label className="text-[11px] font-normal uppercase tracking-widest flex items-center gap-1.5 text-left">
                      <Sliders size={12} className="text-purple-500" /> 精密度
                      (σ)
                    </label>
                    <span className="text-xl font-mono font-medium text-purple-600">
                      {sigma.toFixed(0)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="1"
                    value={sigma}
                    onChange={(e) => setSigma(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* 右側：主視覺分佈圖 */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/30 flex flex-col min-h-[600px] text-left order-1 lg:order-2">
            <header className="flex justify-between items-center mb-6 border-b border-slate-50 pb-6 text-left">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 tracking-tight uppercase">
                <Info size={18} className="text-blue-500" /> 分佈偏移模擬分析
              </h3>
              <div className="flex items-center gap-4 text-slate-400 font-medium uppercase tracking-tight text-left">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 border-t border-dashed border-black"></div>
                  <span className="text-black">理想基準</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                  <div
                    className={`w-3 h-3 rounded shadow-sm text-left`}
                    style={{ backgroundColor: grade.color, opacity: 0.6 }}
                  ></div>
                  <span>實測狀態</span>
                </div>
              </div>
            </header>

            <div className="relative flex-grow flex items-center justify-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden shadow-inner text-left">
              <svg
                viewBox="-120 5 240 110"
                className="w-full h-full max-h-[480px] overflow-visible text-left"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="6"
                    markerHeight="4"
                    refX="5.5"
                    refY="2"
                    orient="auto"
                  >
                    <path d="M0,0 L6,2 L0,4 Z" fill="#2563eb" />
                  </marker>
                </defs>

                <line
                  x1="-120"
                  y1="100"
                  x2="120"
                  y2="100"
                  stroke="#cbd5e1"
                  strokeWidth="0.5"
                />

                {[-100, 0, 100].map((v) => (
                  <line
                    key={v}
                    x1={v}
                    y1="40"
                    x2={v}
                    y2="100"
                    stroke="#f1f5f9"
                    strokeWidth="0.5"
                  />
                ))}

                {[-100, -50, 0, 50, 100].map((val) => (
                  <g key={val}>
                    <line
                      x1={val}
                      y1="100"
                      x2={val}
                      y2="103"
                      stroke="#94a3b8"
                      strokeWidth="0.8"
                    />
                    <text
                      x={val}
                      y="110"
                      fontSize="5"
                      textAnchor="middle"
                      fill="#000"
                      fontWeight="normal"
                    >
                      {val}
                    </text>
                  </g>
                ))}

                <g>
                  <line
                    x1={target - halfT}
                    y1="35"
                    x2={target - halfT}
                    y2="100"
                    stroke="#ef4444"
                    strokeWidth="0.8"
                  />
                  <line
                    x1={target + halfT}
                    y1="35"
                    x2={target + halfT}
                    y2="100"
                    stroke="#ef4444"
                    strokeWidth="0.8"
                  />
                  <text
                    x={target - halfT}
                    y="33"
                    fontSize="5"
                    textAnchor="middle"
                    fill="#ef4444"
                    fontWeight="normal"
                  >
                    LSL
                  </text>
                  <text
                    x={target + halfT}
                    y="33"
                    fontSize="5"
                    textAnchor="middle"
                    fill="#ef4444"
                    fontWeight="normal"
                  >
                    USL
                  </text>
                </g>

                <line
                  x1={target}
                  y1="28"
                  x2={target}
                  y2="100"
                  stroke="#1e293b"
                  strokeWidth="0.8"
                />
                <text
                  x={target}
                  y="25"
                  fontSize="7"
                  textAnchor="middle"
                  fill="#1e293b"
                  fontWeight="normal"
                >
                  規格中心值
                </text>

                <line
                  x1={actualMean}
                  y1="28"
                  x2={actualMean}
                  y2="100"
                  stroke="#2563eb"
                  strokeWidth="0.8"
                />
                <text
                  x={actualMean}
                  y="15"
                  fontSize="6.5"
                  textAnchor="middle"
                  fill="#2563eb"
                  fontWeight="normal"
                >
                  實測平均值
                </text>

                <path
                  d={basePath}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                  strokeDasharray="1.5,1"
                />

                <path
                  d={basePath}
                  transform={`translate(${actualMean}, 0)`}
                  fill={grade.color}
                  fillOpacity="0.45"
                  stroke={grade.color}
                  strokeWidth="1.2"
                  style={{
                    transition: "transform 0.1s linear, fill 0.3s ease",
                  }}
                />

                {Math.abs(actualMean - target) > 3 && (
                  <g>
                    <path
                      d={`M ${target} 55 L ${actualMean} 55`}
                      stroke="#2563eb"
                      strokeWidth="0.8"
                      strokeDasharray="1.5,1"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x={(target + actualMean) / 2}
                      y="52"
                      fontSize="6"
                      textAnchor="middle"
                      fill="#2563eb"
                      fontWeight="normal"
                      style={textHaloStyle}
                    >
                      偏移: {offset.toFixed(1)}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Ca製程能力評價標題 */}
            <div className="mt-10 px-2 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
              <span className="text-base font-normal text-black tracking-wide">
                Ca製程能力評價
              </span>
            </div>

            {/* 下方等級區間卡片 */}
            <div className="mt-6 px-2 grid grid-cols-4 gap-4 text-center font-normal">
              {[
                {
                  g: "A",
                  r: "|Cₐ| ≤ 12.5%",
                  t: "良好",
                  c: "bg-emerald-500",
                  bc: "border-emerald-200",
                  lc: "bg-emerald-50",
                },
                {
                  g: "B",
                  r: "12.5% < |Cₐ| ≤ 25%",
                  t: "尚可",
                  c: "bg-amber-400",
                  bc: "border-amber-200",
                  lc: "bg-amber-50",
                },
                {
                  g: "C",
                  r: "25% < |Cₐ| ≤ 50%",
                  t: "不足",
                  c: "bg-orange-500",
                  bc: "border-orange-200",
                  lc: "bg-orange-50",
                },
                {
                  g: "D",
                  r: "|Cₐ| > 50%",
                  t: "極差",
                  c: "bg-red-500",
                  bc: "border-red-200",
                  lc: "bg-red-50",
                },
              ].map((item) => (
                <div
                  key={item.g}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center shadow-sm ${item.bc} ${item.lc} font-normal text-black transition-all duration-300`}
                >
                  <div
                    className={`w-11 h-11 rounded-full ${item.c} text-white flex items-center justify-center text-lg font-medium mb-3 shadow-sm`}
                  >
                    {item.g}
                  </div>
                  <span className="text-[11px] md:text-[12px] font-normal text-black tracking-tighter line-height-none mb-2 text-left">
                    {item.r}
                  </span>
                  <span className="text-base font-normal uppercase tracking-widest leading-none text-black text-left">
                    {item.t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部管理指引 */}
        <section className="bg-blue-50/50 rounded-[2.5rem] p-10 border border-blue-100 relative overflow-hidden shadow-sm text-left font-normal text-black">
          <div className="absolute top-0 right-0 p-12 text-blue-100 opacity-20 rotate-12 text-left">
            <Activity size={200} />
          </div>
          <div className="relative z-10 max-w-4xl text-left font-normal text-black">
            <h3 className="text-xl font-semibold mb-8 text-blue-900 flex items-center gap-3 italic tracking-tight text-left">
              <ChevronRight
                size={24}
                className="text-blue-600 bg-white rounded-full p-1 shadow-sm text-left text-left"
              />
              關於 Cₐ 的管理意義
            </h3>
            <div className="grid md:grid-cols-2 gap-12 text-left font-normal text-black">
              <div className="space-y-4 font-normal text-black text-left">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm uppercase tracking-widest underline decoration-2 underline-offset-4 text-left">
                  準確度 (Accuracy)
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-normal text-black text-left">
                  Cₐ 反應的是 <strong>「系統偏移」</strong>。當規格中心值為 0
                  時，如果實測中心點偏離了
                  0，代表機器設備可能存在零點誤差或系統性偏差。這是改善品質時最優先且成本最低的對象。
                </p>
              </div>
              <div className="space-y-4 border-l border-blue-100 pl-8 font-normal text-black text-left">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-widest underline decoration-2 underline-offset-4 text-left">
                  精密度 (σ) 的影響
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-normal text-black text-left">
                  即使中心對得非常準 (Cₐ = 0%)，但如果您的精密度 (σ)
                  滑桿數值很高（曲線很胖），產品依然會溢出 LSL 宣稱的 USL
                  範圍。追求 Cₐ 的同時，也必須兼顧 Cₚ（散佈程度）。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-10 text-slate-400 text-[10px] font-normal tracking-widest uppercase border-t border-slate-100 text-left">
        Statistical Capability Analysis Education System © 2024
      </footer>
    </div>
  );
};

export default App;
