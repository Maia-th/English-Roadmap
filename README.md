# 🇺🇸 English Roadmap - C1 em 12 Meses

Aplicação web para gerenciar seu progresso no roadmap de inglês, atingindo nível C1 em 12 meses com 3h de estudo diário.

## 🚀 Como Começar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📱 Funcionalidades

### Dashboard - Prática Diária
- 🔥 **Ofensiva**: Dias seguidos, progresso do dia, fase atual
- ⏰ **Rotina Diária**: 4 cards (Listening, Speaking, Vocabulary, Grammar)
- 🔗 **Links das Ferramentas**: Acesso rápido aos recursos
- 📅 **Histórico**: Calendário com cores + filtros por data

### Roadmap - Planejamento
- 📊 Timeline das 5 fases
- 📝 Descrição detalhada de cada fase
- 🎯 Milestones de speaking
- ⚠️ Erros que atrasam vs o que acelera

## 🎨 Funcionalidades

✅ **Modo Claro/Escuro**
✅ **Checkboxes diários** com persistência
✅ **Dupla confirmação** para reset
✅ **Data/hora** de última modificação
✅ **Histórico visual** com cores (verde escuro = 100%)
✅ **Cálculo automático** de streak (dias seguidos)
✅ **Responsivo** (mobile, tablet, desktop)
✅ **LocalStorage** para persistência

## 📁 Estrutura

```
src/
├── services/
│   └── dataService.js          # Lógica de dados (simulando API)
├── data/
│   └── roadmapData.js          # Dados do roadmap
├── components/
│   ├── DailyRoutine.jsx        # Cards da rotina
│   ├── DailyOffensive.jsx      # Stats (streak, fase, etc)
│   ├── HistoryCalendar.jsx     # Calendário com filtros
│   ├── PlatformLinks.jsx       # Links das ferramentas
│   └── ResetConfirmation.jsx   # Modal de confirmação
├── pages/
│   ├── Dashboard.jsx           # Prática diária
│   └── Roadmap.jsx             # Timeline do roadmap
├── App.jsx                     # App principal
├── main.jsx                    # Entry point
├── index.css                   # Estilos globais
└── App.css                     # Animações
```

## 🔄 Data Service

Toda a lógica de dados está isolada em `src/services/dataService.js`:

```javascript
// Buscar dados
const data = await dataService.getAllData();

// Atualizar progresso
await dataService.updateDailyProgress(taskIndex, completed);

// Resetar dia
await dataService.resetDailyProgress();

// Histórico filtrado
const history = await dataService.getHistoryFiltered(startDate, endDate);

// Dias seguidos
const streak = await dataService.getStreak();
```

**Futuramente**, basta trocar `localStorage` por `fetch('/api/...')` - a interface permanece igual!

## 🌙 Temas

- Light theme (padrão)
- Dark theme (toggle no header)
- Preferência salva no localStorage

## 📦 Dependências

- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Lucide React** - Icons
- **Date-fns** - Manipulação de datas

## 🎯 Roadmap de Desenvolvimento

- [ ] Integração com backend (API)
- [ ] Autenticação de usuários
- [ ] Múltiplas trilhas (outras idiomas)
- [ ] Exportar relatórios
- [ ] Notificações diárias
- [ ] Gráficos de progresso

## 📄 Licença

MIT
