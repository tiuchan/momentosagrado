import { type NextRequest, NextResponse } from "next/server"
import { getAvailableThemes, getVerseCount, getRandomVersesFromAll, getRandomVerses } from "@/lib/verses"
import { getRandomOpening, getRandomTransition, getRandomClosing } from "@/lib/dialogue-system"

function detectGender(message: string): "feminine" | "masculine" | "neutral" {
  const lowerMessage = message.toLowerCase()

  // Feminine indicators
  const femininePatterns = [
    /\b(cansada|preocupada|sozinha|perdida|triste|ansiosa|confusa|assustada|nervosa|estressada)\b/,
    /\bestou\s+(muito\s+)?(cansada|preocupada|sozinha|perdida|triste|ansiosa|confusa|assustada|nervosa|estressada)\b/,
    /\bme\s+sinto\s+(muito\s+)?(cansada|preocupada|sozinha|perdida|triste|ansiosa|confusa|assustada|nervosa|estressada)\b/,
    /\bsou\s+(uma\s+)?(mulher|mãe|filha|esposa|irmã)\b/,
  ]

  // Masculine indicators
  const masculinePatterns = [
    /\b(cansado|preocupado|sozinho|perdido|triste|ansioso|confuso|assustado|nervoso|estressado)\b/,
    /\bestou\s+(muito\s+)?(cansado|preocupado|sozinho|perdido|triste|ansioso|confuso|assustado|nervoso|estressado)\b/,
    /\bme\s+sinto\s+(muito\s+)?(cansado|preocupado|sozinho|perdido|triste|ansioso|confuso|assustado|nervoso|estressado)\b/,
    /\bsou\s+(um\s+)?(homem|pai|filho|esposo|irmão)\b/,
  ]

  const hasFeminine = femininePatterns.some((pattern) => pattern.test(lowerMessage))
  const hasMasculine = masculinePatterns.some((pattern) => pattern.test(lowerMessage))

  if (hasFeminine && !hasMasculine) return "feminine"
  if (hasMasculine && !hasFeminine) return "masculine"
  return "neutral"
}

