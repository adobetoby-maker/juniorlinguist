export interface StoryPair { en: string; es: string }
export interface KidsStory {
  id: string
  moduleId: string
  emoji: string
  title: string
  titleEs: string
  level: 1 | 2 | 3
  sentences: StoryPair[]
  question: string
  answerHint: string
}

export const KIDS_STORIES: KidsStory[] = [
  {
    id: 'friendly-dog',
    moduleId: 'animals',
    emoji: '🐶',
    title: 'The Friendly Dog',
    titleEs: 'El perro amistoso',
    level: 1,
    sentences: [
      { en: 'My dog is named Coco.', es: 'Mi perro se llama Coco.' },
      { en: 'He is brown and very friendly.', es: 'Es de color café y muy amistoso.' },
      { en: 'Every morning, Coco wakes me up.', es: 'Cada mañana, Coco me despierta.' },
      { en: 'We walk to the park together.', es: 'Caminamos juntos al parque.' },
      { en: 'He loves to chase butterflies and birds.', es: 'Le encanta perseguir mariposas y pájaros.' },
      { en: 'At the park, he plays with other dogs.', es: 'En el parque, juega con otros perros.' },
      { en: 'At night, Coco sleeps next to my bed.', es: 'Por la noche, Coco duerme junto a mi cama.' },
      { en: 'He is my best friend.', es: 'Él es mi mejor amigo.' },
    ],
    question: 'What is the name of the dog?',
    answerHint: 'Coco',
  },
  {
    id: 'school-day',
    moduleId: 'school',
    emoji: '🏫',
    title: 'A Day at School',
    titleEs: 'Un día en la escuela',
    level: 1,
    sentences: [
      { en: 'I wake up early and put on my backpack.', es: 'Me levanto temprano y me pongo la mochila.' },
      { en: 'My teacher is very kind.', es: 'Mi maestra es muy amable.' },
      { en: 'Today we have a quiz on math.', es: 'Hoy tenemos una prueba de matemáticas.' },
      { en: 'I study my notebook before class starts.', es: 'Estudio mi cuaderno antes de que empiece la clase.' },
      { en: 'My pencil breaks and I borrow one from a friend.', es: 'Mi lápiz se rompe y le pido uno prestado a un amigo.' },
      { en: 'During recess, we run and play soccer.', es: 'Durante el recreo, corremos y jugamos fútbol.' },
      { en: 'After school, I go to the library.', es: 'Después de la escuela, voy a la biblioteca.' },
      { en: 'I love learning new things every day.', es: 'Me encanta aprender cosas nuevas cada día.' },
    ],
    question: 'Where does the student go after school?',
    answerHint: 'the library / la biblioteca',
  },
  {
    id: 'family-dinner',
    moduleId: 'family',
    emoji: '🍽️',
    title: 'Family Dinner',
    titleEs: 'La cena familiar',
    level: 1,
    sentences: [
      { en: 'Every Sunday, the whole family eats together.', es: 'Cada domingo, toda la familia come junta.' },
      { en: 'My grandmother makes the best food.', es: 'Mi abuela hace la mejor comida.' },
      { en: 'My father sets the table and my mother cooks.', es: 'Mi papá pone la mesa y mi mamá cocina.' },
      { en: 'My brother and sister help wash the dishes.', es: 'Mi hermano y mi hermana ayudan a lavar los platos.' },
      { en: 'My grandfather tells funny stories at dinner.', es: 'Mi abuelo cuenta historias chistosas en la cena.' },
      { en: 'We talk and laugh for a long time.', es: 'Hablamos y reímos por mucho tiempo.' },
      { en: 'After dinner, we all sit in the living room.', es: 'Después de la cena, todos nos sentamos en la sala.' },
      { en: 'I love being with my family.', es: 'Me encanta estar con mi familia.' },
    ],
    question: 'Who tells funny stories at dinner?',
    answerHint: 'grandfather / el abuelo',
  },
  {
    id: 'the-big-game',
    moduleId: 'sports',
    emoji: '⚽',
    title: 'The Big Game',
    titleEs: 'El gran partido',
    level: 2,
    sentences: [
      { en: 'Today is the day of the championship game.', es: 'Hoy es el día del partido del campeonato.' },
      { en: 'Our team has practiced every day this week.', es: 'Nuestro equipo ha practicado todos los días esta semana.' },
      { en: 'The referee blows the whistle and the game starts.', es: 'El árbitro sopla el silbato y el partido empieza.' },
      { en: 'In the first half, neither team scores a goal.', es: 'En el primer tiempo, ningún equipo mete un gol.' },
      { en: 'At halftime, our coach gives us advice.', es: 'En el descanso, nuestro entrenador nos da consejos.' },
      { en: 'In the second half, our best player scores!', es: 'En el segundo tiempo, ¡nuestro mejor jugador anota!' },
      { en: 'We win the game and become champions.', es: 'Ganamos el partido y nos convertimos en campeones.' },
      { en: 'The whole team celebrates together.', es: 'Todo el equipo celebra junto.' },
    ],
    question: 'When does the best player score?',
    answerHint: 'in the second half / en el segundo tiempo',
  },
  {
    id: 'our-solar-system',
    moduleId: 'science',
    emoji: '🚀',
    title: 'Our Solar System',
    titleEs: 'Nuestro sistema solar',
    level: 2,
    sentences: [
      { en: 'Our solar system has eight planets.', es: 'Nuestro sistema solar tiene ocho planetas.' },
      { en: 'Earth is the third planet from the sun.', es: 'La Tierra es el tercer planeta desde el sol.' },
      { en: 'Mars is red because of iron oxide on its surface.', es: 'Marte es rojo debido al óxido de hierro en su superficie.' },
      { en: 'Jupiter is the largest planet in our solar system.', es: 'Júpiter es el planeta más grande de nuestro sistema solar.' },
      { en: 'Scientists use a telescope to study the stars.', es: 'Los científicos usan un telescopio para estudiar las estrellas.' },
      { en: 'A discovery about a new planet is very exciting.', es: 'Un descubrimiento sobre un nuevo planeta es muy emocionante.' },
      { en: 'One day, humans may travel to other planets.', es: 'Algún día, los seres humanos podrían viajar a otros planetas.' },
    ],
    question: 'Which is the largest planet?',
    answerHint: 'Jupiter / Júpiter',
  },
  {
    id: 'kitchen-adventure',
    moduleId: 'food',
    emoji: '🍳',
    title: 'A Kitchen Adventure',
    titleEs: 'Una aventura en la cocina',
    level: 1,
    sentences: [
      { en: 'I am very hungry after school.', es: 'Tengo mucha hambre después de la escuela.' },
      { en: 'My mom teaches me how to make breakfast for dinner.', es: 'Mi mamá me enseña cómo preparar el desayuno para la cena.' },
      { en: 'We use bread, eggs, fruit, and water.', es: 'Usamos pan, huevos, fruta y agua.' },
      { en: 'I cut the strawberries for a salad.', es: 'Corto las fresas para una ensalada.' },
      { en: 'The food smells delicious while it cooks.', es: 'La comida huele deliciosa mientras se cocina.' },
      { en: 'We sit down for dinner at the kitchen table.', es: 'Nos sentamos a cenar en la mesa de la cocina.' },
      { en: 'Everything is delicious and I eat a lot.', es: 'Todo está delicioso y como mucho.' },
      { en: 'Cooking with family is my favorite thing to do.', es: 'Cocinar con la familia es mi actividad favorita.' },
    ],
    question: 'What do they cut for the salad?',
    answerHint: 'strawberries / las fresas',
  },
]
