import { CanvasElement, CanvasFrame } from '../types/miro';

export interface AIGenerationRequest {
  type: 'brainstorm' | 'mindmap' | 'swot' | 'retro' | 'flowchart' | 'user_persona' | 'action_items';
  topic: string;
  count?: number;
}

export async function generateBoardWithAI(request: AIGenerationRequest): Promise<{
  elements: CanvasElement[];
  frames: CanvasFrame[];
  title: string;
}> {
  const { type, topic } = request;

  // Let's create smart contextual generators
  const baseTimestamp = Date.now();
  const frameId = `ai-gen-frame-${baseTimestamp}`;

  if (type === 'swot') {
    const frame: CanvasFrame = {
      id: frameId,
      title: `📊 Análise SWOT: ${topic}`,
      x: 100,
      y: 100,
      width: 1000,
      height: 700,
      backgroundColor: '#ffffff',
      borderColor: '#cbd5e1',
      zIndex: 0,
    };

    const elements: CanvasElement[] = [
      // S - Strengths
      {
        id: `swot-s-${baseTimestamp}`,
        type: 'shape',
        x: 140,
        y: 160,
        width: 440,
        height: 280,
        zIndex: 1,
        content: '💪 FORÇAS (Strengths)',
        style: {
          shapeType: 'rounded',
          backgroundColor: '#dcfce7',
          borderColor: '#86efac',
          borderWidth: 2,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#15803d',
          textAlign: 'center',
        },
        createdAt: baseTimestamp,
      },
      {
        id: `swot-s-note1-${baseTimestamp}`,
        type: 'sticky',
        x: 160,
        y: 220,
        width: 190,
        height: 120,
        zIndex: 2,
        content: `Know-how e agilidade na execução de ${topic}`,
        style: { backgroundColor: '#bbf7d0', color: '#166534', fontSize: 13 },
        createdAt: baseTimestamp,
      },
      {
        id: `swot-s-note2-${baseTimestamp}`,
        type: 'sticky',
        x: 370,
        y: 220,
        width: 190,
        height: 120,
        zIndex: 2,
        content: `Reconhecimento da marca e confiança dos clientes`,
        style: { backgroundColor: '#bbf7d0', color: '#166534', fontSize: 13 },
        createdAt: baseTimestamp,
      },

      // W - Weaknesses
      {
        id: `swot-w-${baseTimestamp}`,
        type: 'shape',
        x: 610,
        y: 160,
        width: 440,
        height: 280,
        zIndex: 1,
        content: '⚠️ FRAQUEZAS (Weaknesses)',
        style: {
          shapeType: 'rounded',
          backgroundColor: '#fee2e2',
          borderColor: '#fca5a5',
          borderWidth: 2,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#b91c1c',
          textAlign: 'center',
        },
        createdAt: baseTimestamp,
      },
      {
        id: `swot-w-note1-${baseTimestamp}`,
        type: 'sticky',
        x: 630,
        y: 220,
        width: 190,
        height: 120,
        zIndex: 2,
        content: `Dependência de processos manuais e pouca automação`,
        style: { backgroundColor: '#fecaca', color: '#991b1b', fontSize: 13 },
        createdAt: baseTimestamp,
      },
      {
        id: `swot-w-note2-${baseTimestamp}`,
        type: 'sticky',
        x: 840,
        y: 220,
        width: 190,
        height: 120,
        zIndex: 2,
        content: `Orçamento restrito para aquisição de novos canais`,
        style: { backgroundColor: '#fecaca', color: '#991b1b', fontSize: 13 },
        createdAt: baseTimestamp,
      },

      // O - Opportunities
      {
        id: `swot-o-${baseTimestamp}`,
        type: 'shape',
        x: 140,
        y: 470,
        width: 440,
        height: 280,
        zIndex: 1,
        content: '🚀 OPORTUNIDADES (Opportunities)',
        style: {
          shapeType: 'rounded',
          backgroundColor: '#e0f2fe',
          borderColor: '#7dd3fc',
          borderWidth: 2,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#0369a1',
          textAlign: 'center',
        },
        createdAt: baseTimestamp,
      },
      {
        id: `swot-o-note1-${baseTimestamp}`,
        type: 'sticky',
        x: 160,
        y: 530,
        width: 190,
        height: 120,
        zIndex: 2,
        content: `Expansão para novos nichos em demanda para ${topic}`,
        style: { backgroundColor: '#bae6fd', color: '#0369a1', fontSize: 13 },
        createdAt: baseTimestamp,
      },
      {
        id: `swot-o-note2-${baseTimestamp}`,
        type: 'sticky',
        x: 370,
        y: 530,
        width: 190,
        height: 120,
        zIndex: 2,
        content: `Parcerias B2B integradas e canais de afiliados`,
        style: { backgroundColor: '#bae6fd', color: '#0369a1', fontSize: 13 },
        createdAt: baseTimestamp,
      },

      // T - Threats
      {
        id: `swot-t-${baseTimestamp}`,
        type: 'shape',
        x: 610,
        y: 470,
        width: 440,
        height: 280,
        zIndex: 1,
        content: '🛡️ AMEAÇAS (Threats)',
        style: {
          shapeType: 'rounded',
          backgroundColor: '#fef3c7',
          borderColor: '#fcd34d',
          borderWidth: 2,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#b45309',
          textAlign: 'center',
        },
        createdAt: baseTimestamp,
      },
      {
        id: `swot-t-note1-${baseTimestamp}`,
        type: 'sticky',
        x: 630,
        y: 530,
        width: 190,
        height: 120,
        zIndex: 2,
        content: `Entrada de concorrentes com preços agressivos`,
        style: { backgroundColor: '#fef08a', color: '#854d0e', fontSize: 13 },
        createdAt: baseTimestamp,
      },
      {
        id: `swot-t-note2-${baseTimestamp}`,
        type: 'sticky',
        x: 840,
        y: 530,
        width: 190,
        height: 120,
        zIndex: 2,
        content: `Mudanças regulatórias ou fiscais no mercado`,
        style: { backgroundColor: '#fef08a', color: '#854d0e', fontSize: 13 },
        createdAt: baseTimestamp,
      },
    ];

    return {
      title: `SWOT - ${topic}`,
      frames: [frame],
      elements,
    };
  }

  if (type === 'mindmap') {
    const frame: CanvasFrame = {
      id: frameId,
      title: `🧠 Mapa Mental AI: ${topic}`,
      x: 100,
      y: 100,
      width: 1100,
      height: 700,
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      zIndex: 0,
    };

    const coreId = `core-${baseTimestamp}`;
    const b1Id = `branch-1-${baseTimestamp}`;
    const b2Id = `branch-2-${baseTimestamp}`;
    const b3Id = `branch-3-${baseTimestamp}`;
    const b4Id = `branch-4-${baseTimestamp}`;

    const elements: CanvasElement[] = [
      {
        id: coreId,
        type: 'shape',
        x: 500,
        y: 350,
        width: 220,
        height: 90,
        zIndex: 2,
        content: `🎯 ${topic}`,
        style: {
          shapeType: 'rounded',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: 16,
          textAlign: 'center',
        },
        createdAt: baseTimestamp,
      },
      {
        id: b1Id,
        type: 'sticky',
        x: 160,
        y: 200,
        width: 210,
        height: 130,
        zIndex: 2,
        content: `📌 Estratégia & Posicionamento\nDefinir proposta de valor única e diferenciais para ${topic}.`,
        style: { backgroundColor: '#fef08a', color: '#854d0e', fontSize: 13 },
        createdAt: baseTimestamp,
      },
      {
        id: b2Id,
        type: 'sticky',
        x: 160,
        y: 480,
        width: 210,
        height: 130,
        zIndex: 2,
        content: `⚡ Operações & Execução\nFluxos de trabalho escaláveis, automação e ferramentas de produtividade.`,
        style: { backgroundColor: '#bbf7d0', color: '#166534', fontSize: 13 },
        createdAt: baseTimestamp,
      },
      {
        id: b3Id,
        type: 'sticky',
        x: 820,
        y: 200,
        width: 210,
        height: 130,
        zIndex: 2,
        content: `📈 Métricas & OKRs\nIndicadores de sucesso, conversão e retenção a serem acompanhados.`,
        style: { backgroundColor: '#bae6fd', color: '#0369a1', fontSize: 13 },
        createdAt: baseTimestamp,
      },
      {
        id: b4Id,
        type: 'sticky',
        x: 820,
        y: 480,
        width: 210,
        height: 130,
        zIndex: 2,
        content: `💡 Experiência do Usuário\nFeedback contínuo, pesquisas e melhorias de usabilidade.`,
        style: { backgroundColor: '#fbcfe8', color: '#9d174d', fontSize: 13 },
        createdAt: baseTimestamp,
      },
      // Connectors
      {
        id: `c1-${baseTimestamp}`,
        type: 'connector',
        x: 370,
        y: 265,
        width: 130,
        height: 85,
        zIndex: 1,
        content: '',
        style: {
          sourceId: coreId,
          targetId: b1Id,
          sourceAnchor: 'left',
          targetAnchor: 'right',
          connectorType: 'curved',
          arrowEnd: 'arrow',
          strokeWidth: 2,
          color: '#64748b',
        },
        createdAt: baseTimestamp,
      },
      {
        id: `c2-${baseTimestamp}`,
        type: 'connector',
        x: 370,
        y: 440,
        width: 130,
        height: 40,
        zIndex: 1,
        content: '',
        style: {
          sourceId: coreId,
          targetId: b2Id,
          sourceAnchor: 'left',
          targetAnchor: 'right',
          connectorType: 'curved',
          arrowEnd: 'arrow',
          strokeWidth: 2,
          color: '#64748b',
        },
        createdAt: baseTimestamp,
      },
      {
        id: `c3-${baseTimestamp}`,
        type: 'connector',
        x: 720,
        y: 265,
        width: 100,
        height: 85,
        zIndex: 1,
        content: '',
        style: {
          sourceId: coreId,
          targetId: b3Id,
          sourceAnchor: 'right',
          targetAnchor: 'left',
          connectorType: 'curved',
          arrowEnd: 'arrow',
          strokeWidth: 2,
          color: '#64748b',
        },
        createdAt: baseTimestamp,
      },
      {
        id: `c4-${baseTimestamp}`,
        type: 'connector',
        x: 720,
        y: 440,
        width: 100,
        height: 40,
        zIndex: 1,
        content: '',
        style: {
          sourceId: coreId,
          targetId: b4Id,
          sourceAnchor: 'right',
          targetAnchor: 'left',
          connectorType: 'curved',
          arrowEnd: 'arrow',
          strokeWidth: 2,
          color: '#64748b',
        },
        createdAt: baseTimestamp,
      },
    ];

    return {
      title: `Mindmap - ${topic}`,
      frames: [frame],
      elements,
    };
  }

  // Default: Brainstorming Ideas
  const frame: CanvasFrame = {
    id: frameId,
    title: `💡 Brainstorming AI: ${topic}`,
    x: 100,
    y: 100,
    width: 1050,
    height: 650,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    zIndex: 0,
  };

  const colors = [
    { bg: '#fef08a', text: '#854d0e', tag: 'Ideia Central' },
    { bg: '#bbf7d0', text: '#166534', tag: 'Impacto Rápido' },
    { bg: '#bae6fd', text: '#0369a1', tag: 'Inovação' },
    { bg: '#fbcfe8', text: '#9d174d', tag: 'Estratégico' },
    { bg: '#fed7aa', text: '#9a3412', tag: 'Próximos Passos' },
    { bg: '#e9d5ff', text: '#6b21a8', tag: 'Diferencial' },
  ];

  const ideas = [
    `Automação orientada por dados para acelerar entregas de ${topic}`,
    `Criação de um playbook e esteira de capacitação para o time`,
    `Feedback loop semanal com os usuários finais e stakeholders`,
    `Gamificação e incentivos para engajar participantes`,
    `Dashboard unificado com métricas de impacto em tempo real`,
    `Integração nativa com ferramentas líderes de mercado`,
  ];

  const elements: CanvasElement[] = [
    {
      id: `ai-head-${baseTimestamp}`,
      type: 'text',
      x: 140,
      y: 140,
      width: 800,
      height: 40,
      zIndex: 1,
      content: `✨ Ideias Geradas para: ${topic}`,
      style: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
      },
      createdAt: baseTimestamp,
    },
    ...ideas.map((ideaText, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const colorScheme = colors[i % colors.length];

      return {
        id: `ai-note-${i}-${baseTimestamp}`,
        type: 'sticky' as const,
        x: 140 + col * 280,
        y: 210 + row * 200,
        width: 250,
        height: 170,
        zIndex: 2,
        content: ideaText,
        style: {
          backgroundColor: colorScheme.bg,
          color: colorScheme.text,
          fontSize: 14,
          author: 'Miro AI',
          tags: [colorScheme.tag],
          votes: Math.floor(Math.random() * 5) + 1,
        },
        reactions: [{ emoji: '🔥', count: Math.floor(Math.random() * 4) + 1, users: ['G2 midias'] }],
        createdAt: baseTimestamp + i,
      };
    }),
  ];

  return {
    title: `Brainstorm - ${topic}`,
    frames: [frame],
    elements,
  };
}
