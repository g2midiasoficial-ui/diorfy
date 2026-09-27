import React, { useState } from 'react';
import {
  Network,
  X,
  Sparkles,
  Layers,
  Wand2,
  Check,
  Zap,
  RefreshCw,
  GitBranch,
  FolderTree,
  Compass,
  Fish,
  Grid,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { CanvasElement, ShapeType } from '../../types/miro';
import { playSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface MindmapStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertMindmapToCanvas: (elements: CanvasElement[]) => void;
}

export type MindmapLayoutType =
  | 'radial'
  | 'horizontal'
  | 'topdown'
  | 'ishikawa'
  | 'swot'
  | 'cx_journey';

export const MindmapStudio: React.FC<MindmapStudioProps> = ({
  isOpen,
  onClose,
  onInsertMindmapToCanvas,
}) => {
  const [topic, setTopic] = useState('Estratégia de Lançamento Digital 2026');
  const [layoutStyle, setLayoutStyle] = useState<MindmapLayoutType>('radial');
  const [colorTheme, setColorTheme] = useState<'vibrant' | 'tech' | 'emerald' | 'sunset' | 'dark' | 'neon'>('vibrant');
  const [depth, setDepth] = useState<2 | 3 | 4>(3);
  const [nodeShape, setNodeShape] = useState<ShapeType>('pill');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const quickTemplates = [
    { title: 'Lançamento de Produto', topic: 'Roadmap de Lançamento de Produto SaaS 2026', layout: 'radial' as const, theme: 'vibrant' as const },
    { title: 'Espinha de Peixe (Ishikawa)', topic: 'Análise de Causa Raiz: Queda de Conversão no Checkout', layout: 'ishikawa' as const, theme: 'sunset' as const },
    { title: 'Matriz SWOT Estratégica', topic: 'Análise SWOT: Expansão Internacional da Startup', layout: 'swot' as const, theme: 'emerald' as const },
    { title: 'Jornada do Cliente (CX)', topic: 'Mapeamento da Jornada e Experiência do Usuário (Onboarding ao Sucesso)', layout: 'cx_journey' as const, theme: 'tech' as const },
    { title: 'Arquitetura de Software', topic: 'Estrutura de Microsserviços, Banco de Dados & Cloud API', layout: 'horizontal' as const, theme: 'tech' as const },
    { title: 'Organograma da Equipe', topic: 'Estrutura Organizacional e Lideranças de Squads', layout: 'topdown' as const, theme: 'dark' as const },
  ];

  const themeColors = {
    vibrant: {
      rootBg: '#4f46e5',
      rootBorder: '#3730a3',
      rootText: '#ffffff',
      branches: [
        { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', line: '#ef4444' },
        { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', line: '#f59e0b' },
        { bg: '#dcfce7', border: '#22c55e', text: '#166534', line: '#22c55e' },
        { bg: '#e0e7ff', border: '#6366f1', text: '#3730a3', line: '#6366f1' },
        { bg: '#f3e8ff', border: '#a855f7', text: '#6b21a8', line: '#a855f7' },
        { bg: '#ffedd5', border: '#ea580c', text: '#9a3412', line: '#ea580c' },
      ],
    },
    tech: {
      rootBg: '#0284c7',
      rootBorder: '#0369a1',
      rootText: '#ffffff',
      branches: [
        { bg: '#e0f2fe', border: '#0284c7', text: '#075985', line: '#0284c7' },
        { bg: '#f0fdf4', border: '#16a34a', text: '#15803d', line: '#16a34a' },
        { bg: '#fdf4ff', border: '#c026d3', text: '#86198f', line: '#c026d3' },
        { bg: '#faf5ff', border: '#9333ea', text: '#6b21a8', line: '#9333ea' },
        { bg: '#ecfeff', border: '#06b6d4', text: '#0e7490', line: '#06b6d4' },
        { bg: '#fef2f2', border: '#f43f5e', text: '#9f1239', line: '#f43f5e' },
      ],
    },
    emerald: {
      rootBg: '#059669',
      rootBorder: '#047857',
      rootText: '#ffffff',
      branches: [
        { bg: '#d1fae5', border: '#10b981', text: '#065f46', line: '#10b981' },
        { bg: '#ecfdf5', border: '#059669', text: '#047857', line: '#059669' },
        { bg: '#fef9c3', border: '#eab308', text: '#854d0e', line: '#eab308' },
        { bg: '#ffedd5', border: '#f97316', text: '#9a3412', line: '#f97316' },
        { bg: '#e0e7ff', border: '#4f46e5', text: '#3730a3', line: '#4f46e5' },
        { bg: '#fce7f3', border: '#db2777', text: '#9d174d', line: '#db2777' },
      ],
    },
    sunset: {
      rootBg: '#ea580c',
      rootBorder: '#c2410c',
      rootText: '#ffffff',
      branches: [
        { bg: '#ffedd5', border: '#ea580c', text: '#9a3412', line: '#ea580c' },
        { bg: '#fce7f3', border: '#ec4899', text: '#9d174d', line: '#ec4899' },
        { bg: '#ede9fe', border: '#8b5cf6', text: '#5b21b6', line: '#8b5cf6' },
        { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', line: '#ef4444' },
        { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', line: '#f59e0b' },
        { bg: '#e0f2fe', border: '#0284c7', text: '#075985', line: '#0284c7' },
      ],
    },
    dark: {
      rootBg: '#0f172a',
      rootBorder: '#38bdf8',
      rootText: '#ffffff',
      branches: [
        { bg: '#1e293b', border: '#38bdf8', text: '#f8fafc', line: '#38bdf8' },
        { bg: '#1e293b', border: '#a855f7', text: '#f8fafc', line: '#a855f7' },
        { bg: '#1e293b', border: '#34d399', text: '#f8fafc', line: '#34d399' },
        { bg: '#1e293b', border: '#fbbf24', text: '#f8fafc', line: '#fbbf24' },
        { bg: '#1e293b', border: '#f43f5e', text: '#f8fafc', line: '#f43f5e' },
        { bg: '#1e293b', border: '#06b6d4', text: '#f8fafc', line: '#06b6d4' },
      ],
    },
    neon: {
      rootBg: '#581c87',
      rootBorder: '#ec4899',
      rootText: '#ffffff',
      branches: [
        { bg: '#fae8ff', border: '#d946ef', text: '#701a75', line: '#d946ef' },
        { bg: '#cffafe', border: '#06b6d4', text: '#155e75', line: '#06b6d4' },
        { bg: '#dcfce7', border: '#10b981', text: '#065f46', line: '#10b981' },
        { bg: '#fef3c7', border: '#f59e0b', text: '#78350f', line: '#f59e0b' },
        { bg: '#fee2e2', border: '#f43f5e', text: '#881337', line: '#f43f5e' },
        { bg: '#e0e7ff', border: '#6366f1', text: '#312e81', line: '#6366f1' },
      ],
    },
  };

  // Generate branch hierarchy based on topic and layout
  const generateBranchesData = (customTopic: string, layout: MindmapLayoutType) => {
    const t = customTopic.toLowerCase();

    if (layout === 'ishikawa') {
      return [
        { title: '⚙️ 1. Método & Processos', sub: ['Falta de Padrão Operacional', 'Etapas Burocráticas', 'Gargalos no Fluxo'] },
        { title: '💻 2. Tecnologia & Ferramentas', sub: ['Instabilidade do Servidor', 'UX/UI Confusa', 'Falta de Integração API'] },
        { title: '👥 3. Pessoas & Equipe', sub: ['Treinamento Insuficiente', 'Sobrecarga de Tarefas', 'Comunicação Falha'] },
        { title: '📦 4. Materiais & Insumos', sub: ['Assets Desatualizados', 'Documentação Escassa', 'Falta de Recursos'] },
        { title: '📏 5. Métricas & Medição', sub: ['KPIs Não Acompanhados', 'Dados Imprecisos', 'Falta de Alertas'] },
        { title: '🌍 6. Ambiente & Contexto', sub: ['Mudanças de Mercado', 'Ações de Concorrentes', 'Sazonalidade'] },
      ];
    }

    if (layout === 'swot') {
      return [
        { title: '💪 FORÇAS (Strengths)', sub: ['Tecnologia Proprietária', 'Equipe Altamente Qualificada', 'Agilidade de Execução'] },
        { title: '🚀 OPORTUNIDADES (Opportunities)', sub: ['Novo Segmento de Clientes', 'Parcerias Estratégicas', 'Demanda Crescente'] },
        { title: '⚠️ FRAQUEZAS (Weaknesses)', sub: ['Orçamento Limitado', 'Baixo Reconhecimento de Marca', 'Dependência de Poucos Canais'] },
        { title: '🛡️ AMEAÇAS (Threats)', sub: ['Concorrência Agressiva', 'Mudanças Regulatórias', 'Instabilidade Econômica'] },
      ];
    }

    if (layout === 'cx_journey') {
      return [
        { title: '1. Descoberta (Awareness)', sub: ['Anúncios em Redes', 'Busca Orgânica Google', 'Indicação de Parceiros'] },
        { title: '2. Consideração (Interest)', sub: ['Página de Demonstração', 'Comparativo de Recursos', 'Depoimentos de Clientes'] },
        { title: '3. Conversão (Purchase)', sub: ['Checkout Simplificado', 'Opções de Pagamento', 'Ativação Imediata'] },
        { title: '4. Onboarding & Uso', sub: ['Tutorial Interativo', 'Suporte Especializado', 'Primeira Vitória Rápida'] },
        { title: '5. Retenção & Lealdade', sub: ['Pesquisa de NPS', 'Programa de Vantagens', 'Recursos Exclusivos VIP'] },
      ];
    }

    // Default business & project branches with contextual variation
    if (t.includes('software') || t.includes('tecnologia') || t.includes('dev') || t.includes('app') || t.includes('cloud')) {
      return [
        { title: '🏗️ 1. Arquitetura & Cloud', sub: ['Microsserviços REST/GraphQL', 'Kubernetes & Docker', 'Cache Redis & CDN'] },
        { title: '🗄️ 2. Banco de Dados & Dados', sub: ['PostgreSQL Relacional', 'Migrações Automatizadas', 'Backup Contínuo'] },
        { title: '🎨 3. Frontend & UX', sub: ['React + Tailwind CSS', 'Design System Acessível', 'Performance < 1s'] },
        { title: '🔒 4. Segurança & CI/CD', sub: ['OAuth2 + JWT Auth', 'Pipeline GitHub Actions', 'Auditoria e Logs'] },
      ];
    }

    if (t.includes('marketing') || t.includes('lançamento') || t.includes('vendas') || t.includes('campanha')) {
      return [
        { title: '🎯 1. Objetivos & Metas', sub: ['Definir MRR Alvo', 'Custo de Aquisição (CAC)', 'Cronograma de Lançamento'] },
        { title: '👥 2. Público & Persona', sub: ['Mapeamento de Dores', 'Segmentação de Lista', 'Proposta de Valor Única'] },
        { title: '⚡ 3. Conteúdo & Mídia', sub: ['Copywriting de Alta Conversão', 'Tráfego Pago Meta & Google', 'Vídeos de Demonstração'] },
        { title: '📊 4. Pós-Venda & Métricas', sub: ['Taxa de Conversão da LP', 'LTV & Upsell', 'Pesquisa de Satisfação'] },
      ];
    }

    return [
      { title: '🎯 1. Objetivos Principais', sub: ['Definir Metas SMART', 'Alinhar Stakeholders', 'Estabelecer Prazos'] },
      { title: '⚡ 2. Estratégias & Táticas', sub: ['Plano de Ação Direto', 'Priorização Impacto x Esforço', 'Canais de Distribuição'] },
      { title: '📦 3. Recursos & Execução', sub: ['Orçamento e Custos', 'Equipe e Responsáveis', 'Ferramentas Necessárias'] },
      { title: '📊 4. Métricas & Resultados', sub: ['Indicadores de Sucesso', 'Revisões Semanais', 'Ajustes Contínuos'] },
    ];
  };

  const handleBuildMindmap = () => {
    setIsGenerating(true);
    playSound.pop();

    const theme = themeColors[colorTheme] || themeColors.vibrant;
    const baseId = `mm-${Date.now()}`;
    const elements: CanvasElement[] = [];
    const branches = generateBranchesData(topic, layoutStyle);

    // Root Center Position
    const rootX = 600;
    const rootY = 400;

    const rootNode: CanvasElement = {
      id: `${baseId}-root`,
      type: 'shape',
      x: rootX,
      y: rootY,
      width: Math.max(220, Math.min(320, topic.length * 9 + 40)),
      height: 85,
      zIndex: 10,
      content: topic.trim(),
      style: {
        shapeType: nodeShape,
        backgroundColor: theme.rootBg,
        borderColor: theme.rootBorder,
        borderWidth: 3,
        color: theme.rootText,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        isMindmapRoot: true,
      },
      createdAt: Date.now(),
    };
    elements.push(rootNode);

    // Layout Algorithm 1: Radial 360 (Bilateral)
    if (layoutStyle === 'radial') {
      const totalBranches = branches.length;
      const leftCount = Math.floor(totalBranches / 2);
      const rightCount = totalBranches - leftCount;

      branches.forEach((b, bIdx) => {
        const isRight = bIdx < rightCount;
        const indexInSide = isRight ? bIdx : bIdx - rightCount;
        const totalInSide = isRight ? rightCount : leftCount;

        const verticalSpread = 160;
        const startY = rootY - ((totalInSide - 1) * verticalSpread) / 2;
        const branchX = isRight ? rootX + rootNode.width + 120 : rootX - 220;
        const branchY = startY + indexInSide * verticalSpread;

        const bStyle = theme.branches[bIdx % theme.branches.length];
        const branchId = `${baseId}-b-${bIdx}`;

        // Main Branch Node
        elements.push({
          id: branchId,
          type: 'shape',
          x: branchX,
          y: branchY,
          width: 200,
          height: 60,
          zIndex: 8,
          content: b.title,
          style: {
            shapeType: nodeShape === 'circle' ? 'rounded' : nodeShape,
            backgroundColor: bStyle.bg,
            borderColor: bStyle.border,
            borderWidth: 2,
            color: bStyle.text,
            fontSize: 13,
            fontWeight: 'bold',
            textAlign: 'center',
            parentId: rootNode.id,
          },
          createdAt: Date.now(),
        });

        // Connector Root -> Branch
        elements.push({
          id: `${baseId}-conn-root-${bIdx}`,
          type: 'connector',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          zIndex: 4,
          content: '',
          style: {
            sourceId: rootNode.id,
            targetId: branchId,
            sourceAnchor: isRight ? 'right' : 'left',
            targetAnchor: isRight ? 'left' : 'right',
            color: bStyle.line,
            strokeWidth: 3,
            arrowEnd: 'arrow',
          },
          createdAt: Date.now(),
        });

        // Depth 3: Sub-branches
        if (depth >= 3) {
          b.sub.forEach((subText, subIdx) => {
            const subId = `${baseId}-sub-${bIdx}-${subIdx}`;
            const subX = isRight ? branchX + 240 : branchX - 190;
            const subY = branchY - 45 + subIdx * 45;

            elements.push({
              id: subId,
              type: 'shape',
              x: subX,
              y: subY,
              width: 165,
              height: 38,
              zIndex: 6,
              content: subText,
              style: {
                shapeType: 'rounded',
                backgroundColor: '#ffffff',
                borderColor: bStyle.border,
                borderWidth: 1.5,
                color: '#1e293b',
                fontSize: 12,
                textAlign: 'center',
                parentId: branchId,
              },
              createdAt: Date.now(),
            });

            elements.push({
              id: `${baseId}-conn-sub-${bIdx}-${subIdx}`,
              type: 'connector',
              x: 0,
              y: 0,
              width: 100,
              height: 100,
              zIndex: 3,
              content: '',
              style: {
                sourceId: branchId,
                targetId: subId,
                sourceAnchor: isRight ? 'right' : 'left',
                targetAnchor: isRight ? 'left' : 'right',
                color: bStyle.line,
                strokeWidth: 2,
                arrowEnd: 'none',
              },
              createdAt: Date.now(),
            });

            // Depth 4: Action check nodes
            if (depth >= 4 && subIdx === 0) {
              const actionId = `${baseId}-act-${bIdx}`;
              const actX = isRight ? subX + 190 : subX - 160;
              elements.push({
                id: actionId,
                type: 'shape',
                x: actX,
                y: subY,
                width: 140,
                height: 34,
                zIndex: 5,
                content: '✓ Tarefa Pronta',
                style: {
                  shapeType: 'pill',
                  backgroundColor: '#f0fdf4',
                  borderColor: '#22c55e',
                  borderWidth: 1.5,
                  color: '#166534',
                  fontSize: 11,
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                createdAt: Date.now(),
              });

              elements.push({
                id: `${baseId}-conn-act-${bIdx}`,
                type: 'connector',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                zIndex: 2,
                content: '',
                style: {
                  sourceId: subId,
                  targetId: actionId,
                  sourceAnchor: isRight ? 'right' : 'left',
                  targetAnchor: isRight ? 'left' : 'right',
                  color: '#22c55e',
                  strokeWidth: 1.5,
                  arrowEnd: 'arrow',
                },
                createdAt: Date.now(),
              });
            }
          });
        }
      });
    }

    // Layout Algorithm 2: Horizontal Tree (Left to Right)
    else if (layoutStyle === 'horizontal') {
      const branchSpacing = 130;
      const startY = rootY - ((branches.length - 1) * branchSpacing) / 2;

      branches.forEach((b, bIdx) => {
        const branchX = rootX + rootNode.width + 140;
        const branchY = startY + bIdx * branchSpacing;
        const bStyle = theme.branches[bIdx % theme.branches.length];
        const branchId = `${baseId}-b-${bIdx}`;

        elements.push({
          id: branchId,
          type: 'shape',
          x: branchX,
          y: branchY,
          width: 210,
          height: 55,
          zIndex: 8,
          content: b.title,
          style: {
            shapeType: nodeShape,
            backgroundColor: bStyle.bg,
            borderColor: bStyle.border,
            borderWidth: 2,
            color: bStyle.text,
            fontSize: 13,
            fontWeight: 'bold',
            textAlign: 'center',
            parentId: rootNode.id,
          },
          createdAt: Date.now(),
        });

        elements.push({
          id: `${baseId}-conn-root-${bIdx}`,
          type: 'connector',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          zIndex: 4,
          content: '',
          style: {
            sourceId: rootNode.id,
            targetId: branchId,
            sourceAnchor: 'right',
            targetAnchor: 'left',
            color: bStyle.line,
            strokeWidth: 3,
            arrowEnd: 'arrow',
          },
          createdAt: Date.now(),
        });

        if (depth >= 3) {
          b.sub.forEach((subText, subIdx) => {
            const subId = `${baseId}-sub-${bIdx}-${subIdx}`;
            const subX = branchX + 250;
            const subY = branchY - 35 + subIdx * 42;

            elements.push({
              id: subId,
              type: 'shape',
              x: subX,
              y: subY,
              width: 175,
              height: 36,
              zIndex: 6,
              content: subText,
              style: {
                shapeType: 'rounded',
                backgroundColor: '#ffffff',
                borderColor: bStyle.border,
                borderWidth: 1.5,
                color: '#1e293b',
                fontSize: 12,
                textAlign: 'center',
                parentId: branchId,
              },
              createdAt: Date.now(),
            });

            elements.push({
              id: `${baseId}-conn-sub-${bIdx}-${subIdx}`,
              type: 'connector',
              x: 0,
              y: 0,
              width: 100,
              height: 100,
              zIndex: 3,
              content: '',
              style: {
                sourceId: branchId,
                targetId: subId,
                sourceAnchor: 'right',
                targetAnchor: 'left',
                color: bStyle.line,
                strokeWidth: 2,
                arrowEnd: 'none',
              },
              createdAt: Date.now(),
            });
          });
        }
      });
    }

    // Layout Algorithm 3: Top-Down Vertical Hierarchy
    else if (layoutStyle === 'topdown') {
      const colWidth = 240;
      const totalWidth = branches.length * colWidth;
      const startX = rootX - totalWidth / 2 + rootNode.width / 2 + 20;

      branches.forEach((b, bIdx) => {
        const branchX = startX + bIdx * colWidth;
        const branchY = rootY + 160;
        const bStyle = theme.branches[bIdx % theme.branches.length];
        const branchId = `${baseId}-b-${bIdx}`;

        elements.push({
          id: branchId,
          type: 'shape',
          x: branchX,
          y: branchY,
          width: 200,
          height: 60,
          zIndex: 8,
          content: b.title,
          style: {
            shapeType: 'rounded',
            backgroundColor: bStyle.bg,
            borderColor: bStyle.border,
            borderWidth: 2,
            color: bStyle.text,
            fontSize: 13,
            fontWeight: 'bold',
            textAlign: 'center',
            parentId: rootNode.id,
          },
          createdAt: Date.now(),
        });

        elements.push({
          id: `${baseId}-conn-root-${bIdx}`,
          type: 'connector',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          zIndex: 4,
          content: '',
          style: {
            sourceId: rootNode.id,
            targetId: branchId,
            sourceAnchor: 'bottom',
            targetAnchor: 'top',
            color: bStyle.line,
            strokeWidth: 3,
            arrowEnd: 'arrow',
          },
          createdAt: Date.now(),
        });

        if (depth >= 3) {
          b.sub.forEach((subText, subIdx) => {
            const subId = `${baseId}-sub-${bIdx}-${subIdx}`;
            const subX = branchX;
            const subY = branchY + 80 + subIdx * 52;

            elements.push({
              id: subId,
              type: 'shape',
              x: subX,
              y: subY,
              width: 200,
              height: 42,
              zIndex: 6,
              content: subText,
              style: {
                shapeType: 'rounded',
                backgroundColor: '#ffffff',
                borderColor: bStyle.border,
                borderWidth: 1.5,
                color: '#1e293b',
                fontSize: 12,
                textAlign: 'center',
                parentId: branchId,
              },
              createdAt: Date.now(),
            });

            elements.push({
              id: `${baseId}-conn-sub-${bIdx}-${subIdx}`,
              type: 'connector',
              x: 0,
              y: 0,
              width: 100,
              height: 100,
              zIndex: 3,
              content: '',
              style: {
                sourceId: subIdx === 0 ? branchId : `${baseId}-sub-${bIdx}-${subIdx - 1}`,
                targetId: subId,
                sourceAnchor: 'bottom',
                targetAnchor: 'top',
                color: bStyle.line,
                strokeWidth: 2,
                arrowEnd: 'arrow',
              },
              createdAt: Date.now(),
            });
          });
        }
      });
    }

    // Layout Algorithm 4: Ishikawa / Fishbone Diagram
    else if (layoutStyle === 'ishikawa') {
      const spineLength = 800;
      const spineEndX = rootX + spineLength;

      // Central Spine Connector
      elements.push({
        id: `${baseId}-spine`,
        type: 'shape',
        x: rootX,
        y: rootY + 38,
        width: spineLength,
        height: 8,
        zIndex: 5,
        content: '',
        style: {
          shapeType: 'rectangle',
          backgroundColor: '#0f172a',
          borderColor: '#0f172a',
          borderWidth: 0,
        },
        createdAt: Date.now(),
      });

      // Target Problem Node (Fish Head)
      rootNode.x = spineEndX + 10;
      rootNode.y = rootY;
      rootNode.content = `🚨 ${topic.trim()}`;
      rootNode.style.shapeType = 'hexagon';
      rootNode.style.backgroundColor = '#ef4444';
      rootNode.style.borderColor = '#b91c1c';

      branches.forEach((b, bIdx) => {
        const isTop = bIdx % 2 === 0;
        const colIdx = Math.floor(bIdx / 2);
        const boneX = rootX + 120 + colIdx * 220;
        const boneY = isTop ? rootY - 140 : rootY + 160;
        const bStyle = theme.branches[bIdx % theme.branches.length];
        const branchId = `${baseId}-b-${bIdx}`;

        elements.push({
          id: branchId,
          type: 'shape',
          x: boneX,
          y: boneY,
          width: 190,
          height: 52,
          zIndex: 8,
          content: b.title,
          style: {
            shapeType: 'rounded',
            backgroundColor: bStyle.bg,
            borderColor: bStyle.border,
            borderWidth: 2,
            color: bStyle.text,
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
          },
          createdAt: Date.now(),
        });

        // Connector Bone to Spine
        elements.push({
          id: `${baseId}-conn-bone-${bIdx}`,
          type: 'connector',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          zIndex: 4,
          content: '',
          style: {
            sourceId: branchId,
            targetId: `${baseId}-spine`,
            sourceAnchor: isTop ? 'bottom' : 'top',
            targetAnchor: 'center',
            color: bStyle.line,
            strokeWidth: 3,
            arrowEnd: 'arrow',
          },
          createdAt: Date.now(),
        });

        // Sub-causes
        b.sub.forEach((subText, subIdx) => {
          const subId = `${baseId}-sub-${bIdx}-${subIdx}`;
          const subX = isTop ? boneX - 60 - subIdx * 40 : boneX - 60 - subIdx * 40;
          const subY = isTop ? boneY - 50 - subIdx * 35 : boneY + 60 + subIdx * 35;

          elements.push({
            id: subId,
            type: 'shape',
            x: subX,
            y: subY,
            width: 160,
            height: 34,
            zIndex: 6,
            content: `• ${subText}`,
            style: {
              shapeType: 'pill',
              backgroundColor: '#ffffff',
              borderColor: bStyle.border,
              borderWidth: 1.5,
              color: '#1e293b',
              fontSize: 11,
              textAlign: 'center',
            },
            createdAt: Date.now(),
          });
        });
      });
    }

    // Layout Algorithm 5: SWOT 4 Quadrants
    else if (layoutStyle === 'swot') {
      const swotOffsets = [
        { x: rootX - 260, y: rootY - 180, bg: '#dcfce7', border: '#22c55e', text: '#166534', label: 'FORÇAS (S)' },
        { x: rootX + rootNode.width + 40, y: rootY - 180, bg: '#e0e7ff', border: '#6366f1', text: '#3730a3', label: 'OPORTUNIDADES (O)' },
        { x: rootX - 260, y: rootY + 120, bg: '#fef3c7', border: '#f59e0b', text: '#92400e', label: 'FRAQUEZAS (W)' },
        { x: rootX + rootNode.width + 40, y: rootY + 120, bg: '#fee2e2', border: '#ef4444', text: '#991b1b', label: 'AMEAÇAS (T)' },
      ];

      branches.slice(0, 4).forEach((b, bIdx) => {
        const pos = swotOffsets[bIdx];
        const branchId = `${baseId}-swot-${bIdx}`;

        elements.push({
          id: branchId,
          type: 'shape',
          x: pos.x,
          y: pos.y,
          width: 240,
          height: 60,
          zIndex: 8,
          content: `${pos.label}\n${b.title}`,
          style: {
            shapeType: 'rounded',
            backgroundColor: pos.bg,
            borderColor: pos.border,
            borderWidth: 2.5,
            color: pos.text,
            fontSize: 13,
            fontWeight: 'bold',
            textAlign: 'center',
          },
          createdAt: Date.now(),
        });

        elements.push({
          id: `${baseId}-conn-swot-${bIdx}`,
          type: 'connector',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          zIndex: 4,
          content: '',
          style: {
            sourceId: rootNode.id,
            targetId: branchId,
            sourceAnchor: bIdx % 2 === 0 ? 'left' : 'right',
            targetAnchor: bIdx % 2 === 0 ? 'right' : 'left',
            color: pos.border,
            strokeWidth: 2.5,
            arrowEnd: 'arrow',
          },
          createdAt: Date.now(),
        });

        b.sub.forEach((subText, subIdx) => {
          const subId = `${baseId}-sub-${bIdx}-${subIdx}`;
          const subY = pos.y + 70 + subIdx * 45;

          elements.push({
            id: subId,
            type: 'shape',
            x: pos.x + 15,
            y: subY,
            width: 210,
            height: 38,
            zIndex: 6,
            content: `✓ ${subText}`,
            style: {
              shapeType: 'rounded',
              backgroundColor: '#ffffff',
              borderColor: pos.border,
              borderWidth: 1.5,
              color: '#1e293b',
              fontSize: 12,
              textAlign: 'left',
            },
            createdAt: Date.now(),
          });
        });
      });
    }

    // Layout Algorithm 6: Customer Journey & Funnel (Step-Chevron Flow)
    else if (layoutStyle === 'cx_journey') {
      const stepWidth = 210;
      const startX = rootX - (branches.length * (stepWidth + 30)) / 2 + rootNode.width / 2;

      rootNode.y = rootY - 140;
      rootNode.x = rootX;

      branches.forEach((b, bIdx) => {
        const stepX = startX + bIdx * (stepWidth + 30);
        const stepY = rootY;
        const bStyle = theme.branches[bIdx % theme.branches.length];
        const branchId = `${baseId}-cx-${bIdx}`;

        elements.push({
          id: branchId,
          type: 'shape',
          x: stepX,
          y: stepY,
          width: stepWidth,
          height: 65,
          zIndex: 8,
          content: b.title,
          style: {
            shapeType: 'step-chevron',
            backgroundColor: bStyle.bg,
            borderColor: bStyle.border,
            borderWidth: 2,
            color: bStyle.text,
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
          },
          createdAt: Date.now(),
        });

        if (bIdx > 0) {
          elements.push({
            id: `${baseId}-conn-step-${bIdx}`,
            type: 'connector',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            zIndex: 4,
            content: '',
            style: {
              sourceId: `${baseId}-cx-${bIdx - 1}`,
              targetId: branchId,
              sourceAnchor: 'right',
              targetAnchor: 'left',
              color: bStyle.line,
              strokeWidth: 2.5,
              arrowEnd: 'arrow',
            },
            createdAt: Date.now(),
          });
        }

        b.sub.forEach((subText, subIdx) => {
          const subId = `${baseId}-sub-${bIdx}-${subIdx}`;
          const subY = stepY + 80 + subIdx * 48;

          elements.push({
            id: subId,
            type: 'shape',
            x: stepX,
            y: subY,
            width: stepWidth,
            height: 40,
            zIndex: 6,
            content: subText,
            style: {
              shapeType: 'rounded',
              backgroundColor: '#ffffff',
              borderColor: bStyle.border,
              borderWidth: 1.5,
              color: '#1e293b',
              fontSize: 11,
              textAlign: 'center',
            },
            createdAt: Date.now(),
          });
        });
      });
    }

    onInsertMindmapToCanvas(elements);
    try {
      confetti({ particleCount: 60, spread: 70 });
    } catch {}
    setIsGenerating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-cyan-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Estúdio de Mapas Mentais & Diagramas
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold uppercase tracking-wider">
                  IA & Multi-Layout
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                Gere mapas radiais, árvores hierárquicas, espinhas de peixe, matrizes SWOT e jornadas com 1 clique
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Topic Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tema Central / Objetivo do Mapa Mental
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Planejamento Estratégico 2026, Arquitetura de Microsserviços..."
                className="w-full text-xs border border-slate-200 focus:border-indigo-500 rounded-xl p-3 outline-none bg-slate-50/60 focus:bg-white transition-all shadow-2xs font-semibold text-slate-900 pr-24"
              />
              <button
                type="button"
                onClick={() => setTopic((prev) => `${prev} com Foco em Alta Performance e Escala`)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Expandir
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
              Templates e Estruturas Prontas
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickTemplates.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopic(t.topic);
                    setLayoutStyle(t.layout);
                    setColorTheme(t.theme);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                    topic === t.topic && layoutStyle === t.layout
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 flex items-center justify-between">
                    <span>{t.title}</span>
                    {topic === t.topic && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{t.topic}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 6 Layout Structures */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tipo de Estrutura & Layout
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'radial', label: 'Radial 360°', desc: 'Galhos bilaterais centrais', icon: <Compass className="w-4 h-4 text-indigo-600" /> },
                { id: 'horizontal', label: 'Árvore Horizontal', desc: 'Esquerda para Direita', icon: <GitBranch className="w-4 h-4 text-blue-600" /> },
                { id: 'topdown', label: 'Top-Down (Vertical)', desc: 'Organograma em níveis', icon: <FolderTree className="w-4 h-4 text-purple-600" /> },
                { id: 'ishikawa', label: 'Espinha de Peixe', desc: 'Ishikawa Causa & Efeito', icon: <Fish className="w-4 h-4 text-amber-600" /> },
                { id: 'swot', label: 'Matriz SWOT', desc: '4 Quadrantes Estratégicos', icon: <Grid className="w-4 h-4 text-emerald-600" /> },
                { id: 'cx_journey', label: 'Jornada / Funil', desc: 'Etapas sequenciais de CX', icon: <TrendingUp className="w-4 h-4 text-rose-600" /> },
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLayoutStyle(l.id as any)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    layoutStyle === l.id
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-1.5 bg-white rounded-lg shadow-2xs shrink-0 mt-0.5">
                    {l.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{l.label}</div>
                    <div className="text-[10px] text-slate-500">{l.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Depth and Shape Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Profundidade de Nós (Níveis)
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {[
                  { level: 2, label: '2 Níveis (Ramos)' },
                  { level: 3, label: '3 Níveis (Padrão)' },
                  { level: 4, label: '4 Níveis (Profundo)' },
                ].map((d) => (
                  <button
                    key={d.level}
                    type="button"
                    onClick={() => setDepth(d.level as any)}
                    className={`py-2 px-1 rounded-lg text-center transition-all ${
                      depth === d.level
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Forma dos Nós Principais
              </label>
              <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {[
                  { id: 'pill', label: 'Pílula' },
                  { id: 'rounded', label: 'Arredondado' },
                  { id: 'hexagon', label: 'Hexágono' },
                  { id: 'diamond', label: 'Losango' },
                ].map((sh) => (
                  <button
                    key={sh.id}
                    type="button"
                    onClick={() => setNodeShape(sh.id as any)}
                    className={`py-2 px-1 rounded-lg text-center transition-all ${
                      nodeShape === sh.id
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sh.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Themes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tema Visual de Cores
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'vibrant', label: 'Vibrante', color: '#4f46e5' },
                { id: 'tech', label: 'Tech Blue', color: '#0284c7' },
                { id: 'emerald', label: 'Esmeralda', color: '#059669' },
                { id: 'sunset', label: 'Sunset', color: '#ea580c' },
                { id: 'dark', label: 'Dark Slate', color: '#0f172a' },
                { id: 'neon', label: 'Cyber Neon', color: '#ec4899' },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setColorTheme(th.id as any)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    colorTheme === th.id
                      ? 'border-indigo-600 bg-indigo-50/70 font-bold shadow-xs ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full shadow-xs" style={{ backgroundColor: th.color }} />
                  <span className="text-[10px] font-semibold">{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={isGenerating || !topic.trim()}
            onClick={handleBuildMindmap}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Calculando nós e conectores do mapa mental...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Gerar e Inserir Mapa Mental no Quadro</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
