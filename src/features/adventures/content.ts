// Authored starter curriculum. Catalog presence is not external curriculum review or proficiency certification.
export interface Word { es: string; en: string }
export interface AdventureLesson {
  id: string; number: number; title: string; goal: string; minutes: number
  newWords: Word[]; reviewWords: Word[]; story: Word[]
  question: string; options: string[]; answer: number
  practice: string; stretch: string
}
export interface AdventureSeries {
  id: string; title: string; emoji: string; color: string; moduleId: string
  description: string; lessons: AdventureLesson[]
}
export const ADVENTURES: AdventureSeries[] = [
  {
    "id": "animals",
    "title": "My Animal Adventures",
    "emoji": "🐾",
    "color": "#047857",
    "moduleId": "animals",
    "description": "Meet Coco, care for pets, and solve an animal mystery.",
    "lessons": [
      {
        "title": "Meet Coco",
        "goal": "I can name a dog and a cat.",
        "newWords": [
          {
            "es": "perro",
            "en": "dog"
          },
          {
            "es": "gato",
            "en": "cat"
          },
          {
            "es": "se llama",
            "en": "is called"
          }
        ],
        "story": [
          {
            "es": "Es un perro.",
            "en": "It is a dog."
          },
          {
            "es": "El perro se llama Coco.",
            "en": "The dog is called Coco."
          },
          {
            "es": "Es un gato.",
            "en": "It is a cat."
          },
          {
            "es": "El gato se llama Luna.",
            "en": "The cat is called Luna."
          }
        ],
        "question": "Who is Coco?",
        "options": [
          "A dog",
          "A cat",
          "A bird"
        ],
        "answer": 0,
        "practice": "Introduce an imaginary dog and cat.",
        "stretch": "Give each animal a made-up name.",
        "id": "animals-1",
        "number": 1,
        "reviewWords": [],
        "minutes": 7
      },
      {
        "title": "A Splash of Color",
        "goal": "I can describe an animal’s color.",
        "newWords": [
          {
            "es": "café",
            "en": "brown"
          },
          {
            "es": "negro",
            "en": "black"
          },
          {
            "es": "blanco",
            "en": "white"
          }
        ],
        "story": [
          {
            "es": "El perro se llama Coco.",
            "en": "The dog is called Coco."
          },
          {
            "es": "Coco es café.",
            "en": "Coco is brown."
          },
          {
            "es": "El gato se llama Luna.",
            "en": "The cat is called Luna."
          },
          {
            "es": "Luna es de color negro.",
            "en": "Luna is black."
          }
        ],
        "question": "What color is Coco?",
        "options": [
          "White",
          "Brown",
          "Black"
        ],
        "answer": 1,
        "practice": "Describe Coco’s color, then invent a color for a cat.",
        "stretch": "Use “El gato es blanco” to describe a white male cat.",
        "id": "animals-2",
        "number": 2,
        "reviewWords": [
          {
            "es": "perro",
            "en": "dog"
          },
          {
            "es": "gato",
            "en": "cat"
          },
          {
            "es": "se llama",
            "en": "is called"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Big, Small, Happy",
        "goal": "I can describe size and feelings.",
        "newWords": [
          {
            "es": "grande",
            "en": "big"
          },
          {
            "es": "pequeño",
            "en": "small"
          },
          {
            "es": "feliz",
            "en": "happy"
          }
        ],
        "story": [
          {
            "es": "Coco es un perro pequeño.",
            "en": "Coco is a small dog."
          },
          {
            "es": "Coco es café y feliz.",
            "en": "Coco is brown and happy."
          },
          {
            "es": "El gato es grande.",
            "en": "The cat is big."
          },
          {
            "es": "El gato es blanco y feliz.",
            "en": "The cat is white and happy."
          }
        ],
        "question": "Which animal is small?",
        "options": [
          "The cat",
          "Both animals",
          "Coco"
        ],
        "answer": 2,
        "practice": "Describe a dog using a color and a size.",
        "stretch": "Add “y feliz” to describe how the animal feels.",
        "id": "animals-3",
        "number": 3,
        "reviewWords": [
          {
            "es": "café",
            "en": "brown"
          },
          {
            "es": "negro",
            "en": "black"
          },
          {
            "es": "blanco",
            "en": "white"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Count the Pets",
        "goal": "I can count up to three pets.",
        "newWords": [
          {
            "es": "uno",
            "en": "one"
          },
          {
            "es": "dos",
            "en": "two"
          },
          {
            "es": "tres",
            "en": "three"
          }
        ],
        "story": [
          {
            "es": "Hay un perro pequeño.",
            "en": "There is one small dog."
          },
          {
            "es": "Hay dos gatos grandes.",
            "en": "There are two big cats."
          },
          {
            "es": "Un perro y dos gatos son tres animales.",
            "en": "One dog and two cats are three animals."
          },
          {
            "es": "Los tres animales están felices.",
            "en": "The three animals are happy."
          }
        ],
        "question": "How many cats are there?",
        "options": [
          "Two",
          "One",
          "Three"
        ],
        "answer": 0,
        "practice": "Say “un perro” and “dos gatos.” Notice how gato becomes gatos.",
        "stretch": "Invent a different group of three pets and count them.",
        "id": "animals-4",
        "number": 4,
        "reviewWords": [
          {
            "es": "grande",
            "en": "big"
          },
          {
            "es": "pequeño",
            "en": "small"
          },
          {
            "es": "feliz",
            "en": "happy"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Animal Moves",
        "goal": "I can say what an animal does.",
        "newWords": [
          {
            "es": "corre",
            "en": "runs"
          },
          {
            "es": "salta",
            "en": "jumps"
          },
          {
            "es": "duerme",
            "en": "sleeps"
          }
        ],
        "story": [
          {
            "es": "Coco es un perro pequeño.",
            "en": "Coco is a small dog."
          },
          {
            "es": "Coco corre y salta.",
            "en": "Coco runs and jumps."
          },
          {
            "es": "El gato blanco duerme.",
            "en": "The white cat sleeps."
          },
          {
            "es": "Después, Coco duerme también.",
            "en": "Afterward, Coco sleeps too."
          }
        ],
        "question": "What does the white cat do?",
        "options": [
          "It runs",
          "It sleeps",
          "It jumps"
        ],
        "answer": 1,
        "practice": "Say two things Coco does. Then describe the cat.",
        "stretch": "Combine a color, a size, and an action in your description.",
        "id": "animals-5",
        "number": 5,
        "reviewWords": [
          {
            "es": "uno",
            "en": "one"
          },
          {
            "es": "dos",
            "en": "two"
          },
          {
            "es": "tres",
            "en": "three"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Caring for Coco",
        "goal": "I can say what a pet needs.",
        "newWords": [
          {
            "es": "agua",
            "en": "water"
          },
          {
            "es": "comida",
            "en": "food"
          },
          {
            "es": "necesita",
            "en": "needs"
          }
        ],
        "story": [
          {
            "es": "Coco corre y salta.",
            "en": "Coco runs and jumps."
          },
          {
            "es": "Después, Coco necesita agua.",
            "en": "Afterward, Coco needs water."
          },
          {
            "es": "El gato necesita comida.",
            "en": "The cat needs food."
          },
          {
            "es": "Los animales comen y después duermen.",
            "en": "The animals eat and then sleep."
          }
        ],
        "question": "What does Coco need after running?",
        "options": [
          "A toy",
          "Food",
          "Water"
        ],
        "answer": 2,
        "practice": "Pretend to care for a pet. Say what it needs.",
        "stretch": "Use “después” to put two parts of the pet’s day in order.",
        "id": "animals-6",
        "number": 6,
        "reviewWords": [
          {
            "es": "corre",
            "en": "runs"
          },
          {
            "es": "salta",
            "en": "jumps"
          },
          {
            "es": "duerme",
            "en": "sleeps"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Where Is Coco?",
        "goal": "I can find an animal using a clue.",
        "newWords": [
          {
            "es": "dónde",
            "en": "where"
          },
          {
            "es": "debajo de",
            "en": "under"
          },
          {
            "es": "mesa",
            "en": "table"
          }
        ],
        "story": [
          {
            "es": "¿Dónde está Coco?",
            "en": "Where is Coco?"
          },
          {
            "es": "El gato blanco salta.",
            "en": "The white cat jumps."
          },
          {
            "es": "Coco no corre. Coco duerme.",
            "en": "Coco is not running. Coco is sleeping."
          },
          {
            "es": "Coco está debajo de la mesa.",
            "en": "Coco is under the table."
          }
        ],
        "question": "Where is Coco?",
        "options": [
          "Under the table",
          "With the white cat",
          "Outside"
        ],
        "answer": 0,
        "practice": "Ask “¿Dónde está Coco?” Then answer using the clue.",
        "stretch": "Describe Coco’s color and size before saying where he is.",
        "id": "animals-7",
        "number": 7,
        "reviewWords": [
          {
            "es": "agua",
            "en": "water"
          },
          {
            "es": "comida",
            "en": "food"
          },
          {
            "es": "necesita",
            "en": "needs"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Animal Show and Tell",
        "goal": "I can introduce and describe an imaginary pet.",
        "newWords": [],
        "story": [
          {
            "es": "Mi perro se llama Coco.",
            "en": "My dog is called Coco."
          },
          {
            "es": "Coco es pequeño y de color café.",
            "en": "Coco is small and brown."
          },
          {
            "es": "Coco corre, salta y necesita agua.",
            "en": "Coco runs, jumps, and needs water."
          },
          {
            "es": "Después, Coco duerme debajo de la mesa.",
            "en": "Afterward, Coco sleeps under the table."
          }
        ],
        "question": "Which description matches the story?",
        "options": [
          "A big white cat",
          "A small brown dog",
          "Three black cats"
        ],
        "answer": 1,
        "practice": "Introduce an imaginary pet. Say its name, color, size, and one thing it does.",
        "stretch": "Add what it needs and where it rests. Try without the English help.",
        "id": "animals-8",
        "number": 8,
        "reviewWords": [
          {
            "es": "dónde",
            "en": "where"
          },
          {
            "es": "debajo de",
            "en": "under"
          },
          {
            "es": "mesa",
            "en": "table"
          }
        ],
        "minutes": 7
      }
    ]
  },
  {
    "id": "space",
    "title": "Space Explorers",
    "emoji": "🚀",
    "color": "#6D28D9",
    "moduleId": "science",
    "description": "Count down, meet an astronaut, and tell an imaginary space mission.",
    "lessons": [
      {
        "title": "Ready for Launch",
        "goal": "I can name three things in a space adventure.",
        "newWords": [
          {
            "es": "cohete",
            "en": "rocket"
          },
          {
            "es": "estrella",
            "en": "star"
          },
          {
            "es": "planeta",
            "en": "planet"
          }
        ],
        "story": [
          {
            "es": "Hay un cohete.",
            "en": "There is a rocket."
          },
          {
            "es": "En el cielo hay una estrella.",
            "en": "There is a star in the sky."
          },
          {
            "es": "Hay un planeta también.",
            "en": "There is a planet too."
          },
          {
            "es": "Mi aventura espacial empieza aquí.",
            "en": "My space adventure starts here."
          }
        ],
        "question": "What is ready for the adventure?",
        "options": [
          "A rocket",
          "A boat",
          "A train"
        ],
        "answer": 0,
        "practice": "Point to imaginary pictures and name a rocket, a star, and a planet.",
        "stretch": "Use “Hay…” to say what is in your imaginary sky.",
        "id": "space-1",
        "number": 1,
        "reviewWords": [],
        "minutes": 7
      },
      {
        "title": "Our Space Neighbors",
        "goal": "I can name the Sun, Earth, and Moon.",
        "newWords": [
          {
            "es": "Sol",
            "en": "Sun"
          },
          {
            "es": "Tierra",
            "en": "Earth"
          },
          {
            "es": "Luna",
            "en": "Moon"
          }
        ],
        "story": [
          {
            "es": "El Sol es una estrella.",
            "en": "The Sun is a star."
          },
          {
            "es": "La Tierra es un planeta.",
            "en": "Earth is a planet."
          },
          {
            "es": "La Luna gira alrededor de la Tierra.",
            "en": "The Moon goes around Earth."
          },
          {
            "es": "Nuestro cohete es imaginario.",
            "en": "Our rocket is imaginary."
          }
        ],
        "question": "Which one is a star?",
        "options": [
          "Earth",
          "The Sun",
          "The Moon"
        ],
        "answer": 1,
        "practice": "Say which one is a planet and which one is a star.",
        "stretch": "Try “La Tierra es un planeta. El Sol es una estrella.” without looking.",
        "id": "space-2",
        "number": 2,
        "reviewWords": [
          {
            "es": "cohete",
            "en": "rocket"
          },
          {
            "es": "estrella",
            "en": "star"
          },
          {
            "es": "planeta",
            "en": "planet"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Big and Small",
        "goal": "I can compare sizes in space.",
        "newWords": [
          {
            "es": "grande",
            "en": "big"
          },
          {
            "es": "pequeña",
            "en": "small"
          },
          {
            "es": "más",
            "en": "more"
          }
        ],
        "story": [
          {
            "es": "La Tierra es grande.",
            "en": "Earth is big."
          },
          {
            "es": "La Luna es más pequeña que la Tierra.",
            "en": "The Moon is smaller than Earth."
          },
          {
            "es": "El Sol es más grande que la Tierra.",
            "en": "The Sun is bigger than Earth."
          },
          {
            "es": "El cohete parece pequeño.",
            "en": "The rocket looks small."
          }
        ],
        "question": "Which is smaller than Earth?",
        "options": [
          "The Sun",
          "A star",
          "The Moon"
        ],
        "answer": 2,
        "practice": "Compare the Moon and Earth using “más pequeña.”",
        "stretch": "Compare the Sun and Earth using “más grande.”",
        "id": "space-3",
        "number": 3,
        "reviewWords": [
          {
            "es": "Sol",
            "en": "Sun"
          },
          {
            "es": "Tierra",
            "en": "Earth"
          },
          {
            "es": "Luna",
            "en": "Moon"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Countdown Crew",
        "goal": "I can count down from five.",
        "newWords": [
          {
            "es": "cinco",
            "en": "five"
          },
          {
            "es": "cuatro",
            "en": "four"
          },
          {
            "es": "tres",
            "en": "three"
          }
        ],
        "story": [
          {
            "es": "El cohete está listo.",
            "en": "The rocket is ready."
          },
          {
            "es": "Cinco, cuatro, tres…",
            "en": "Five, four, three…"
          },
          {
            "es": "Dos, uno… ¡Vamos!",
            "en": "Two, one… Let’s go!"
          },
          {
            "es": "En nuestra imaginación, viajamos a la Luna.",
            "en": "In our imagination, we travel to the Moon."
          }
        ],
        "question": "Where does the crew imagine going?",
        "options": [
          "The Moon",
          "The Sun",
          "The ocean"
        ],
        "answer": 0,
        "practice": "Count down: cinco, cuatro, tres, dos, uno.",
        "stretch": "Name the rocket’s destination after your countdown.",
        "id": "space-4",
        "number": 4,
        "reviewWords": [
          {
            "es": "grande",
            "en": "big"
          },
          {
            "es": "pequeña",
            "en": "small"
          },
          {
            "es": "más",
            "en": "more"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Watching the Sky",
        "goal": "I can describe a night-sky scene.",
        "newWords": [
          {
            "es": "noche",
            "en": "night"
          },
          {
            "es": "mira",
            "en": "looks at"
          },
          {
            "es": "brilla",
            "en": "shines"
          }
        ],
        "story": [
          {
            "es": "Es de noche.",
            "en": "It is nighttime."
          },
          {
            "es": "La tripulación mira la Luna.",
            "en": "The crew looks at the Moon."
          },
          {
            "es": "Una estrella brilla en el cielo.",
            "en": "A star shines in the sky."
          },
          {
            "es": "La Luna refleja la luz del Sol.",
            "en": "The Moon reflects sunlight."
          }
        ],
        "question": "What shines in the sky in this story?",
        "options": [
          "The rocket",
          "A star",
          "A helmet"
        ],
        "answer": 1,
        "practice": "Say “Es de noche.” Then say what the crew looks at.",
        "stretch": "Explain in English that the Moon reflects sunlight; it does not make its own light.",
        "id": "space-5",
        "number": 5,
        "reviewWords": [
          {
            "es": "cinco",
            "en": "five"
          },
          {
            "es": "cuatro",
            "en": "four"
          },
          {
            "es": "tres",
            "en": "three"
          }
        ],
        "minutes": 7
      },
      {
        "title": "The Careful Astronaut",
        "goal": "I can describe an astronaut getting ready.",
        "newWords": [
          {
            "es": "astronauta",
            "en": "astronaut"
          },
          {
            "es": "casco",
            "en": "helmet"
          },
          {
            "es": "lista",
            "en": "ready"
          }
        ],
        "story": [
          {
            "es": "La astronauta se llama Ana.",
            "en": "The astronaut is called Ana."
          },
          {
            "es": "Ana lleva un casco.",
            "en": "Ana wears a helmet."
          },
          {
            "es": "Ana mira la Tierra desde el cohete.",
            "en": "Ana looks at Earth from the rocket."
          },
          {
            "es": "Ana está lista para la aventura imaginaria.",
            "en": "Ana is ready for the imaginary adventure."
          }
        ],
        "question": "What does Ana wear?",
        "options": [
          "A crown",
          "A scarf",
          "A helmet"
        ],
        "answer": 2,
        "practice": "Introduce Ana and name what she wears.",
        "stretch": "Add what Ana looks at and say “Ana está lista.”",
        "id": "space-6",
        "number": 6,
        "reviewWords": [
          {
            "es": "noche",
            "en": "night"
          },
          {
            "es": "mira",
            "en": "looks at"
          },
          {
            "es": "brilla",
            "en": "shines"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Mission Control Clues",
        "goal": "I can follow simple position clues.",
        "newWords": [
          {
            "es": "arriba",
            "en": "above"
          },
          {
            "es": "abajo",
            "en": "below"
          },
          {
            "es": "cerca de",
            "en": "near"
          }
        ],
        "story": [
          {
            "es": "Mira el dibujo del cohete.",
            "en": "Look at the drawing of the rocket."
          },
          {
            "es": "La estrella está arriba del cohete.",
            "en": "The star is above the rocket."
          },
          {
            "es": "La Tierra está abajo del cohete.",
            "en": "Earth is below the rocket."
          },
          {
            "es": "En el dibujo, la Luna está cerca del cohete.",
            "en": "In the drawing, the Moon is near the rocket."
          }
        ],
        "question": "In the drawing, what is above the rocket?",
        "options": [
          "The star",
          "Earth",
          "The Moon"
        ],
        "answer": 0,
        "practice": "Describe an imaginary drawing using “arriba” and “abajo.”",
        "stretch": "Add a third object using “cerca de.” These are drawing positions, not fixed positions in space.",
        "id": "space-7",
        "number": 7,
        "reviewWords": [
          {
            "es": "astronauta",
            "en": "astronaut"
          },
          {
            "es": "casco",
            "en": "helmet"
          },
          {
            "es": "lista",
            "en": "ready"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Your Space Mission",
        "goal": "I can tell a short imaginary space adventure.",
        "newWords": [],
        "story": [
          {
            "es": "Ana está lista y lleva un casco.",
            "en": "Ana is ready and wears a helmet."
          },
          {
            "es": "Cinco, cuatro, tres, dos, uno… ¡Vamos!",
            "en": "Five, four, three, two, one… Let’s go!"
          },
          {
            "es": "Ana mira la Tierra y la Luna.",
            "en": "Ana looks at Earth and the Moon."
          },
          {
            "es": "Desde el cohete, Ana ve una estrella que brilla.",
            "en": "From the rocket, Ana sees a shining star."
          }
        ],
        "question": "Which sentence fits the mission?",
        "options": [
          "Ana travels in a boat",
          "Ana is ready with her helmet",
          "Earth is a star"
        ],
        "answer": 1,
        "practice": "Introduce your imaginary astronaut, count down, and name two things they see.",
        "stretch": "Explain which object is a planet and which is a star, using Spanish if you can.",
        "id": "space-8",
        "number": 8,
        "reviewWords": [
          {
            "es": "arriba",
            "en": "above"
          },
          {
            "es": "abajo",
            "en": "below"
          },
          {
            "es": "cerca de",
            "en": "near"
          }
        ],
        "minutes": 7
      }
    ]
  },
  {
    "id": "food",
    "title": "Food & Cooking Club",
    "emoji": "🍎",
    "color": "#B45309",
    "moduleId": "food",
    "description": "Ask kindly, count snacks, and plan a safe imaginary picnic.",
    "lessons": [
      {
        "title": "Picnic Basket",
        "goal": "I can name food and a drink.",
        "newWords": [
          {
            "es": "pan",
            "en": "bread"
          },
          {
            "es": "manzana",
            "en": "apple"
          },
          {
            "es": "agua",
            "en": "water"
          }
        ],
        "story": [
          {
            "es": "Hay pan en la cesta.",
            "en": "There is bread in the basket."
          },
          {
            "es": "Hay una manzana también.",
            "en": "There is an apple too."
          },
          {
            "es": "Tengo agua para beber.",
            "en": "I have water to drink."
          },
          {
            "es": "Es una cesta para un picnic imaginario.",
            "en": "It is a basket for an imaginary picnic."
          }
        ],
        "question": "Which drink is in the basket?",
        "options": [
          "Water",
          "Milk",
          "Juice"
        ],
        "answer": 0,
        "practice": "Name a food and a drink for an imaginary picnic.",
        "stretch": "Use “Hay…” to describe all three things in the basket.",
        "id": "food-1",
        "number": 1,
        "reviewWords": [],
        "minutes": 7
      },
      {
        "title": "Ask Kindly",
        "goal": "I can make a polite request.",
        "newWords": [
          {
            "es": "quiero",
            "en": "I want"
          },
          {
            "es": "por favor",
            "en": "please"
          },
          {
            "es": "gracias",
            "en": "thank you"
          }
        ],
        "story": [
          {
            "es": "Quiero pan, por favor.",
            "en": "I want bread, please."
          },
          {
            "es": "Aquí tienes el pan.",
            "en": "Here is the bread."
          },
          {
            "es": "Quiero agua, por favor.",
            "en": "I want water, please."
          },
          {
            "es": "¡Gracias!",
            "en": "Thank you!"
          }
        ],
        "question": "What makes the request polite?",
        "options": [
          "Saying it louder",
          "Saying please and thank you",
          "Saying nothing"
        ],
        "answer": 1,
        "practice": "Pretend to ask for bread and water politely.",
        "stretch": "Take both parts: request something, offer it, and say thank you.",
        "id": "food-2",
        "number": 2,
        "reviewWords": [
          {
            "es": "pan",
            "en": "bread"
          },
          {
            "es": "manzana",
            "en": "apple"
          },
          {
            "es": "agua",
            "en": "water"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Colorful Fruit",
        "goal": "I can describe an apple.",
        "newWords": [
          {
            "es": "roja",
            "en": "red"
          },
          {
            "es": "verde",
            "en": "green"
          },
          {
            "es": "dulce",
            "en": "sweet"
          }
        ],
        "story": [
          {
            "es": "Tengo una manzana roja.",
            "en": "I have a red apple."
          },
          {
            "es": "La manzana roja es dulce.",
            "en": "The red apple is sweet."
          },
          {
            "es": "Hay una manzana verde también.",
            "en": "There is a green apple too."
          },
          {
            "es": "Quiero la manzana roja, por favor.",
            "en": "I want the red apple, please."
          }
        ],
        "question": "Which apple does the speaker want?",
        "options": [
          "The green apple",
          "Both apples",
          "The red apple"
        ],
        "answer": 2,
        "practice": "Describe an apple using its color. Ask for it politely.",
        "stretch": "Add “dulce” to your description.",
        "id": "food-3",
        "number": 3,
        "reviewWords": [
          {
            "es": "quiero",
            "en": "I want"
          },
          {
            "es": "por favor",
            "en": "please"
          },
          {
            "es": "gracias",
            "en": "thank you"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Count the Snacks",
        "goal": "I can count picnic food.",
        "newWords": [
          {
            "es": "una",
            "en": "one, with a feminine noun"
          },
          {
            "es": "dos",
            "en": "two"
          },
          {
            "es": "tres",
            "en": "three"
          }
        ],
        "story": [
          {
            "es": "Hay una manzana roja.",
            "en": "There is one red apple."
          },
          {
            "es": "Hay dos manzanas verdes.",
            "en": "There are two green apples."
          },
          {
            "es": "Una y dos son tres manzanas.",
            "en": "One and two make three apples."
          },
          {
            "es": "Quiero dos manzanas, por favor.",
            "en": "I want two apples, please."
          }
        ],
        "question": "How many apples are there altogether?",
        "options": [
          "Three",
          "Two",
          "One"
        ],
        "answer": 0,
        "practice": "Count three apples. Notice manzana becomes manzanas.",
        "stretch": "Ask politely for two green apples.",
        "id": "food-4",
        "number": 4,
        "reviewWords": [
          {
            "es": "roja",
            "en": "red"
          },
          {
            "es": "verde",
            "en": "green"
          },
          {
            "es": "dulce",
            "en": "sweet"
          }
        ],
        "minutes": 7
      },
      {
        "title": "The Helpful Kitchen",
        "goal": "I can describe safe kitchen helpers.",
        "newWords": [
          {
            "es": "lavo",
            "en": "I wash"
          },
          {
            "es": "mezclo",
            "en": "I mix"
          },
          {
            "es": "adulto",
            "en": "adult"
          }
        ],
        "story": [
          {
            "es": "Me lavo las manos antes de cocinar.",
            "en": "I wash my hands before cooking."
          },
          {
            "es": "Un adulto lava y corta la manzana.",
            "en": "An adult washes and cuts the apple."
          },
          {
            "es": "Yo mezclo la fruta en un recipiente.",
            "en": "I mix the fruit in a bowl."
          },
          {
            "es": "El adulto comprueba los ingredientes y las alergias.",
            "en": "The adult checks the ingredients and allergies."
          }
        ],
        "question": "Who cuts the apple in this story?",
        "options": [
          "The dog",
          "An adult",
          "The child alone"
        ],
        "answer": 1,
        "practice": "Describe the pretend kitchen job: “Me lavo las manos. Yo mezclo la fruta.”",
        "stretch": "Tell an adult in English why they handle knives and check ingredients. No real cooking is required.",
        "id": "food-5",
        "number": 5,
        "reviewWords": [
          {
            "es": "una",
            "en": "one, with a feminine noun"
          },
          {
            "es": "dos",
            "en": "two"
          },
          {
            "es": "tres",
            "en": "three"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Hot, Cold, Wait",
        "goal": "I can describe temperature and waiting safely.",
        "newWords": [
          {
            "es": "caliente",
            "en": "hot"
          },
          {
            "es": "fría",
            "en": "cold"
          },
          {
            "es": "espero",
            "en": "I wait"
          }
        ],
        "story": [
          {
            "es": "Un adulto saca el pan del horno.",
            "en": "An adult takes the bread out of the oven."
          },
          {
            "es": "El pan está caliente.",
            "en": "The bread is hot."
          },
          {
            "es": "Yo espero. El agua está fría.",
            "en": "I wait. The water is cold."
          },
          {
            "es": "Un adulto comprueba que el pan se puede comer.",
            "en": "An adult checks that the bread is safe to eat."
          }
        ],
        "question": "What does the child do while the bread is hot?",
        "options": [
          "Touches the oven",
          "Eats the bread immediately",
          "Waits"
        ],
        "answer": 2,
        "practice": "Say what is hot, what is cold, and “Yo espero.”",
        "stretch": "Explain that an adult handles the oven and checks the food before anyone tastes it.",
        "id": "food-6",
        "number": 6,
        "reviewWords": [
          {
            "es": "lavo",
            "en": "I wash"
          },
          {
            "es": "mezclo",
            "en": "I mix"
          },
          {
            "es": "adulto",
            "en": "adult"
          }
        ],
        "minutes": 7
      },
      {
        "title": "What Do You Like?",
        "goal": "I can share a food preference politely.",
        "newWords": [
          {
            "es": "me gusta",
            "en": "I like"
          },
          {
            "es": "no me gusta",
            "en": "I do not like"
          },
          {
            "es": "compartir",
            "en": "to share"
          }
        ],
        "story": [
          {
            "es": "Me gusta el pan.",
            "en": "I like bread."
          },
          {
            "es": "Me gusta la manzana dulce también.",
            "en": "I like the sweet apple too."
          },
          {
            "es": "A mi amigo no le gusta la manzana verde.",
            "en": "My friend does not like the green apple."
          },
          {
            "es": "Me gusta compartir el picnic.",
            "en": "I like sharing the picnic."
          }
        ],
        "question": "What does the speaker like?",
        "options": [
          "Bread and the sweet apple",
          "Only green apples",
          "Only water"
        ],
        "answer": 0,
        "practice": "Say one food you like and one imaginary food you do not like.",
        "stretch": "Offer a different snack politely: “¿Quieres pan?”",
        "id": "food-7",
        "number": 7,
        "reviewWords": [
          {
            "es": "caliente",
            "en": "hot"
          },
          {
            "es": "fría",
            "en": "cold"
          },
          {
            "es": "espero",
            "en": "I wait"
          }
        ],
        "minutes": 7
      },
      {
        "title": "Our Picnic Plan",
        "goal": "I can plan an imaginary picnic in Spanish.",
        "newWords": [],
        "story": [
          {
            "es": "Para el picnic hay pan y tres manzanas.",
            "en": "For the picnic there is bread and three apples."
          },
          {
            "es": "Quiero una manzana roja y agua, por favor.",
            "en": "I want a red apple and water, please."
          },
          {
            "es": "Me gusta compartir la comida.",
            "en": "I like sharing the food."
          },
          {
            "es": "¡Gracias! Un adulto comprueba los ingredientes.",
            "en": "Thank you! An adult checks the ingredients."
          }
        ],
        "question": "Which order matches the picnic story?",
        "options": [
          "Milk and a green apple",
          "Water and a red apple",
          "Three loaves of hot bread"
        ],
        "answer": 1,
        "practice": "Plan a pretend picnic: count the food, describe it, and make a polite request.",
        "stretch": "Add a preference and explain the adult’s safety job. Keep the activity imaginary or ask an adult to help.",
        "id": "food-8",
        "number": 8,
        "reviewWords": [
          {
            "es": "me gusta",
            "en": "I like"
          },
          {
            "es": "no me gusta",
            "en": "I do not like"
          },
          {
            "es": "compartir",
            "en": "to share"
          }
        ],
        "minutes": 7
      }
    ]
  }
]