function detectTheme(message: string): string | null {
  const lowerMessage = message.toLowerCase()

  // Theme detection patterns - expandido para cobrir todos os cards
  const themePatterns: Record<string, RegExp[]> = {
    cansaco: [
      /\b(cansad[oa]|exaust[oa]|fatigad[oa]|esgotad[oa]|sem\s+energia|sem\s+forças)\b/,
      /\bestou\s+(muito\s+)?cansad[oa]\b/,
      /\bme\s+sinto\s+cansad[oa]\b/,
      /\bpreciso\s+de\s+descanso\b/,
      /\bn[ãa]o\s+consigo\s+dormir\b/,
      /\bins[ôo]nia\b/,
    ],
    ansiedade: [
      /\b(ansios[oa]|preocupad[oa]|nervos[oa]|estressad[oa]|angustiad[oa])\b/,
      /\bestou\s+(sentindo\s+)?ansios[oa]\b/,
      /\bme\s+sinto\s+ansios[oa]\b/,
      /\bansiedade\b/,
      /\bsentindo\s+ansiedade\b/,
      /\bpensamentos\s+negativos\b/,
      /\bconfus[oa]\s+sobre\b/,
    ],
    alegria: [
      /\b(alegr[ea]|feliz|contente|celebr)\b/,
      /\bestou\s+feliz\b/,
      /\bquero\s+(sentir\s+)?alegria\b/,
      /\balegria\b/,
      /\bquero\s+celebrar\b/,
      /\balegria\s+no\s+senhor\b/,
      /\blouvor\b/,
      /\badora[çc][ãa]o\b/,
      /\bmomento\s+de\s+louvor\b/,
    ],
    medo: [
      /\b(medo|assustad[oa]|amedrontad[oa]|temor|receios[oa])\b/,
      /\bestou\s+com\s+medo\b/,
      /\btenho\s+medo\b/,
      /\bsentindo\s+medo\b/,
      /\bpreciso\s+de\s+prote[çc][ãa]o\b/,
      /\bprote[çc][ãa]o\s+divina\b/,
      /\bpreciso\s+de\s+coragem\b/,
    ],
    solidao: [
      /\b(sozinho|sozinha|solid[ãa]o|isolad[oa]|abandonad[oa])\b/,
      /\bestou\s+sozinho\b/,
      /\bme\s+sinto\s+s[óo]\b/,
      /\btriste\b/,
      /\bestou\s+(me\s+sentindo\s+)?triste\b/,
      /\bcora[çc][ãa]o\s+(est[áa]\s+)?partido\b/,
      /\bpassando\s+por\s+dificuldades\b/,
    ],
    fe: [
      /\b(f[ée]|cren[çc]a|acreditar|confian[çc]a\s+em\s+deus)\b/,
      /\bfortalecer\s+(minha\s+)?f[ée]\b/,
      /\bpreciso\s+de\s+f[ée]\b/,
      /\bmomento\s+de\s+ora[çc][ãa]o\b/,
      /\bquero\s+(um\s+momento\s+de\s+)?ora[çc][ãa]o\b/,
      /\bd[úu]vidas\s+espirituais\b/,
      /\brenova[çc][ãa]o\s+espiritual\b/,
      /\bavivamento\s+espiritual\b/,
      /\bcrescer\s+espiritualmente\b/,
      /\bpresen[çc]a\s+de\s+deus\b/,
      /\bsentir\s+a\s+presen[çc]a\b/,
      /\bvit[óo]ria\s+espiritual\b/,
      /\bmilagre\b/,
    ],
    esperanca: [
      /\b(esperan[çc]a|esperan[çc]oso|futuro|renova[çc][ãa]o)\b/,
      /\bpreciso\s+de\s+esperan[çc]a\b/,
      /\bbusco\s+esperan[çc]a\b/,
      /\bencorajamento\b/,
      /\bpreciso\s+de\s+encorajamento\b/,
      /\bpreciso\s+de\s+for[çc]a\b/,
      /\bfor[çc]a\s+para\s+continuar\b/,
      /\bpreciso\s+de\s+dire[çc][ãa]o\b/,
      /\bdire[çc][ãa]o\s+na\s+vida\b/,
      /\bprop[óo]sito\b/,
      /\bqual\s+[ée]\s+meu\s+prop[óo]sito\b/,
      /\bnovo\s+come[çc]o\b/,
      /\btransforma[çc][ãa]o\b/,
      /\bquero\s+ser\s+transformad[oa]\b/,
    ],
    amor: [
      /\b(amor|amad[oa]|amar|carinho)\b/,
      /\bamor\s+de\s+deus\b/,
      /\bsentir\s+o\s+amor\s+de\s+deus\b/,
      /\bperd[ãa]o\b/,
      /\baprender\s+a\s+perdoar\b/,
      /\breconcilia[çc][ãa]o\b/,
      /\brelacionamentos\b/,
      /\bajuda\s+nos\s+relacionamentos\b/,
      /\bfam[íi]lia\b/,
      /\bsabedoria\s+para\s+(minha\s+)?fam[íi]lia\b/,
    ],
    gratidao: [
      /\b(gratid[ãa]o|grat[oa]|agradecer|obrigad[oa]|b[êe]n[çc][ãa]os?)\b/,
      /\bexpresar\s+gratid[ãa]o\b/,
      /\bquero\s+expressar\s+gratid[ãa]o\b/,
      /\bgratid[ãa]o\s+e\s+paz\b/,
      /\bagradecer\s+pelas\s+b[êe]n[çc][ãa]os\b/,
      /\bpaz\s+interior\b/,
      /\bencontrar\s+paz\b/,
      /\bbusco\s+paz\b/,
      /\bquietude\b/,
      /\bmomento\s+de\s+quietude\b/,
      /\bmedita[çc][ãa]o\b/,
    ],
  }

  // Check each theme pattern
  for (const [theme, patterns] of Object.entries(themePatterns)) {
    if (patterns.some((pattern) => pattern.test(lowerMessage))) {
      return theme
    }
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, isCardSelection } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key não configurada" }, { status: 500 })
    }

    const detectedGender = detectGender(message)

    const isDailyMessage =
      message.toLowerCase().includes("mensagem diária") || message.toLowerCase().includes("mensagem diaria")

    const detectedTheme = detectTheme(message)

    let selectedVerses = ""
    if (isDailyMessage) {
      const verses = getRandomVersesFromAll(2)
      selectedVerses = verses.map((v) => `"${v.text}" (${v.ref})`).join("\n\n")
    } else if (detectedTheme) {
      const verses = getRandomVerses(detectedTheme, 4)
      selectedVerses = verses.map((v) => `"${v.text}" (${v.ref})`).join("\n\n")
    }

    const randomOpening = getRandomOpening()
    const randomTransition = getRandomTransition()
    const randomClosing = getRandomClosing()

    const themes = getAvailableThemes()
    const verseStats = themes.map((theme) => `${theme}: ${getVerseCount(theme)} versículos`).join(", ")

    const systemPrompt = `Você é um conselheiro espiritual empático e acolhedor, inspirado no estilo pastoral de Junior Rostirola. Sua missão é ouvir com carinho, oferecer conforto e compartilhar sabedoria bíblica de forma gentil, calorosa e profundamente humana.

BANCO DE VERSÍCULOS DISPONÍVEL:
Você tem acesso a um extenso banco de versículos organizados por temas: ${verseStats}

${
  isDailyMessage || detectedTheme
    ? `
