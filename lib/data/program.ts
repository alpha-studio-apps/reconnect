import type { ProgramDay } from "@/lib/types";

export const PROGRAM_DAYS: ProgramDay[] = [
  {
    day: 1,
    theme: "Llegada",
    subtitle: "¿Qué trajiste contigo?",
    morningPrompt:
      "Describe dónde estás ahora mismo — no físicamente, sino emocionalmente. ¿Qué peso has venido cargando? ¿Qué te llevó a decidir estar aquí?",
    eveningPrompt:
      "¿Qué notaste hoy que quizás habrías ignorado hace un mes? Algo pequeño — una textura, un sonido, un instante.",
    practiceLabel: "Cinco minutos de quietud",
    practiceDescription:
      "Busca un lugar tranquilo. Pon un temporizador de cinco minutos. Sin teléfono, sin música, sin tareas. Simplemente siéntate con lo que surja.",
  },
  {
    day: 2,
    theme: "Respiración",
    subtitle: "Lo único que siempre estuvo ahí.",
    morningPrompt:
      "Coloca las manos sobre tu vientre. Inhala despacio. ¿Dónde sientes tensión? ¿Dónde resiste tu cuerpo el descanso?",
    eveningPrompt:
      "¿Cuándo contuviste la respiración hoy — literal o figuradamente? ¿Qué estaba pasando en esos momentos?",
    practiceLabel: "Respiración 4-7-8",
    practiceDescription:
      "Inhala durante 4 tiempos, mantén durante 7, exhala durante 8. Repite cuatro veces. Observa qué cambia.",
  },
  {
    day: 3,
    theme: "Tierra",
    subtitle: "Lo que te sostiene cuando nada más lo hace.",
    morningPrompt:
      "¿Qué significa para ti sentirte estable? Describe un recuerdo en el que te sentiste completamente enraizado — ¿qué estaba presente en ese momento?",
    eveningPrompt:
      "¿Qué te desestabilizó hoy, aunque sea levemente? ¿Y qué te devolvió al centro?",
    practiceLabel: "Caminar sin destino",
    practiceDescription:
      "Sal a caminar quince minutos sin un destino específico. Deja los auriculares en casa. Presta atención a lo que sienten tus pies.",
  },
  {
    day: 4,
    theme: "Raíces",
    subtitle: "De dónde vienes da forma a hacia dónde vas.",
    morningPrompt:
      "¿Qué de tu infancia sigue vivo en ti — una creencia, un patrón, una forma de responder — que aún no has examinado del todo?",
    eveningPrompt:
      "Piensa en alguien que te haya marcado profundamente. ¿Qué te enseñó, y qué dejó sin terminar?",
    practiceLabel: "Una carta honesta",
    practiceDescription:
      "Escribe una carta breve a tu yo más joven — no más de un párrafo. No necesitas enviarla. Solo escríbela.",
  },
  {
    day: 5,
    theme: "Vínculos",
    subtitle: "¿Quién te sostiene?",
    morningPrompt:
      "Nombra a las personas en tu vida con las que más te sientes tú mismo — sin actuar, sin achicarte. ¿Qué ofrecen que los demás no?",
    eveningPrompt:
      "¿En qué relaciones has estado menos presente de lo que podrías? No por maldad — simplemente ausente, distraído, a la defensiva.",
    practiceLabel: "Una conversación real",
    practiceDescription:
      "Comunícate con alguien con quien no hayas hablado honestamente en un tiempo. No una actualización de vida — una pregunta real. ¿Cómo estás, de verdad?",
  },
  {
    day: 6,
    theme: "Alegría",
    subtitle: "Lo que te ilumina desde adentro.",
    morningPrompt:
      "¿Cuándo fue la última vez que perdiste la noción del tiempo? Describe qué estabas haciendo — con detalle, sin apuro. ¿Qué revela esa actividad sobre ti?",
    eveningPrompt:
      "¿Dónde sentiste un destello de auténtica vitalidad hoy — aunque fuera breve? ¿Qué condiciones lo permitieron?",
    practiceLabel: "Haz algo solo por alegría",
    practiceDescription:
      "Dedica veinte minutos a hacer algo que amas puramente por sí mismo — no para producir, no para compartir. Deja que sea solo para ti.",
  },
  {
    day: 7,
    theme: "Quietud",
    subtitle: "A mitad del camino. Descansa aquí.",
    morningPrompt:
      "Llevas siete días. ¿Qué te ha sorprendido de esta práctica hasta ahora? ¿Sobre qué has evitado escribir?",
    eveningPrompt:
      "¿Qué necesita tu cuerpo ahora mismo que no le has dado? No una lista de mejoras — una sola cosa honesta.",
    practiceLabel: "Descanso completo",
    practiceDescription:
      "Esta noche, duerme treinta minutos antes de lo habitual. Sin pantallas en la cama. Simplemente permítete terminar el día.",
  },
  {
    day: 8,
    theme: "Duelo",
    subtitle: "Lo que aún estás soltando.",
    morningPrompt:
      "¿Qué pérdida sigues cargando — una persona, una versión de ti mismo, un camino no tomado — que rara vez te permites reconocer?",
    eveningPrompt:
      "El duelo no viene solo de la muerte. ¿Qué finales no has honrado del todo? ¿Qué mereció una verdadera despedida?",
    practiceLabel: "Sostén el sentimiento",
    practiceDescription:
      "Elige un duelo. Siéntate con él durante cinco minutos sin intentar arreglarlo ni reencuadrarlo. Sin lados positivos. Solo el peso de lo que es.",
  },
  {
    day: 9,
    theme: "Miedo",
    subtitle: "Lo que se esconde detrás de la duda.",
    morningPrompt:
      "¿Qué intentarías si supieras con certeza que no fracasarías — y también que nadie te juzgaría? ¿Qué revela eso?",
    eveningPrompt:
      "¿Dónde apareció el miedo hoy — disfrazado de practicidad, ocupación o indiferencia? ¿Qué estaba protegiendo en realidad?",
    practiceLabel: "Un pequeño acto de valentía",
    practiceDescription:
      "Haz una pequeña cosa que hayas estado postergando por miedo. No necesita ser dramática. Solo un paso hacia adelante.",
  },
  {
    day: 10,
    theme: "Valores",
    subtitle: "Lo que no cambiarías por nada.",
    morningPrompt:
      "Enumera tres cosas de las que no cederías aunque te costara algo — una amistad, una oportunidad, comodidad. ¿Por qué esas tres?",
    eveningPrompt:
      "¿Dónde en tu vida actual están tus acciones desalineadas con tus valores? No es un juicio — solo un inventario honesto.",
    practiceLabel: "Un ajuste de rumbo",
    practiceDescription:
      "Elige un área donde tu vida y tus valores estén desalineados. Da un pequeño paso hoy — aunque sea simbólico — hacia la alineación.",
  },
  {
    day: 11,
    theme: "Propósito",
    subtitle: "Lo que quieres que haya importado.",
    morningPrompt:
      "Si supieras que tu tiempo restante es limitado, ¿en qué querrías haberlo invertido? No logros — presencia, contribución, significado.",
    eveningPrompt:
      "¿Qué trabajo — pagado o no, visto o no — te hace sentir que estás en el lugar correcto, haciendo lo correcto?",
    practiceLabel: "Escribe tu frase",
    practiceDescription:
      "Intenta escribir el propósito de tu vida en una sola frase. No una meta. No una identidad. Una dirección hacia la que te mueves.",
  },
  {
    day: 12,
    theme: "Futuro",
    subtitle: "La persona en la que te estás convirtiendo.",
    morningPrompt:
      "Describe a la persona que quieres ser dentro de dos años — no lo que ha logrado, sino cómo se mueve por el mundo. ¿De qué está libre?",
    eveningPrompt:
      "¿Qué hábito, creencia o historia del pasado sigues cargando, pero la versión futura de ti ya ha soltado?",
    practiceLabel: "Algo que soltar",
    practiceDescription:
      "Identifica algo — un rencor, una historia sobre ti mismo, un hábito — que estás dispuesto a empezar a soltar. Escríbelo. Di: lo estoy dejando ir.",
  },
  {
    day: 13,
    theme: "Gratitud",
    subtitle: "Lo que te sostiene en silencio.",
    morningPrompt:
      "¿Qué está funcionando en tu vida que rara vez reconoces — no por ingratitud, sino porque la gratitud por ello se siente demasiado callada para contar?",
    eveningPrompt:
      "Nombra a tres personas que te estén sosteniendo sin que se lo hayas pedido. ¿Les has dicho lo que significan para ti? ¿Qué te lo impide?",
    practiceLabel: "Expresa una gratitud",
    practiceDescription:
      "Dile a alguien específicamente lo que significa para ti — no de manera general, sino con un recuerdo o una cualidad concreta. Hazlo hoy.",
  },
  {
    day: 14,
    theme: "Retorno",
    subtitle: "La persona que llegó no es la misma que se va.",
    morningPrompt:
      "Mirando atrás en estos catorce días: ¿qué cambió, aunque sea levemente? ¿Qué encontraste en ti mismo que no esperabas?",
    eveningPrompt:
      "¿Cuál es la única cosa que quieres llevar de esta práctica al resto de tu vida? No una resolución. Una manera de ser.",
    practiceLabel: "Sella este momento",
    practiceDescription:
      "Siéntate en silencio durante diez minutos. Respira. Deja que estos catorce días se asienten. Luego cierra este diario con intención — y con gratitud por tu propia honestidad.",
  },
];

export function getProgramDay(day: number): ProgramDay | undefined {
  return PROGRAM_DAYS.find((d) => d.day === day);
}
