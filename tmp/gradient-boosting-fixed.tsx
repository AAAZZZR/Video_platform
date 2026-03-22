// DURATION: 1800
// NARRATION: 機器學習梯度提升樹的訓練過程是一種強大的集成學習方法。我們從初始化開始，建立一個簡單的預測模型。然後計算預測誤差，這些誤差被稱為殘差。接著訓練第一個決策樹來預測這些殘差。將樹的預測結果加入到模型中，更新整體預測。再次計算新的殘差，並訓練下一個樹。這個過程持續進行，每次迭代都會減少預測誤差。通過梯度下降優化，我們找到最佳的權重和參數。最終的模型是所有樹的加權組合，能夠處理複雜的非線性關係。這種方法在許多機器學習競賽中都表現優秀，是數據科學家的重要工具。

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import { Audio } from '@remotion/media';
import { whoosh, mouseClick, ding } from '@remotion/sfx';

export default function MLGradientBoostingVideo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      <Sequence from={0} durationInFrames={120}>
        <TitleSection />
        <Audio src={whoosh} volume={0.3} />
      </Sequence>

      <Sequence from={120} durationInFrames={120}>
        <InitialDataSection />
      </Sequence>

      <Sequence from={240} durationInFrames={120}>
        <InitialModelSection />
        <Audio src={mouseClick} volume={0.2} />
      </Sequence>

      <Sequence from={360} durationInFrames={120}>
        <ResidualsSection />
      </Sequence>

      <Sequence from={480} durationInFrames={120}>
        <FirstTreeSection />
        <Audio src={ding} volume={0.25} />
      </Sequence>

      <Sequence from={600} durationInFrames={120}>
        <UpdateModelSection />
      </Sequence>

      <Sequence from={720} durationInFrames={120}>
        <SecondIterationSection />
      </Sequence>

      <Sequence from={840} durationInFrames={120}>
        <TreeBuildingSection />
      </Sequence>

      <Sequence from={960} durationInFrames={120}>
        <GradientDescentSection />
      </Sequence>

      <Sequence from={1080} durationInFrames={120}>
        <MultipleTreesSection />
        <Audio src={whoosh} volume={0.2} />
      </Sequence>

      <Sequence from={1200} durationInFrames={120}>
        <EnsembleModelSection />
      </Sequence>

      <Sequence from={1320} durationInFrames={120}>
        <PerformanceSection />
      </Sequence>

      <Sequence from={1440} durationInFrames={120}>
        <OverfittingSection />
      </Sequence>

      <Sequence from={1560} durationInFrames={120}>
        <FinalModelSection />
      </Sequence>

      <Sequence from={1680} durationInFrames={120}>
        <ApplicationsSection />
        <Audio src={ding} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
}

function TitleSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 }
  });

  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const particlePositions = Array.from({ length: 20 }, (_, i) => ({
    x: Math.sin(frame * 0.02 + i) * 100 + 960,
    y: Math.cos(frame * 0.015 + i * 2) * 50 + 300,
    opacity: interpolate(frame, [60 + i * 2, 120], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  }));

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {particlePositions.map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: '#4f46e5',
            opacity: pos.opacity
          }}
        />
      ))}

      <div style={{
        fontSize: 72,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transform: `scale(${titleScale})`,
        marginBottom: 40
      }}>
        梯度提升樹
      </div>

      <div style={{
        fontSize: 36,
        color: '#94a3b8',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: subtitleOpacity
      }}>
        機器學習訓練過程
      </div>
    </AbsoluteFill>
  );
}