⚠️ ${isDailyMessage ? "MENSAGEM DIÁRIA" : `TEMA DETECTADO: ${detectedTheme?.toUpperCase()}`} - USE ESTES VERSÍCULOS ESPECÍFICOS ⚠️
Você DEVE escolher e usar UM ou MAIS dos versículos abaixo na sua resposta. Estes foram selecionados ALEATORIAMENTE do banco de dados:

${selectedVerses}

IMPORTANTE: 
- Escolha ALEATORIAMENTE qual(is) versículo(s) usar - NÃO use sempre o primeiro!
- Cite o versículo EXATAMENTE como está acima, incluindo a referência.
- Varie sua escolha a cada conversa - use versículos diferentes mesmo para o mesmo tema!
`
    : ""
}

⚠️ REGRA CRÍTICA DE VARIAÇÃO ⚠️
NUNCA repita os mesmos versículos! A cada nova conversa, você DEVE escolher versículos DIFERENTES, mesmo que o tema seja similar. Explore toda a riqueza da Bíblia disponível no banco de dados.
${detectedTheme ? `\n🎯 Para o tema "${detectedTheme}", você tem ${getVerseCount(detectedTheme)} versículos disponíveis - USE DIFERENTES A CADA VEZ!` : ""}

🎯 DETECÇÃO DE GÊNERO IDENTIFICADO: ${detectedGender === "feminine" ? "FEMININO" : detectedGender === "masculine" ? "MASCULINO" : "NEUTRO/UNIVERSAL"}
${isCardSelection ? "⚠️ ATENÇÃO: Esta mensagem veio de um CARD da tela inicial - use linguagem NEUTRA e UNIVERSAL!" : ""}

ADAPTAÇÃO DE GÊNERO NA RESPOSTA:
${
  detectedGender === "feminine"
    ? `
- Use SEMPRE linguagem feminina: querida, amiga, irmã, você está cansada, você é amada
- Exemplos: "Querida amiga", "Você não está sozinha", "Deus te ama profundamente"
`
    : detectedGender === "masculine"
      ? `
- Use SEMPRE linguagem masculina: querido, amigo, irmão, você está cansado, você é amado
- Exemplos: "Querido amigo", "Você não está sozinho", "Deus te ama profundamente"
`
      : `
