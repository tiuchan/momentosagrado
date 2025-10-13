export interface Theme {
  icon: string
  label: string
  prompt: string
  color: string
}

// 50+ temas variáveis para seleção aleatória
export const allThemes: Theme[] = [
  {
    icon: "😔",
    label: "Sentindo Ansiedade",
    prompt: "Estou sentindo ansiedade",
    color: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600",
  },
  {
    icon: "✨",
    label: "Preciso de Encorajamento",
    prompt: "Preciso de encorajamento",
    color: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600",
  },
  {
    icon: "❓",
    label: "Dúvidas Espirituais",
    prompt: "Tenho dúvidas espirituais",
    color: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600",
  },
  {
    icon: "❤️",
    label: "Gratidão e Paz",
    prompt: "Quero expressar gratidão",
    color: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600",
  },
  {
    icon: "😢",
    label: "Estou Triste",
    prompt: "Estou me sentindo triste",
    color: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600",
  },
  {
    icon: "💪",
    label: "Preciso de Força",
    prompt: "Preciso de força para continuar",
    color: "bg-red-500/10 hover:bg-red-500/20 text-red-600",
  },
  {
    icon: "🙏",
    label: "Momento de Oração",
    prompt: "Quero um momento de oração",
    color: "bg-teal-500/10 hover:bg-teal-500/20 text-teal-600",
  },
  {
    icon: "😰",
    label: "Sentindo Medo",
    prompt: "Estou com medo",
    color: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-600",
  },
  {
    icon: "💔",
    label: "Coração Partido",
    prompt: "Meu coração está partido",
    color: "bg-pink-500/10 hover:bg-pink-500/20 text-pink-600",
  },
  {
    icon: "🌟",
    label: "Busco Esperança",
    prompt: "Preciso de esperança",
    color: "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600",
  },
  {
    icon: "😤",
    label: "Estou com Raiva",
    prompt: "Estou sentindo raiva",
    color: "bg-red-600/10 hover:bg-red-600/20 text-red-700",
  },
  {
    icon: "🤔",
    label: "Confuso sobre o Futuro",
    prompt: "Estou confuso sobre meu futuro",
    color: "bg-slate-500/10 hover:bg-slate-500/20 text-slate-600",
  },
  {
    icon: "😌",
    label: "Busco Paz Interior",
    prompt: "Quero encontrar paz interior",
    color: "bg-green-500/10 hover:bg-green-500/20 text-green-600",
  },
  {
    icon: "🎯",
    label: "Preciso de Direção",
    prompt: "Preciso de direção na vida",
    color: "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600",
  },
  {
    icon: "💭",
    label: "Pensamentos Negativos",
    prompt: "Tenho pensamentos negativos",
    color: "bg-gray-500/10 hover:bg-gray-500/20 text-gray-600",
  },
  {
    icon: "🌈",
    label: "Quero Alegria",
    prompt: "Quero sentir alegria",
    color: "bg-violet-500/10 hover:bg-violet-500/20 text-violet-600",
  },
  {
    icon: "😓",
    label: "Estou Cansado",
    prompt: "Estou muito cansado",
    color: "bg-stone-500/10 hover:bg-stone-500/20 text-stone-600",
  },
  {
    icon: "🛡️",
    label: "Preciso de Proteção",
    prompt: "Preciso de proteção divina",
    color: "bg-blue-600/10 hover:bg-blue-600/20 text-blue-700",
  },
  {
    icon: "💡",
    label: "Busco Sabedoria",
    prompt: "Preciso de sabedoria",
    color: "bg-amber-600/10 hover:bg-amber-600/20 text-amber-700",
  },
  {
    icon: "🕊️",
    label: "Perdão e Reconciliação",
    prompt: "Preciso aprender a perdoar",
    color: "bg-sky-500/10 hover:bg-sky-500/20 text-sky-600",
  },
  {
    icon: "🌺",
    label: "Renovação Espiritual",
    prompt: "Quero renovação espiritual",
    color: "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-600",
  },
  {
    icon: "⚡",
    label: "Preciso de Coragem",
    prompt: "Preciso de coragem",
    color: "bg-yellow-600/10 hover:bg-yellow-600/20 text-yellow-700",
  },
  {
    icon: "🎁",
    label: "Gratidão pelas Bênçãos",
    prompt: "Quero agradecer pelas bênçãos",
    color: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600",
  },
  {
    icon: "🌙",
    label: "Insônia e Descanso",
    prompt: "Não consigo dormir",
    color: "bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700",
  },
  {
    icon: "🔥",
    label: "Avivamento Espiritual",
    prompt: "Quero avivamento espiritual",
    color: "bg-orange-600/10 hover:bg-orange-600/20 text-orange-700",
  },
  {
    icon: "🌻",
    label: "Crescimento Pessoal",
    prompt: "Quero crescer espiritualmente",
    color: "bg-lime-500/10 hover:bg-lime-500/20 text-lime-600",
  },
  {
    icon: "💫",
    label: "Propósito de Vida",
    prompt: "Qual é meu propósito?",
    color: "bg-purple-600/10 hover:bg-purple-600/20 text-purple-700",
  },
  {
    icon: "🎵",
    label: "Louvor e Adoração",
    prompt: "Quero um momento de louvor",
    color: "bg-pink-600/10 hover:bg-pink-600/20 text-pink-700",
  },
  {
    icon: "🌊",
    label: "Superando Dificuldades",
    prompt: "Estou passando por dificuldades",
    color: "bg-teal-600/10 hover:bg-teal-600/20 text-teal-700",
  },
  {
    icon: "🦋",
    label: "Transformação",
    prompt: "Quero ser transformado",
    color: "bg-violet-600/10 hover:bg-violet-600/20 text-violet-700",
  },
  {
    icon: "🏔️",
    label: "Fé em Tempos Difíceis",
    prompt: "Preciso de fé",
    color: "bg-slate-600/10 hover:bg-slate-600/20 text-slate-700",
  },
  {
    icon: "🌸",
    label: "Amor de Deus",
    prompt: "Quero sentir o amor de Deus",
    color: "bg-rose-600/10 hover:bg-rose-600/20 text-rose-700",
  },
  {
    icon: "⭐",
    label: "Milagres e Maravilhas",
    prompt: "Preciso de um milagre",
    color: "bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-700",
  },
  {
    icon: "🎨",
    label: "Criatividade e Dons",
    prompt: "Quero desenvolver meus dons",
    color: "bg-fuchsia-600/10 hover:bg-fuchsia-600/20 text-fuchsia-700",
  },
  {
    icon: "🌿",
    label: "Cura Interior",
    prompt: "Preciso de cura interior",
    color: "bg-green-600/10 hover:bg-green-600/20 text-green-700",
  },
  {
    icon: "🎪",
    label: "Alegria no Senhor",
    prompt: "Quero alegria no Senhor",
    color: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600",
  },
  {
    icon: "🔔",
    label: "Chamado e Vocação",
    prompt: "Qual é meu chamado?",
    color: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600",
  },
  {
    icon: "🌅",
    label: "Novo Começo",
    prompt: "Quero um novo começo",
    color: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-600",
  },
  {
    icon: "🎭",
    label: "Identidade em Cristo",
    prompt: "Quem sou eu em Cristo?",
    color: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600",
  },
  {
    icon: "🏆",
    label: "Vitória Espiritual",
    prompt: "Quero vitória espiritual",
    color: "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600",
  },
  {
    icon: "🌏",
    label: "Missões e Evangelismo",
    prompt: "Quero evangelizar",
    color: "bg-teal-500/10 hover:bg-teal-500/20 text-teal-600",
  },
  {
    icon: "📖",
    label: "Entendendo a Bíblia",
    prompt: "Quero entender a Bíblia",
    color: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600",
  },
  {
    icon: "🤝",
    label: "Relacionamentos",
    prompt: "Preciso de ajuda nos relacionamentos",
    color: "bg-pink-500/10 hover:bg-pink-500/20 text-pink-600",
  },
  {
    icon: "💰",
    label: "Finanças e Provisão",
    prompt: "Preciso de provisão financeira",
    color: "bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700",
  },
  {
    icon: "👨‍👩‍👧",
    label: "Família e Lar",
    prompt: "Preciso de sabedoria para minha família",
    color: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600",
  },
  {
    icon: "💼",
    label: "Trabalho e Carreira",
    prompt: "Preciso de direção no trabalho",
    color: "bg-slate-500/10 hover:bg-slate-500/20 text-slate-600",
  },
  {
    icon: "🎓",
    label: "Estudos e Aprendizado",
    prompt: "Preciso de sabedoria nos estudos",
    color: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600",
  },
  {
    icon: "🏥",
    label: "Saúde e Cura",
    prompt: "Preciso de cura física",
    color: "bg-red-500/10 hover:bg-red-500/20 text-red-600",
  },
  {
    icon: "⚖️",
    label: "Justiça e Verdade",
    prompt: "Busco justiça",
    color: "bg-gray-600/10 hover:bg-gray-600/20 text-gray-700",
  },
  {
    icon: "🎯",
    label: "Foco e Disciplina",
    prompt: "Preciso de disciplina",
    color: "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600",
  },
  {
    icon: "🌱",
    label: "Paciência e Espera",
    prompt: "Preciso aprender a esperar",
    color: "bg-lime-600/10 hover:bg-lime-600/20 text-lime-700",
  },
  {
    icon: "🎉",
    label: "Celebração e Vitória",
    prompt: "Quero celebrar as vitórias",
    color: "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-600",
  },
  {
    icon: "🧘",
    label: "Meditação e Quietude",
    prompt: "Quero um momento de quietude",
    color: "bg-violet-500/10 hover:bg-violet-500/20 text-violet-600",
  },
  {
    icon: "🌟",
    label: "Presença de Deus",
    prompt: "Quero sentir a presença de Deus",
    color: "bg-amber-600/10 hover:bg-amber-600/20 text-amber-700",
  },
]

// Função para selecionar 4 temas aleatórios
export function getRandomThemes(count = 4): Theme[] {
  const shuffled = [...allThemes].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