function InitialDataSection() {
  const frame = useCurrentFrame();

  const dataPoints = Array.from({ length: 50 }, (_, i) => ({
    x: 200 + (i % 10) * 150,
    y: 200 + Math.floor(i / 10) * 80 + Math.sin(i * 0.5) * 20,
    appear: interpolate(frame, [i * 2, i * 2 + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  }));

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ padding: 80 }}>
      <div style={{
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 60,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: titleOpacity
      }}>
        1. 初始化數據集
      </div>

      {dataPoints.map((point, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: point.x,
            top: point.y,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#06d6a0',
            opacity: point.appear,
            transform: `scale(${point.appear})`
          }}
        />
      ))}

      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 80,
        fontSize: 24,
        color: '#94a3b8',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      }}>
        訓練數據: {Math.floor(interpolate(frame, [60, 120], [0, 50], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))} 個樣本
      </div>
    </AbsoluteFill>
  );
}

function InitialModelSection() {
  const frame = useCurrentFrame();

  const modelOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lineProgress = interpolate(frame, [40, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const equationOpacity = interpolate(frame, [80, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 80,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: modelOpacity
      }}>
        2. 初始模型 F₀(x)
      </div>

      <svg width={600} height={400} style={{ opacity: modelOpacity }}>
        {Array.from({ length: 11 }, (_, i) => (
          <g key={i}>
            <line x1={i * 60} y1={0} x2={i * 60} y2={400} stroke="#374151" strokeWidth={1} opacity={0.3} />
            <line x1={0} y1={i * 40} x2={600} y2={i * 40} stroke="#374151" strokeWidth={1} opacity={0.3} />
          </g>
        ))}

        <line
          x1={0}
          y1={200}
          x2={600 * lineProgress}
          y2={200}
          stroke="#4f46e5"
          strokeWidth={4}
          fill="none"
        />

        <text x={300} y={230} textAnchor="middle" fill="#4f46e5" fontSize={18} fontWeight="bold">
          初始預測 = 平均值
        </text>
      </svg>

      <div style={{
        fontSize: 32,
        color: '#94a3b8',
        fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
        opacity: equationOpacity,
        backgroundColor: '#1f2937',
        padding: 20,
        borderRadius: 8,
        marginTop: 40
      }}>
        F₀(x) = arg min Σ L(yᵢ, γ)
      </div>
    </AbsoluteFill>
  );
}

function ResidualsSection() {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const arrowProgress = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const residualOpacity = interpolate(frame, [70, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const residuals = Array.from({ length: 8 }, (_, i) => ({
    x: 150 + i * 100,
    y: 300,
    height: (Math.sin(i * 0.8) * 50 + 60) * residualOpacity,
    color: Math.sin(i * 0.8) > 0 ? '#ef4444' : '#06d6a0'
  }));

  return (
    <AbsoluteFill style={{ padding: 80 }}>
      <div style={{
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 60,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: titleOpacity
      }}>
        3. 計算殘差 (誤差)
      </div>

      <svg width={1000} height={500}>
        <line x1={100} y1={200} x2={900} y2={200} stroke="#4f46e5" strokeWidth={3} />
        <text x={500} y={190} textAnchor="middle" fill="#4f46e5" fontSize={16}>預測值</text>

        {residuals.map((residual, i) => (
          <g key={i}>
            <circle cx={residual.x} cy={residual.y - residual.height} r={6} fill="#ffffff" />

            <line
              x1={residual.x}
              y1={200}
              x2={residual.x}
              y2={200 + (residual.y - residual.height - 200) * arrowProgress}
              stroke={residual.color}
              strokeWidth={3}
            />

            <text
              x={residual.x + 15}
              y={residual.y - residual.height / 2}
              fill={residual.color}
              fontSize={14}
              fontWeight="bold"
              opacity={residualOpacity}
            >
              r{i + 1}
            </text>
          </g>
        ))}
      </svg>

      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 80,
        fontSize: 24,
        color: '#94a3b8',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: residualOpacity
      }}>
        殘差 = 實際值 - 預測值
      </div>
    </AbsoluteFill>
  );
}

function FirstTreeSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const treeGrowth = interpolate(frame, [0, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const leafOpacity = interpolate(frame, [80, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 40,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        4. 訓練第一個決策樹 h₁(x)
      </div>

      <svg width={800} height={500}>
        <line x1={400} y1={450} x2={400} y2={450 - 100 * treeGrowth} stroke="#8b5cf6" strokeWidth={8} />

        {treeGrowth > 0.3 && (
          <line
            x1={400} y1={350}
            x2={400 - 150 * Math.min((treeGrowth - 0.3) / 0.4, 1)}
            y2={350 - 80 * Math.min((treeGrowth - 0.3) / 0.4, 1)}
            stroke="#8b5cf6" strokeWidth={6}
          />
        )}

        {treeGrowth > 0.3 && (
          <line
            x1={400} y1={350}
            x2={400 + 150 * Math.min((treeGrowth - 0.3) / 0.4, 1)}
            y2={350 - 80 * Math.min((treeGrowth - 0.3) / 0.4, 1)}
            stroke="#8b5cf6" strokeWidth={6}
          />
        )}

        {treeGrowth > 0.5 && (
          <g>
            <rect x={370} y={330} width={60} height={40} fill="#4f46e5" rx={8} opacity={leafOpacity} />
            <text x={400} y={355} textAnchor="middle" fill="white" fontSize={14} opacity={leafOpacity}>x₁ ≤ 5</text>
          </g>
        )}

        {treeGrowth > 0.7 && (
          <g>
            <circle cx={250} cy={270} r={25} fill="#06d6a0" opacity={leafOpacity} />
            <text x={250} y={275} textAnchor="middle" fill="white" fontSize={12} fontWeight="bold" opacity={leafOpacity}>+0.3</text>
            <circle cx={550} cy={270} r={25} fill="#ef4444" opacity={leafOpacity} />
            <text x={550} y={275} textAnchor="middle" fill="white" fontSize={12} fontWeight="bold" opacity={leafOpacity}>-0.2</text>
            <text x={250} y={310} textAnchor="middle" fill="#06d6a0" fontSize={16} opacity={leafOpacity}>是</text>
            <text x={550} y={310} textAnchor="middle" fill="#ef4444" fontSize={16} opacity={leafOpacity}>否</text>
          </g>
        )}
      </svg>

      <div style={{
        fontSize: 24,
        color: '#94a3b8',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: leafOpacity,
        textAlign: 'center'
      }}>
        針對殘差進行分割，找出最佳預測
      </div>
    </AbsoluteFill>
  );
}

function UpdateModelSection() {
  const frame = useCurrentFrame();

  const equationOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const combineOpacity = interpolate(frame, [40, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const resultOpacity = interpolate(frame, [80, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 80,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: equationOpacity
      }}>
        5. 更新模型
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 40,
        marginBottom: 60,
        opacity: combineOpacity
      }}>
        <div style={{
          fontSize: 36,
          color: '#4f46e5',
          fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
          backgroundColor: '#1f2937',
          padding: 20,
          borderRadius: 8
        }}>
          F₀(x)
        </div>
        <div style={{ fontSize: 48, color: '#ffffff' }}>+</div>
        <div style={{
          fontSize: 36,
          color: '#8b5cf6',
          fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
          backgroundColor: '#1f2937',
          padding: 20,
          borderRadius: 8
        }}>
          α₁ · h₁(x)
        </div>
        <div style={{ fontSize: 48, color: '#ffffff' }}>=</div>
        <div style={{
          fontSize: 36,
          color: '#06d6a0',
          fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
          backgroundColor: '#1f2937',
          padding: 20,
          borderRadius: 8,
          opacity: resultOpacity
        }}>
          F₁(x)
        </div>
      </div>

      <div style={{
        fontSize: 24,
        color: '#94a3b8',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: 1.6,
        opacity: resultOpacity
      }}>
        α₁ 是學習率，控制每次更新的步長
      </div>

      <div style={{ marginTop: 60, opacity: resultOpacity }}>
        <div style={{
          width: 400, height: 20, backgroundColor: '#374151', borderRadius: 10, overflow: 'hidden'
        }}>
          <div style={{
            width: `${interpolate(frame, [80, 120], [0, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`,
            height: '100%',
            backgroundColor: '#06d6a0',
            borderRadius: 10
          }} />
        </div>
        <div style={{
          fontSize: 18, color: '#94a3b8', textAlign: 'center', marginTop: 10,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          學習率 α = 0.1
        </div>
      </div>
    </AbsoluteFill>
  );
}

function SecondIterationSection() {
  const frame = useCurrentFrame();

  const iterationOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cycleProgress = interpolate(frame, [30, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const steps = [
    { label: 'r₂', sub: '計算新殘差', color: '#ef4444', threshold: 0 },
    { label: 'h₂', sub: '訓練新樹', color: '#8b5cf6', threshold: 0.3 },
    { label: 'F₂', sub: '更新模型', color: '#06d6a0', threshold: 0.6 },
  ];

  return (
    <AbsoluteFill style={{ padding: 80 }}>
      <div style={{
        fontSize: 48, fontWeight: 'bold', color: '#ffffff', marginBottom: 60,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: iterationOpacity
      }}>
        6. 第二次迭代
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 400 }}>
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ fontSize: 48, color: '#4f46e5', opacity: cycleProgress > step.threshold ? 1 : 0.3 }}>→</div>
            )}
            <div style={{
              textAlign: 'center',
              opacity: cycleProgress > step.threshold ? 1 : 0.3,
              transform: `scale(${cycleProgress > step.threshold ? 1 + Math.sin(frame * 0.2 + i) * 0.05 : 1})`
            }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%', backgroundColor: step.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 24, fontWeight: 'bold', color: '#fff'
              }}>
                {step.label}
              </div>
              <div style={{ fontSize: 18, color: '#94a3b8', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                {step.sub}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div style={{
        position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)',
        fontSize: 24, color: '#94a3b8',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: cycleProgress > 0.8 ? 1 : 0, textAlign: 'center'
      }}>
        重複此過程，直到達到停止條件
      </div>
    </AbsoluteFill>
  );
}

function TreeBuildingSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const trees = Array.from({ length: 5 }, (_, i) => ({
    opacity: interpolate(frame, [i * 20, i * 20 + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    scale: spring({ frame: Math.max(0, frame - i * 20), fps, config: { damping: 100, stiffness: 200 } })
  }));

  const bottomOpacity = interpolate(frame, [80, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ padding: 80 }}>
      <div style={{
        fontSize: 48, fontWeight: 'bold', color: '#ffffff', marginBottom: 60,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        7. 構建決策樹序列
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 400, marginTop: 40 }}>
        {trees.map((tree, i) => (
          <div key={i} style={{ textAlign: 'center', opacity: tree.opacity, transform: `scale(${tree.scale})` }}>
            <svg width={120} height={150}>
              <line x1={60} y1={140} x2={60} y2={100} stroke="#8b5cf6" strokeWidth={4} />
              <line x1={60} y1={100} x2={30} y2={70} stroke="#8b5cf6" strokeWidth={3} />
              <line x1={60} y1={100} x2={90} y2={70} stroke="#8b5cf6" strokeWidth={3} />
              <circle cx={60} cy={100} r={8} fill="#4f46e5" />
              <circle cx={30} cy={70} r={6} fill="#06d6a0" />
              <circle cx={90} cy={70} r={6} fill="#ef4444" />
            </svg>
            <div style={{ fontSize: 18, color: '#94a3b8', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Tree {i + 1}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)',
        fontSize: 24, color: '#94a3b8',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: bottomOpacity
      }}>
        每棵樹都針對前一棵的殘差進行學習
      </div>
    </AbsoluteFill>
  );
}

function GradientDescentSection() {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ballX = interpolate(frame, [20, 110], [100, 500], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const curvePoints = Array.from({ length: 50 }, (_, i) => {
    const x = 100 + i * 12;
    const t = (x - 100) / 500;
    const y = 350 - 200 * t + 150 * Math.pow(t - 0.7, 2);
    return `${x},${y}`;
  }).join(' ');

  const ballT = (ballX - 100) / 500;
  const ballY = 350 - 200 * ballT + 150 * Math.pow(ballT - 0.7, 2);
  const trailOpacity = interpolate(frame, [40, 80], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        fontSize: 48, fontWeight: 'bold', color: '#ffffff', marginBottom: 40,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: titleOpacity
      }}>
        8. 梯度下降優化
      </div>

      <svg width={800} height={500}>
        <polyline points={curvePoints} fill="none" stroke="#4f46e5" strokeWidth={3} />
        <circle cx={ballX} cy={ballY} r={12} fill="#ef4444" />
        <text x={ballX} y={ballY - 20} textAnchor="middle" fill="#ef4444" fontSize={14} fontWeight="bold">Loss</text>

        {Array.from({ length: 5 }, (_, i) => {
          const px = interpolate(i, [0, 4], [120, ballX - 20], {});
          const pt = (px - 100) / 500;
          const py = 350 - 200 * pt + 150 * Math.pow(pt - 0.7, 2);
          return <circle key={i} cx={px} cy={py} r={4} fill="#ef4444" opacity={trailOpacity} />;
        })}

        <line x1={100} y1={450} x2={700} y2={450} stroke="#374151" strokeWidth={2} />
        <line x1={100} y1={450} x2={100} y2={100} stroke="#374151" strokeWidth={2} />
        <text x={400} y={490} textAnchor="middle" fill="#94a3b8" fontSize={16}>迭代次數</text>
        <text x={60} y={280} textAnchor="middle" fill="#94a3b8" fontSize={16} transform="rotate(-90, 60, 280)">損失值</text>
      </svg>

      <div style={{
        fontSize: 24, color: '#94a3b8', textAlign: 'center', marginTop: 20,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      }}>
        沿負梯度方向逐步降低損失函數
      </div>
    </AbsoluteFill>
  );
}

function MultipleTreesSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const treeCount = Math.floor(interpolate(frame, [20, 100], [0, 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  return (
    <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        fontSize: 48, fontWeight: 'bold', color: '#ffffff', marginBottom: 40,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: titleOpacity
      }}>
        9. 多棵樹的累積
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 30, marginTop: 40 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const appear = spring({ frame: Math.max(0, frame - i * 8 - 20), fps, config: { damping: 100, stiffness: 200 } });
          return (
            <div key={i} style={{ opacity: i < treeCount ? appear : 0.15, transform: `scale(${i < treeCount ? appear : 0.8})`, textAlign: 'center' }}>
              <svg width={80} height={100}>
                <line x1={40} y1={90} x2={40} y2={60} stroke="#8b5cf6" strokeWidth={3} />
                <line x1={40} y1={60} x2={20} y2={40} stroke="#8b5cf6" strokeWidth={2} />
                <line x1={40} y1={60} x2={60} y2={40} stroke="#8b5cf6" strokeWidth={2} />
                <circle cx={40} cy={60} r={6} fill="#4f46e5" />
                <circle cx={20} cy={40} r={4} fill="#06d6a0" />
                <circle cx={60} cy={40} r={4} fill="#ef4444" />
              </svg>
              <div style={{ fontSize: 14, color: '#94a3b8', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                h{i + 1}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        fontSize: 28, color: '#06d6a0', marginTop: 60, textAlign: 'center',
        fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
        opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      }}>
        F(x) = F₀ + α₁h₁ + α₂h₂ + ... + α{treeCount}h{treeCount}
      </div>
    </AbsoluteFill>
  );
}

function EnsembleModelSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const mergeProgress = interpolate(frame, [30, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const resultScale = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 100, stiffness: 150 } });

  const treePositions = Array.from({ length: 5 }, (_, i) => ({
    startX: 200 + i * 150,
    startY: 200,
    endX: 500,
    endY: 400,
  }));

  return (
    <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        fontSize: 48, fontWeight: 'bold', color: '#ffffff', marginBottom: 40,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: titleOpacity
      }}>
        10. 集成模型
      </div>

      <svg width={1000} height={500}>
        {treePositions.map((pos, i) => {
          const cx = interpolate(mergeProgress, [0, 1], [pos.startX, pos.endX], {});
          const cy = interpolate(mergeProgress, [0, 1], [pos.startY, pos.endY], {});
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={30} fill="#4f46e5" opacity={0.7} />
              <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize={14} fontWeight="bold">h{i + 1}</text>
            </g>
          );
        })}

        <circle cx={500} cy={400} r={50 * resultScale} fill="#06d6a0" opacity={resultScale * 0.9} />
        <text x={500} y={410} textAnchor="middle" fill="white" fontSize={20} fontWeight="bold" opacity={resultScale}>
          F(x)
        </text>
      </svg>

      <div style={{
        fontSize: 24, color: '#94a3b8', textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: interpolate(frame, [90, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      }}>
        所有弱學習器加權組合成強學習器
      </div>
    </AbsoluteFill>
  );
}

