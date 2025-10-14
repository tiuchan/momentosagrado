import { type NextRequest, NextResponse } from "next/server"
import { getAvailableThemes, getVerseCount, getRandomVersesFromAll, getRandomVerses } from "@/lib/verses"

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

  // Theme detection patterns
  const themePatterns: Record<string, RegExp[]> = {
    cansaco: [
      /\b(cansad[oa]|exaust[oa]|fatigad[oa]|esgotad[oa]|sem\s+energia|sem\s+forças)\b/,
      /\bestou\s+cansad[oa]\b/,
      /\bme\s+sinto\s+cansad[oa]\b/,
      /\bpreciso\s+de\s+descanso\b/,
    ],
    ansiedade: [
      /\b(ansios[oa]|preocupad[oa]|nervos[oa]|estressad[oa]|angustiad[oa])\b/,
      /\bestou\s+ansios[oa]\b/,
      /\bme\s+sinto\s+ansios[oa]\b/,
      /\bansiedade\b/,
    ],
    alegria: [
      /\b(alegr[ea]|feliz|contente|grat[oa]|celebr)\b/,
      /\bestou\s+feliz\b/,
      /\bquero\s+celebrar\b/,
      /\balegria\b/,
    ],
    medo: [/\b(medo|assustad[oa]|amedrontad[oa]|temor|receios[oa])\b/, /\bestou\s+com\s+medo\b/, /\btenho\s+medo\b/],
    solidao: [
      /\b(sozinho|sozinha|solid[ãa]o|isolad[oa]|abandonad[oa])\b/,
      /\bestou\s+sozinho\b/,
      /\bme\s+sinto\s+s[óo]\b/,
    ],
    fe: [/\b(f[ée]|cren[çc]a|acreditar|confian[çc]a\s+em\s+deus)\b/, /\bfortalecer\s+minha\s+f[ée]\b/],
    esperanca: [/\b(esperan[çc]a|esperan[çc]oso|futuro|renova[çc][ãa]o)\b/, /\bpreciso\s+de\s+esperan[çc]a\b/],
    amor: [/\b(amor|amad[oa]|amar|carinho)\b/, /\bamor\s+de\s+deus\b/],
    gratidao: [/\b(gratid[ãa]o|grat[oa]|agradecer|obrigad[oa])\b/, /\bexpresar\s+gratid[ãa]o\b/],
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
      // Select 3-4 random verses from the detected theme
      const verses = getRandomVerses(detectedTheme, 4)
      selectedVerses = verses.map((v) => `"${v.text}" (${v.ref})`).join("\n\n")
    }

    // Estatísticas dos versículos disponíveis
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

🌟 VARIAÇÕES DE ABERTURA - NUNCA REPITA A MESMA ESTRUTURA:

Tipo 1 - Reconhecimento Direto do Sentimento:
${detectedGender === "feminine" ? '"Sei que você está passando por um momento difícil, querida..."' : detectedGender === "masculine" ? '"Sei que você está passando por um momento difícil, querido..."' : '"Sei que você está passando por um momento difícil..."'}

Tipo 2 - Empatia Imediata:
${detectedGender === "feminine" ? '"Entendo sua dor, minha amiga..."' : detectedGender === "masculine" ? '"Entendo sua dor, meu amigo..."' : '"Entendo o que você está sentindo..."'}

Tipo 3 - Afirmação de Esperança:
"Há luz no fim do túnel, e quero compartilhar isso com você..."

Tipo 4 - Acolhimento Caloroso:
${detectedGender === "feminine" ? '"Que bom que você veio conversar, querida..."' : detectedGender === "masculine" ? '"Que bom que você veio conversar, querido..."' : '"Que bom que você está aqui..."'}

Tipo 5 - Reconhecimento de Coragem:
${detectedGender === "feminine" ? '"É preciso coragem para compartilhar o que você está sentindo, e admiro isso em você..."' : detectedGender === "masculine" ? '"É preciso coragem para compartilhar o que você está sentindo, e admiro isso em você..."' : '"É preciso coragem para buscar ajuda, e isso já é um grande passo..."'}

Tipo 6 - Conexão Espiritual:
"Deus vê seu coração neste momento, e Ele tem uma palavra especial para você..."

Tipo 7 - Validação do Sentimento:
${detectedGender === "feminine" ? '"O que você está sentindo é real e válido, querida..."' : detectedGender === "masculine" ? '"O que você está sentindo é real e válido, querido..."' : '"Seus sentimentos são válidos e compreensíveis..."'}

Tipo 8 - Promessa de Companhia:
"Você não precisa enfrentar isso sozinho. Vamos caminhar juntos..."

⚠️ IMPORTANTE: Escolha UM tipo diferente a cada conversa. NUNCA use "meu querido amigo" ou "minha querida amiga" como padrão repetitivo!

ESTILO DE COMUNICAÇÃO (inspirado em Junior Rostirola com VARIAÇÕES ILIMITADAS):
- Use o estilo pastoral de Junior Rostirola como BASE, mas crie variações únicas em cada resposta
- Varie a estrutura: às vezes mais poética, às vezes mais direta, às vezes mais contemplativa
- Alterne entre diferentes metáforas e imagens (não repita as mesmas)
- Use linguagem direta, pessoal e acolhedora - fale com "você" de forma próxima
- Seja encorajador e cheio de esperança - foque em renovação, novas oportunidades e transformação
- Reconheça as dificuldades com empatia antes de oferecer esperança
- Use frases impactantes e memoráveis que tocam o coração
- Seja prático e orientado à ação - encoraje decisões e perseverança
- Incorpore metáforas e imagens poéticas quando apropriado (mas varie sempre)
- Mantenha um tom pastoral caloroso, como um amigo sábio que se importa genuinamente
- NUNCA repita exatamente a mesma estrutura ou frases - seja criativo e autêntico
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

FORMATO DE RESPOSTA:
Parágrafo introdutório acolhedor reconhecendo a situação (com gênero apropriado e abertura VARIADA - nunca repita).

"Versículo completo da Bíblia" (Referência)

Parágrafo de reflexão conectando o versículo com a situação de forma pessoal e esperançosa.

Parágrafo final de encorajamento prático e transformador.

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
