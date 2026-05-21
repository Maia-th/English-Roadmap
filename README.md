# 🇺🇸 English Roadmap (Versão Beta)

Aplicação web interativa para gerenciar o seu progresso no roadmap de inglês, desenhada para o ajudar a atingir o nível C1 em 12 meses com 3h de estudo diário.

## 🚀 Como Começar

```bash
# Instalar dependências (incluindo o recharts para os gráficos)
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

```

## 📱 Funcionalidades Principais

### 📊 Dashboard - Prática Diária

* 🔥 **Ofensiva**: Acompanhamento de dias seguidos, progresso do dia e fase atual.
* ⏰ **Rotina Diária**: 4 blocos de estudo interativos (Listening, Speaking, Vocabulary, Grammar).
* 🔗 **Links das Ferramentas**: Acesso rápido aos seus recursos de estudo externos.
* 📅 **Histórico**: Calendário interativo com mapa de calor (heat map) e filtros por data.

### 🧠 Treinamento de Questões

* 📝 **Base de Dados**: 500 questões categorizadas do nível A1 ao C1.
* 🎯 **Filtros Avançados**: Filtre por Nível, Tema e Visibilidade (Todas, Não vistas há 3 dias, Inéditas).
* 💡 **Feedback Imediato**: Correção em tempo real com explicação detalhada da resposta.
* 📈 **Estatísticas**: Gráficos dinâmicos (Rosca e Barras) mostrando o seu desempenho (acertos/erros) por nível e tema.

### 🗂️ Flashcards (Spaced Repetition)

* 🃏 **Base de Dados**: 500 flashcards de vocabulário, gramática e expressões idiomáticas (A1-C1).
* 🔄 **Interatividade 3D**: Cartões com efeito de virar (frente/verso) contendo dicas de prática.
* 🏷️ **Gestão de Conhecimento**: Classifique os cartões como "Dominados" ou "Marcar para Revisão".
* 📊 **Métricas**: Gráficos de acompanhamento do domínio do vocabulário.

### 🗺️ Roadmap - Planejamento

* 📍 **Timeline**: Visão geral das 5 fases rumo ao C1.
* 📝 **Descrição Detalhada**: O que focar em cada fase.
* 🎯 **Milestones**: Objetivos práticos de speaking para validação de nível.
* ⚠️ **Guia de Erros**: O que atrasa vs o que acelera a fluência.

## 🛠️ Características Técnicas

* ✅ **Modo Claro/Escuro** (com preferência salva).
* ✅ **Persistência de Dados** total via LocalStorage.
* ✅ **Dupla confirmação** para ações destrutivas (reset).
* ✅ **Cálculo automático** de streak (dias seguidos).
* ✅ **Design Responsivo** (mobile, tablet, desktop).
* ✅ **Algoritmo de Embaralhamento** (Shuffle) para evitar vícios de memorização.

## 📁 Estrutura do Projeto

```
src/
├── services/
│   └── dataService.js          # Lógica de dados (simulando API)
├── data/
│   ├── roadmapData.js          # Dados do roadmap
│   ├── questionsData.js        # Array com 500 questões (A1-C1)
│   └── flashcardsData.js       # Array com 500 flashcards (A1-C1)
├── components/
│   ├── DailyRoutine.jsx        # Cards da rotina
│   ├── DailyOffensive.jsx      # Stats principais (streak, fase, etc)
│   ├── HistoryCalendar.jsx     # Calendário de histórico
│   ├── PlatformLinks.jsx       # Links úteis
│   ├── QuestionStats.jsx       # Gráficos Recharts (Questões)
│   ├── FlashcardStats.jsx      # Gráficos Recharts (Flashcards)
│   └── ResetConfirmation.jsx   # Modal de confirmação
├── pages/
│   ├── Dashboard.jsx           # Hub central de prática
│   ├── Questions.jsx           # Sistema de testes
│   ├── Flashcards.jsx          # Sistema de revisão
│   └── Roadmap.jsx             # Timeline do roadmap
├── App.jsx                     # Componente principal e Rotas
├── main.jsx                    # Entry point
├── index.css                   # Estilos globais (Tailwind + CSS 3D)
└── App.css                     # Animações base

```

## 🔄 Data Service (Simulação de API)

Toda a lógica de leitura e escrita está isolada no `src/services/dataService.js`, facilitando a futura migração para um backend real:

```javascript
// Exemplo de uso:
const data = await dataService.getAllData();
const streak = await dataService.getStreak();

// Salvar progresso de estudos
await dataService.saveQuestionAnswer(questionId, isCorrect, level, theme);
await dataService.saveFlashcardStatus(cardId, 'mastered');

// Obter estatísticas para gráficos
const questionStats = await dataService.getQuestionStats();
const flashcardStats = await dataService.getFlashcardsStatus();

```

## 📦 Dependências Principais

* **React 18** - Framework de UI
* **Vite** - Build tool ultra-rápida
* **Tailwind CSS** - Estilização utility-first
* **Recharts** - Biblioteca para gráficos de desempenho
* **Lucide React** - Ícones limpos e modernos
* **Date-fns** - Manipulação facilitada de datas