function PerformanceSection() {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const barProgress = interpolate(frame, [30, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const metrics = [
    { label: '準確率', value: 95, color: '#06d6a0' },
    { label: '精確率', value: 92, color: '#4f46e5' },
    { label: '召回率', value: 89, color: '#8b5cf6' },
    { label: 'F1 分數', value: 90, color: '#f59e0b' },
  ];

  return (
    <AbsoluteFill style={{ padding: 80 }}>
      <div style={{
        fontSize: 48, fontWeight: 'bold', color: '#ffffff', marginBottom: 60,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: titleOpacity
      }}>
        11. 模型性能
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, marginTop: 40, padding: '0 100px' }}>
        {metrics.map((metric, i) => {
          const delay = i * 0.15;
          const progress = Math.max(0, Math.min(1, (barProgress - delay) / (1 - delay)));
          return (
            <div key={i}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', marginBottom: 10,
                fontSize: 24, color: '#ffffff',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                <span>{metric.label}</span>
                <span style={{ color: metric.color }}>{Math.floor(metric.value * progress)}%</span>
              </div>
              <div style={{ width: '100%', height: 30, backgroundColor: '#1f2937', borderRadius: 15, overflow: 'hidden' }}>
                <div style={{
                  width: `${metric.value * progress}%`,
                  height: '100%',
                  backgroundColor: metric.color,
                  borderRadius: 15,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function OverfittingSection() {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const drawProgress = interpolate(frame, [20, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const warningOpacity = interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const numPoints = Math.floor(drawProgress * 30);

  return (
    <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        fontSize: 48, fontWeight: 'bold', color: '#ffffff', marginBottom: 40,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: titleOpacity
      }}>
        12. 防止過擬合
      </div>

      <svg width={800} height={400}>
        <line x1={80} y1={350} x2={750} y2={350} stroke="#374151" strokeWidth={2} />
        <line x1={80} y1={350} x2={80} y2={50} stroke="#374151" strokeWidth={2} />
        <text x={400} y={390} textAnchor="middle" fill="#94a3b8" fontSize={14}>樹的數量</text>
        <text x={40} y={200} textAnchor="middle" fill="#94a3b8" fontSize={14} transform="rotate(-90, 40, 200)">誤差</text>

        {Array.from({ length: numPoints }, (_, i) => {
          const x = 100 + i * 22;
          const trainY = 300 - i * 8 - Math.sin(i * 0.3) * 5;
          const testY = 300 - i * 6 + (i > 15 ? (i - 15) * 4 : 0) + Math.sin(i * 0.5) * 3;
          return (
            <g key={i}>
              {i > 0 && <line x1={100 + (i - 1) * 22} y1={300 - (i - 1) * 8 - Math.sin((i - 1) * 0.3) * 5} x2={x} y2={trainY} stroke="#06d6a0" strokeWidth={3} />}
              {i > 0 && <line x1={100 + (i - 1) * 22} y1={300 - (i - 1) * 6 + ((i - 1) > 15 ? ((i - 1) - 15) * 4 : 0) + Math.sin((i - 1) * 0.5) * 3} x2={x} y2={testY} stroke="#ef4444" strokeWidth={3} />}
            </g>
          );
        })}

        <rect x={550} y={80} width={16} height={16} fill="#06d6a0" />
        <text x={575} y={93} fill="#94a3b8" fontSize={14}>訓練誤差</text>
        <rect x={550} y={110} width={16} height={16} fill="#ef4444" />
        <text x={575} y={123} fill="#94a3b8" fontSize={14}>測試誤差</text>
      </svg>

      <div style={{
        fontSize: 24, color: '#f59e0b', textAlign: 'center', marginTop: 20,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: warningOpacity
      }}>
        使用早停法、正則化和學習率調整來防止過擬合
      </div>
    </AbsoluteFill>
  );
}

function FinalModelSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 200, stiffness: 100 } });
  const glowPulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

  const params = [
    { label: '樹的數量', value: '100', delay: 20 },
    { label: '最大深度', value: '6', delay: 35 },
    { label: '學習率', value: '0.1', delay: 50 },
    { label: '子採樣', value: '0.8', delay: 65 },
  ];

  return (
    <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        fontSize: 56, fontWeight: 'bold', color: '#06d6a0', textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transform: `scale(${titleScale})`, marginBottom: 60,
        textShadow: `0 0 ${30 * glowPulse}px rgba(6, 214, 160, 0.5)`
      }}>
        13. 最終模型
      </div>

      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
        {params.map((param, i) => {
          const appear = spring({ frame: Math.max(0, frame - param.delay), fps, config: { damping: 100, stiffness: 200 } });
          return (
            <div key={i} style={{
              backgroundColor: '#1f2937', borderRadius: 12, padding: '20px 30px',
              textAlign: 'center', opacity: appear, transform: `scale(${appear})`
            }}>
              <div style={{ fontSize: 18, color: '#94a3b8', marginBottom: 8, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                {param.label}
              </div>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#4f46e5', fontFamily: '"SF Mono", "Fira Code", Consolas, monospace' }}>
                {param.value}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        fontSize: 24, color: '#94a3b8', textAlign: 'center', marginTop: 60,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      }}>
        F(x) = Σ αₘ · hₘ(x) — 所有樹的加權組合
      </div>
    </AbsoluteFill>
  );
}

function ApplicationsSection() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const apps = [
    { icon: '📊', label: '金融預測', color: '#06d6a0' },
    { icon: '🏥', label: '醫療診斷', color: '#4f46e5' },
    { icon: '🎯', label: '推薦系統', color: '#8b5cf6' },
    { icon: '🔍', label: '異常檢測', color: '#f59e0b' },
  ];

  const closingOpacity = interpolate(frame, [90, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        fontSize: 48, fontWeight: 'bold', color: '#ffffff', marginBottom: 60,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: titleOpacity
      }}>
        14. 應用場景
      </div>

      <div style={{ display: 'flex', gap: 50, justifyContent: 'center' }}>
        {apps.map((app, i) => {
          const appear = spring({ frame: Math.max(0, frame - 20 - i * 15), fps, config: { damping: 100, stiffness: 200 } });
          return (
            <div key={i} style={{
              textAlign: 'center', opacity: appear, transform: `scale(${appear})`
            }}>
              <div style={{
                width: 120, height: 120, borderRadius: 20, backgroundColor: '#1f2937',
                border: `2px solid ${app.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 48, marginBottom: 16
              }}>
                {app.icon}
              </div>
              <div style={{
                fontSize: 20, color: app.color, fontWeight: 'bold',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                {app.label}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        fontSize: 32, fontWeight: 'bold', color: '#06d6a0', marginTop: 80, textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: closingOpacity
      }}>
        梯度提升樹 — 數據科學家的重要工具
      </div>
    </AbsoluteFill>
  );
}
