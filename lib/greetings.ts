export interface Greeting {
  message: string
  emoji: string
}

const morningGreetings: string[] = [
  "Bom dia, {emoji} Que seu dia seja cheio de fé. Como posso te ajudar a encontrar conforto hoje?",
  "Bom dia, {emoji} Que a luz divina ilumine seu caminho. Como posso te ajudar hoje?",
  "Bom dia, {emoji} Que Deus abençoe cada passo seu. Como posso te confortar hoje?",
  "Bom dia, {emoji} Que a paz de Cristo esteja contigo. Como posso te ajudar?",
  "Bom dia, {emoji} Que este dia seja repleto de bênçãos. Como posso te auxiliar?",
  "Bom dia, {emoji} Que a graça divina te acompanhe. Como posso te ajudar a encontrar paz?",
  "Bom dia, {emoji} Que seu coração seja renovado hoje. Como posso te confortar?",
  "Bom dia, {emoji} Que a esperança floresça em você. Como posso te ajudar hoje?",
  "Bom dia, {emoji} Que Deus te fortaleça neste novo dia. Como posso te auxiliar?",
  "Bom dia, {emoji} Que a alegria do Senhor seja sua força. Como posso te ajudar?",
  "Bom dia, {emoji} Que você sinta o amor de Deus hoje. Como posso te confortar?",
  "Bom dia, {emoji} Que a sabedoria divina te guie. Como posso te ajudar a encontrar paz?",
  "Bom dia, {emoji} Que este dia traga renovação. Como posso te auxiliar hoje?",
  "Bom dia, {emoji} Que a presença de Deus te envolva. Como posso te ajudar?",
  "Bom dia, {emoji} Que você encontre força na fé. Como posso te confortar hoje?",
]

const afternoonGreetings: string[] = [
  "Boa tarde, {emoji} Que Deus renove suas forças. Como posso te ajudar a encontrar conforto?",
  "Boa tarde, {emoji} Que a paz divina esteja contigo. Como posso te auxiliar hoje?",
  "Boa tarde, {emoji} Que você sinta o amor de Cristo. Como posso te ajudar?",
  "Boa tarde, {emoji} Que a esperança te fortaleça. Como posso te confortar?",
  "Boa tarde, {emoji} Que Deus te dê descanso. Como posso te ajudar hoje?",
  "Boa tarde, {emoji} Que a graça divina te sustente. Como posso te auxiliar?",
  "Boa tarde, {emoji} Que você encontre paz neste momento. Como posso te ajudar?",
  "Boa tarde, {emoji} Que o Senhor te abençoe. Como posso te confortar hoje?",
  "Boa tarde, {emoji} Que a fé te renove. Como posso te ajudar a encontrar paz?",
  "Boa tarde, {emoji} Que Deus te console. Como posso te auxiliar neste momento?",
  "Boa tarde, {emoji} Que você sinta a presença divina. Como posso te ajudar?",
  "Boa tarde, {emoji} Que a luz de Cristo te guie. Como posso te confortar?",
  "Boa tarde, {emoji} Que seu coração encontre descanso. Como posso te ajudar hoje?",
  "Boa tarde, {emoji} Que a paz do Senhor te envolva. Como posso te auxiliar?",
  "Boa tarde, {emoji} Que você seja fortalecido pela fé. Como posso te ajudar?",
]

const eveningGreetings: string[] = [
  "Boa noite, {emoji} Que Deus te traga paz. Como posso te ajudar a encontrar conforto hoje?",
  "Boa noite, {emoji} Que você tenha um descanso abençoado. Como posso te auxiliar?",
  "Boa noite, {emoji} Que a paz divina acalme seu coração. Como posso te ajudar?",
  "Boa noite, {emoji} Que o Senhor te dê serenidade. Como posso te confortar?",
  "Boa noite, {emoji} Que você encontre paz antes de dormir. Como posso te ajudar?",
  "Boa noite, {emoji} Que Deus te abençoe com tranquilidade. Como posso te auxiliar?",
  "Boa noite, {emoji} Que a presença divina te conforte. Como posso te ajudar hoje?",
  "Boa noite, {emoji} Que seu coração encontre descanso. Como posso te confortar?",
  "Boa noite, {emoji} Que a luz de Cristo ilumine sua noite. Como posso te ajudar?",
  "Boa noite, {emoji} Que você sinta o amor de Deus. Como posso te auxiliar?",
  "Boa noite, {emoji} Que a paz do Senhor esteja contigo. Como posso te ajudar?",
  "Boa noite, {emoji} Que Deus te dê um sono tranquilo. Como posso te confortar?",
  "Boa noite, {emoji} Que você seja envolvido pela graça divina. Como posso te ajudar?",
  "Boa noite, {emoji} Que a esperança te acompanhe. Como posso te auxiliar hoje?",
  "Boa noite, {emoji} Que o Senhor te abençoe nesta noite. Como posso te ajudar?",
]

const lateNightGreetings: string[] = [
  "Olá, {emoji} Que Deus te dê paz neste momento. Como posso te ajudar a encontrar conforto?",
  "Olá, {emoji} Que você encontre descanso na fé. Como posso te auxiliar?",
  "Olá, {emoji} Que a presença divina te conforte agora. Como posso te ajudar?",
  "Olá, {emoji} Que o Senhor acalme seu coração. Como posso te confortar?",
  "Olá, {emoji} Que você sinta a paz de Cristo. Como posso te ajudar neste momento?",
  "Olá, {emoji} Que Deus te abençoe com serenidade. Como posso te auxiliar?",
  "Olá, {emoji} Que a luz divina te guie. Como posso te ajudar a encontrar paz?",
  "Olá, {emoji} Que você encontre conforto na oração. Como posso te ajudar?",
  "Olá, {emoji} Que o amor de Deus te envolva. Como posso te confortar agora?",
  "Olá, {emoji} Que a esperança te fortaleça. Como posso te auxiliar?",
  "Olá, {emoji} Que você sinta a graça divina. Como posso te ajudar?",
  "Olá, {emoji} Que Deus te dê tranquilidade. Como posso te confortar neste momento?",
  "Olá, {emoji} Que a paz do Senhor esteja contigo. Como posso te ajudar?",
  "Olá, {emoji} Que você encontre força na fé. Como posso te auxiliar agora?",
  "Olá, {emoji} Que o Senhor te abençoe. Como posso te ajudar a encontrar paz?",
]

const timeEmojis = {
  morning: "🌞",
  afternoon: "☀️",
  evening: "🌙",
  lateNight: "✨",
}

export function getGreeting(): Greeting {
  const hour = new Date().getHours()

  let greetings: string[]
  let emoji: string

  if (hour >= 5 && hour < 12) {
    // Morning: 5am - 11:59am
    greetings = morningGreetings
    emoji = timeEmojis.morning
  } else if (hour >= 12 && hour < 18) {
    // Afternoon: 12pm - 5:59pm
    greetings = afternoonGreetings
    emoji = timeEmojis.afternoon
  } else if (hour >= 18 && hour < 22) {
    // Evening: 6pm - 9:59pm
    greetings = eveningGreetings
    emoji = timeEmojis.evening
  } else {
    // Late night: 10pm - 4:59am
    greetings = lateNightGreetings
    emoji = timeEmojis.lateNight
  }

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]
  const message = randomGreeting.replace("{emoji}", emoji)

  return { message, emoji }
}
