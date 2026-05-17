export const roadmapData = {
  phases: [
    {
      id: 1,
      title: 'Foundation',
      months: '1–2',
      objective: 'Construir base sólida',
      description: 'Desenvolver base de inglês com gramática básica, pronúncia e hábito diário.',
      focus: [
        'Present Simple, Past Simple, Future',
        'Questions e Prepositions',
        'Shadowing e frases simples',
        'Auto conversação básica',
      ],
      goals: [
        '✔ Entender inglês lento',
        '✔ Criar frases básicas',
        '✔ Ler textos simples',
        '✔ Construir rotina diária',
      ],
      color: 'from-blue-500 to-cyan-500',
      icon: '🌱',
    },
    {
      id: 2,
      title: 'Expansion',
      months: '3–4',
      objective: 'Expandir vocabulário e naturalidade',
      description: 'Aumentar vocabulário, parar de usar português e começar exposição a conteúdo nativo.',
      focus: [
        'Present Perfect, Modal Verbs',
        'Comparatives e Conditionals',
        'Passive Voice',
        'Vídeos nativos e podcasts',
      ],
      goals: [
        '✔ Conversas básicas',
        '✔ Pensar parcialmente em inglês',
        '✔ Ler conteúdos técnicos simples',
        '✔ Entender boa parte de vídeos',
      ],
      color: 'from-purple-500 to-pink-500',
      icon: '📈',
    },
    {
      id: 3,
      title: 'Immersion',
      months: '5–7',
      objective: 'Imersão total em inglês',
      description: 'Trocar ambiente para inglês: celular, navegador, documentação, ferramentas.',
      focus: [
        'Ambiente 100% em inglês',
        'Conteúdo técnico avançado',
        'Conversas longas e naturais',
        'Estudar tecnologia em inglês',
      ],
      goals: [
        '✔ Consumir conteúdo nativo',
        '✔ Conversar naturalmente',
        '✔ Entender inglês técnico',
        '✔ Pensar parcialmente em inglês',
      ],
      color: 'from-red-500 to-orange-500',
      icon: '🔥',
    },
    {
      id: 4,
      title: 'Professional English',
      months: '8–10',
      objective: 'Dominar inglês profissional',
      description: 'Foco em comunicação profissional, reuniões, entrevistas e explicações técnicas.',
      focus: [
        'Explicar projetos tecnológicos',
        'Defender ideias em inglês',
        'Entrevistas e reuniões simuladas',
        'Documentação e artigos técnicos',
      ],
      goals: [
        '✔ Trabalhar parcialmente em inglês',
        '✔ Participar de conversas técnicas',
        '✔ Entender conteúdo complexo',
        '✔ Melhorar naturalidade',
      ],
      color: 'from-yellow-500 to-lime-500',
      icon: '💼',
    },
    {
      id: 5,
      title: 'Advanced Fluency / C1',
      months: '11–12',
      objective: 'Alcançar fluidez avançada C1',
      description: 'Desenvolver naturalidade, velocidade mental e capacidade de trabalhar/estudar em inglês.',
      focus: [
        'Nuances da linguagem',
        'Velocidade mental',
        'Vocabulário sofisticado',
        'Debates e argumentação',
      ],
      goals: [
        '✔ Próximo do C1 funcional',
        '✔ Entendimento confortável de conteúdo nativo',
        '✔ Inglês profissional forte',
        '✔ Conversação avançada',
      ],
      color: 'from-green-500 to-emerald-500',
      icon: '🧠',
    },
  ],

  dailyRoutine: [
    { title: '🎧 Listening / Input', duration: '1h15', percentage: 0 },
    { title: '🗣️ Speaking', duration: '45m', percentage: 0 },
    { title: '📚 Vocabulary (Anki)', duration: '30m', percentage: 0 },
    { title: '✍️ Grammar & Writing', duration: '30m', percentage: 0 },
  ],

  platforms: {
    beginner: [
      { name: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish' },
      { name: 'VOA Learning English', url: 'https://learningenglish.voanews.com' },
      { name: 'Easy English', url: 'https://www.youtube.com/@EasyEnglishVideos' },
      { name: 'English with Lucy', url: 'https://www.youtube.com/@EnglishwithLucy' },
    ],
    technical: [
      { name: 'Traversy Media', url: 'https://www.youtube.com/@TraversyMedia' },
      { name: 'Fireship', url: 'https://www.youtube.com/@Fireship' },
      { name: 'The Primeagen', url: 'https://www.youtube.com/@ThePrimeagen' },
    ],
    advanced: [
      { name: 'Lex Fridman', url: 'https://www.youtube.com/@lexfridman' },
      { name: 'Huberman Lab', url: 'https://www.youtube.com/@hubermanlab' },
      { name: 'TED', url: 'https://www.youtube.com/@TED' },
      { name: 'ColdFusion', url: 'https://www.youtube.com/@ColdFusion' },
    ],
  },

  tools: [
    { name: 'Anki', url: 'https://apps.ankiweb.net', icon: '📚', color: 'blue' },
    { name: 'HelloTalk', url: 'https://www.hellotalk.com', icon: '💬', color: 'green' },
    { name: 'Grammarly', url: 'https://www.grammarly.com', icon: '✏️', color: 'red' },
    { name: 'BBC', url: 'https://www.bbc.co.uk/learningenglish', icon: '🎧', color: 'purple' },
  ],

  speakingMilestones: [
    { month: 2, goal: 'Frases simples' },
    { month: 4, goal: 'Conversas curtas' },
    { month: 7, goal: 'Conversas naturais' },
    { month: 10, goal: 'Explicações técnicas' },
    { month: 12, goal: 'Debates e fluidez avançada' },
  ],

  levelIndicators: [
    {
      level: 'A2',
      characteristics: ['Frases simples', 'Listening básico'],
    },
    {
      level: 'B1',
      characteristics: ['Conversas simples', 'Vídeos lentos'],
    },
    {
      level: 'B2',
      characteristics: ['Conteúdo nativo', 'Conversação funcional', 'Inglês técnico'],
    },
    {
      level: 'C1',
      characteristics: [
        'Fluidez natural',
        'Argumentação',
        'Conteúdo complexo',
        'Comunicação profissional',
        'Pensamento direto em inglês',
      ],
    },
  ],

  strategies: [
    {
      title: 'Consistência diária',
      description: 'Mantenha contato com inglês todos os dias, mesmo com sessões curtas.',
      tips: ['Regra mínima de 30 minutos', 'Priorize speaking e listening', 'Evite dias em branco'],
      accent: 'blue',
      icon: '📅',
    },
    {
      title: 'Imersão progressiva',
      description: 'Aumente o uso do inglês no seu ambiente de trabalho e lazer a cada mês.',
      tips: ['Celular e apps em inglês', 'Consumir conteúdo nativo', 'Estudar tecnologia em inglês'],
      accent: 'purple',
      icon: '🌍',
    },
    {
      title: 'Feedback contínuo',
      description: 'Meça evolução e ajuste o plano com base em resultados reais.',
      tips: ['Revisão semanal', 'Simulações de conversa', 'Teste de proficiência a cada fase'],
      accent: 'green',
      icon: '📈',
    },
  ],

  mistakes: [
    '❌ Traduzir tudo',
    '❌ Estudar apenas gramática',
    '❌ Não praticar speaking',
    '❌ Consumir pouco inglês real',
    '❌ Medo de errar',
    '❌ Passar dias sem contato',
  ],

  accelerators: [
    '✔ Consistência diária',
    '✔ Shadowing',
    '✔ Speaking desde o início',
    '✔ Conteúdo real',
    '✔ Imersão parcial',
    '✔ Tecnologia em inglês',
    '✔ Pensar em inglês',
  ],
}

export default roadmapData