- Use linguagem NEUTRA e UNIVERSAL que sirva para qualquer pessoa
- Evite adjetivos com gênero (cansado/cansada)
- Use formas universais: "Você não está só", "Deus te ama", "Há esperança para você"
- Foque no "você" sem especificar gênero
`
}

🌟 VARIAÇÕES DE DIÁLOGO SELECIONADAS PARA ESTA RESPOSTA:

ABERTURA OBRIGATÓRIA (use esta frase específica para iniciar):
"${randomOpening}"

TRANSIÇÃO OBRIGATÓRIA (use ao introduzir o versículo):
"${randomTransition}"

FECHAMENTO (use como inspiração para criar um parágrafo conclusivo):
"${randomClosing}"

⚠️ IMPORTANTE SOBRE AS VARIAÇÕES:
- ABERTURA e TRANSIÇÃO: Use EXATAMENTE como fornecidas
- FECHAMENTO: Use a frase como INSPIRAÇÃO para criar um parágrafo conclusivo de 2-3 frases que:
  * Incorpore naturalmente a essência da frase de fechamento
  * Ofereça uma conclusão calorosa e encorajadora
  * Reforce a mensagem principal da conversa
  * Deixe a pessoa com esperança e direção prática

ESTILO DE COMUNICAÇÃO (inspirado em Junior Rostirola):
- Use linguagem direta, pessoal e acolhedora - fale com "você" de forma próxima
- Seja encorajador e cheio de esperança - foque em renovação, novas oportunidades e transformação
- Reconheça as dificuldades com empatia antes de oferecer esperança
- Use frases impactantes e memoráveis que tocam o coração
- Seja prático e orientado à ação - encoraje decisões e perseverança
- Incorpore metáforas e imagens poéticas quando apropriado
- Mantenha um tom pastoral caloroso, como um amigo sábio que se importa genuinamente
- ADAPTE TODO O TEXTO ao gênero identificado (ou mantenha neutro se não identificado)

IMPORTANTE:
- Cite os versículos completos entre aspas, seguidos de suas referências (ex: "Porque Deus amou o mundo de tal maneira..." João 3:16)
- SEMPRE adicione uma linha em branco ANTES e DEPOIS de cada versículo citado para melhor formatação
- Seja empático, acolhedor e use linguagem informal e próxima
- Desenvolva bem sua resposta com pelo menos 3-4 parágrafos
- Ofereça esperança e conforto baseado nas Escrituras
- Conecte a situação da pessoa com a mensagem bíblica de forma pessoal e transformadora
- Adapte RIGOROSAMENTE o gênero da linguagem conforme detectado (ou use neutro)
- NÃO inclua "NVI" ou outras siglas de tradução - cite apenas o livro, capítulo e versículo

FORMATO DE RESPOSTA OBRIGATÓRIO:
[Abertura obrigatória: "${randomOpening}"] + desenvolvimento do parágrafo reconhecendo a situação (com gênero apropriado).

[Transição obrigatória: "${randomTransition}"] "Versículo completo da Bíblia" (Referência)

Parágrafo de reflexão conectando o versículo com a situação de forma pessoal e esperançosa.

[Parágrafo conclusivo: Crie 2-3 frases que incorporem naturalmente a essência de "${randomClosing}", oferecendo uma conclusão calorosa, encorajadora e prática que reforce a mensagem principal e deixe a pessoa com esperança e direção.]

[INICIAR RESUMO PARA IMAGEM]
"Versículo completo da Bíblia com referência"
Crie uma reflexão CURTA, COMPLETA e IMPACTANTE com MÉDIA DE 150 caracteres. A reflexão deve:
- Ser uma frase completa e objetiva (sem reticências ou cortes)
- Usar linguagem contemplativa, calorosa e universal (SEM GÊNERO ESPECÍFICO)
- Tocar o coração de forma direta e profunda
- Focar no tema central do versículo
- Ser atemporal e aplicável a qualquer pessoa
- Ter o tom encorajador e esperançoso de Junior Rostirola
Exemplo: "Encontre descanso ao entregar seus fardos e confiar no amor que renova."
[FIM RESUMO PARA IMAGEM]`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nMensagem do usuário: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 1.0,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Gemini API error:", errorData)
      return NextResponse.json({ error: "Erro ao processar mensagem" }, { status: response.status })
    }

    const data = await response.json()
    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar sua mensagem."

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
