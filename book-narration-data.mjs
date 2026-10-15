// Independent word timings. Questions end each track; answers start after teacher continuation.
export const openingTrack = {
  "id": "opening-part-01",
  "src": "assets/book-narration/opening-part-01.mp3",
  "duration": 49.948,
  "cues": [
    {
      "page": 1,
      "beat": 0,
      "start": 0.64,
      "end": 1.22,
      "speaker": "Meester Bob",
      "text": "Kom maar mee."
    },
    {
      "page": 1,
      "beat": 1,
      "start": 1.78,
      "end": 5.1,
      "speaker": "Meester Bob",
      "text": "Amina, Adam, Sami en Maryam wandelen het bos in."
    },
    {
      "page": 1,
      "beat": 2,
      "start": 5.62,
      "end": 7.48,
      "speaker": "Meester Bob",
      "text": "Onder hun voeten knisperen de bladeren."
    },
    {
      "page": 1,
      "beat": 3,
      "start": 7.98,
      "end": 9.3,
      "speaker": "Meester Bob",
      "text": "Adam trekt zijn jas dicht."
    },
    {
      "page": 1,
      "beat": 4,
      "start": 10.08,
      "end": 10.42,
      "speaker": "Adam",
      "text": "Brr."
    },
    {
      "page": 1,
      "beat": 5,
      "start": 10.82,
      "end": 12.22,
      "speaker": "Adam",
      "text": "Goed dat ik mijn jas aanheb."
    },
    {
      "page": 1,
      "beat": 6,
      "start": 13.04,
      "end": 14.7,
      "speaker": "Meester Bob",
      "text": "Maryam kijkt tussen de bomen."
    },
    {
      "page": 1,
      "beat": 7,
      "start": 15.6,
      "end": 17.96,
      "speaker": "Maryam",
      "text": "Wat doen de dieren eigenlijk als het koud wordt?"
    },
    {
      "page": 1,
      "beat": 8,
      "start": 18.7,
      "end": 20.1,
      "speaker": "Meester Bob",
      "text": "Amina wijst naar het pad."
    },
    {
      "page": 1,
      "beat": 9,
      "start": 21.14,
      "end": 21.42,
      "speaker": "Amina",
      "text": "Kom."
    },
    {
      "page": 1,
      "beat": 10,
      "start": 21.58,
      "end": 22.96,
      "speaker": "Amina",
      "text": "Misschien zien we wat ze doen."
    },
    {
      "page": 1,
      "beat": 11,
      "start": 23.7,
      "end": 26.22,
      "speaker": "Meester Bob",
      "text": "Een rood blad dwarrelt voor Sami's voeten."
    },
    {
      "page": 2,
      "beat": 0,
      "start": 27.18,
      "end": 28.3,
      "speaker": "Meester Bob",
      "text": "Amina blijft staan."
    },
    {
      "page": 2,
      "beat": 1,
      "start": 28.78,
      "end": 31.28,
      "speaker": "Meester Bob",
      "text": "Naast het pad liggen rode bladeren bij elkaar."
    },
    {
      "page": 2,
      "beat": 2,
      "start": 31.62,
      "end": 32.52,
      "speaker": "Meester Bob",
      "text": "Ze wijst ze aan."
    },
    {
      "page": 2,
      "beat": 3,
      "start": 33.9,
      "end": 34.8,
      "speaker": "Amina",
      "text": "Drie rode."
    },
    {
      "page": 2,
      "beat": 4,
      "start": 35.04,
      "end": 36.66,
      "speaker": "Amina",
      "text": "Die lijken wel op vlammetjes."
    },
    {
      "page": 2,
      "beat": 5,
      "start": 37.6,
      "end": 40.18,
      "speaker": "Meester Bob",
      "text": "Sami hurkt bij de gele bladeren ernaast."
    },
    {
      "page": 2,
      "beat": 6,
      "start": 40.98,
      "end": 42.28,
      "speaker": "Sami",
      "text": "En hier liggen vier gele."
    },
    {
      "page": 2,
      "beat": 7,
      "start": 42.9,
      "end": 43.58,
      "speaker": "Meester Bob",
      "text": "Kijk maar mee."
    },
    {
      "page": 2,
      "beat": 8,
      "start": 44.04,
      "end": 46.8,
      "speaker": "Meester Bob",
      "text": "Drie rode bladeren en vier gele bladeren."
    },
    {
      "page": 2,
      "beat": 9,
      "start": 47.18,
      "end": 48.74,
      "speaker": "Meester Bob",
      "text": "Hoeveel bladeren liggen er samen?"
    }
  ]
};
export const answerTrack = {
  "src": "assets/book-narration/first-answer.mp3",
  "duration": 3.53,
  "cues": [
    {
      "page": 3,
      "beat": 0,
      "start": 0.1,
      "end": 3.38,
      "speaker": "Meester Bob",
      "text": "Drie en vier: samen zeven bladeren."
    }
  ]
};
export const narrationTracks = [openingTrack,
{
  "id": "part-02",
  "src": "assets/book-narration/part-02-clean-v2.mp3",
  "duration": 68.221,
  "pages": [
    3,
    4,
    5,
    6,
    7,
    8
  ],
  "endsWithQuestion": true,
  "cues": [
    {
      "page": 3,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Drie en vier: samen zeven bladeren.",
      "start": 0.39,
      "end": 3.392
    },
    {
      "page": 3,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Maryam buigt zich voorover.",
      "start": 3.852,
      "end": 5.187
    },
    {
      "page": 3,
      "beat": 2,
      "speaker": "Maryam",
      "text": "Als ik een kevertje was, zou ik daaronder schuilen.",
      "start": 5.667,
      "end": 9.756
    },
    {
      "page": 3,
      "beat": 3,
      "speaker": "Adam",
      "text": "Onder een blaadjesparaplu!",
      "start": 10.216,
      "end": 11.771
    },
    {
      "page": 3,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Sami houdt zijn hand naast een blad.",
      "start": 12.261,
      "end": 13.996
    },
    {
      "page": 3,
      "beat": 5,
      "speaker": "Sami",
      "text": "Voor mij is die een beetje klein.",
      "start": 14.486,
      "end": 15.721
    },
    {
      "page": 3,
      "beat": 6,
      "speaker": "Meester Bob",
      "text": "Maryam lacht.",
      "start": 16.211,
      "end": 16.866
    },
    {
      "page": 3,
      "beat": 7,
      "speaker": "Maryam",
      "text": "Dan laten we hem voor het kevertje.",
      "start": 17.356,
      "end": 18.751
    },
    {
      "page": 3,
      "beat": 8,
      "speaker": "Meester Bob",
      "text": "Ze laten de bladeren liggen. Knisper, knasper. Verder maar.",
      "start": 19.241,
      "end": 23.136
    },
    {
      "page": 4,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Knisper, knasper. Sami stapt door de bladeren.",
      "start": 23.886,
      "end": 27.401
    },
    {
      "page": 4,
      "beat": 1,
      "speaker": "Sami",
      "text": "Hoor je dat? Mijn schoenen maken muziek!",
      "start": 27.891,
      "end": 29.706
    },
    {
      "page": 4,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Hij tilt zijn voet op. Een groot, rood blad plakt aan zijn schoen.",
      "start": 30.196,
      "end": 34.151
    },
    {
      "page": 4,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Hij schudt nog eens. Het blad blijft zitten.",
      "start": 34.641,
      "end": 36.856
    },
    {
      "page": 4,
      "beat": 4,
      "speaker": "Amina",
      "text": "Je hebt een blaadjesschoen!",
      "start": 37.346,
      "end": 38.881
    },
    {
      "page": 4,
      "beat": 5,
      "speaker": "Sami",
      "text": "Die heb je niet in de winkel.",
      "start": 39.371,
      "end": 40.406
    },
    {
      "page": 5,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "De wind tilt het blad op. Het laat los en dwarrelt naar de grond.",
      "start": 41.156,
      "end": 44.811
    },
    {
      "page": 5,
      "beat": 1,
      "speaker": "Sami",
      "text": "O. Nu is mijn schoen weer gewoon.",
      "start": 45.301,
      "end": 47.236
    },
    {
      "page": 6,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Bij een oude boomstronk liggen bladeren. Adam hurkt en telt.",
      "start": 47.986,
      "end": 51.601
    },
    {
      "page": 6,
      "beat": 1,
      "speaker": "Adam",
      "text": "Acht!",
      "start": 52.091,
      "end": 52.426
    },
    {
      "page": 7,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Hoog boven hen ritselt het. Eén blad dwarrelt omlaag. Nog eentje!",
      "start": 53.176,
      "end": 57.471
    },
    {
      "page": 7,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Ze vallen bij de acht bladeren. Maryam kijkt mee.",
      "start": 57.961,
      "end": 60.916
    },
    {
      "page": 7,
      "beat": 2,
      "speaker": "Maryam",
      "text": "Daar komen er twee bij.",
      "start": 61.406,
      "end": 62.561
    },
    {
      "page": 8,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Er lagen acht bladeren. Nu liggen er twee bij.",
      "start": 63.311,
      "end": 66.006
    },
    {
      "page": 8,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Hoeveel zijn het nu?",
      "start": 66.496,
      "end": 67.251
    }
  ]
},
{
  "id": "part-03",
  "src": "assets/book-narration/part-03-clean-v2.mp3",
  "duration": 56.818,
  "pages": [
    9,
    10,
    11
  ],
  "endsWithQuestion": true,
  "cues": [
    {
      "page": 9,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Samen tien bladeren. Adam kijkt omhoog.",
      "start": 0.4,
      "end": 3.155
    },
    {
      "page": 9,
      "beat": 1,
      "speaker": "Adam",
      "text": "Zou er nog eentje vallen?",
      "start": 3.645,
      "end": 4.84
    },
    {
      "page": 9,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Ritsel… ritsel. Amina hoort iets.",
      "start": 5.33,
      "end": 8.245
    },
    {
      "page": 9,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Tussen de wortels!",
      "start": 8.735,
      "end": 9.61
    },
    {
      "page": 9,
      "beat": 4,
      "speaker": "Amina",
      "text": "Daar bewoog iets.",
      "start": 10.1,
      "end": 11.255
    },
    {
      "page": 9,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Adam komt overeind.",
      "start": 11.745,
      "end": 12.74
    },
    {
      "page": 9,
      "beat": 6,
      "speaker": "Adam",
      "text": "Een blad?",
      "start": 13.23,
      "end": 13.785
    },
    {
      "page": 9,
      "beat": 7,
      "speaker": "Amina",
      "text": "Een staart!",
      "start": 14.275,
      "end": 15.29
    },
    {
      "page": 9,
      "beat": 8,
      "speaker": "Meester Bob",
      "text": "Een rode pluim verdwijnt achter de boom.",
      "start": 15.78,
      "end": 17.835
    },
    {
      "page": 10,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Een eekhoorn draagt een eikel. Achter de stam verschijnt er nog één.",
      "start": 18.585,
      "end": 22.3
    },
    {
      "page": 10,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Maryam fluistert.",
      "start": 22.79,
      "end": 23.665
    },
    {
      "page": 10,
      "beat": 2,
      "speaker": "Maryam",
      "text": "Waar brengen ze die eikels naartoe?",
      "start": 24.155,
      "end": 25.69
    },
    {
      "page": 10,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Eentje verdwijnt achter de wortels. Hij komt terug, zonder eikel.",
      "start": 26.18,
      "end": 30.055
    },
    {
      "page": 10,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Adam fronst.",
      "start": 30.545,
      "end": 31.319
    },
    {
      "page": 10,
      "beat": 5,
      "speaker": "Adam",
      "text": "Nu al opgegeten?",
      "start": 31.809,
      "end": 32.804
    },
    {
      "page": 10,
      "beat": 6,
      "speaker": "Meester Bob",
      "text": "Hij heeft hem verstopt! Eekhoorns bewaren eten voor koude dagen.",
      "start": 33.294,
      "end": 36.829
    },
    {
      "page": 10,
      "beat": 7,
      "speaker": "Meester Bob",
      "text": "Een voorraad! Sami tikt op zijn rugzak.",
      "start": 37.319,
      "end": 39.894
    },
    {
      "page": 10,
      "beat": 8,
      "speaker": "Sami",
      "text": "Mijn boterhammen zitten hier. Dat is mijn voorraad.",
      "start": 40.384,
      "end": 42.619
    },
    {
      "page": 11,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Bij de eekhoorns liggen twee groepjes eikels. Amina telt.",
      "start": 43.369,
      "end": 46.764
    },
    {
      "page": 11,
      "beat": 1,
      "speaker": "Amina",
      "text": "Hier liggen er acht.",
      "start": 47.254,
      "end": 48.469
    },
    {
      "page": 11,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Adam telt het andere groepje.",
      "start": 48.959,
      "end": 50.314
    },
    {
      "page": 11,
      "beat": 3,
      "speaker": "Adam",
      "text": "En daar liggen er vijf.",
      "start": 50.804,
      "end": 52.178
    },
    {
      "page": 11,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Acht hier en vijf daar.",
      "start": 52.668,
      "end": 54.063
    },
    {
      "page": 11,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Hoeveel eikels zijn dat samen?",
      "start": 54.553,
      "end": 55.848
    }
  ]
},
{
  "id": "part-04",
  "src": "assets/book-narration/part-04-clean-v2.mp3",
  "duration": 62.625,
  "pages": [
    12,
    13,
    14,
    15
  ],
  "endsWithQuestion": true,
  "cues": [
    {
      "page": 12,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Samen dertien eikels. Een eekhoorn graaft een kuiltje.",
      "start": 0.4,
      "end": 3.955
    },
    {
      "page": 12,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "De eikel erin, aarde erover… weg is hij!",
      "start": 4.445,
      "end": 7.0
    },
    {
      "page": 12,
      "beat": 2,
      "speaker": "Sami",
      "text": "Ik zou hem nu al niet meer vinden.",
      "start": 7.49,
      "end": 8.705
    },
    {
      "page": 12,
      "beat": 3,
      "speaker": "Maryam",
      "text": "Het is ook zijn voorraad.",
      "start": 9.195,
      "end": 10.35
    },
    {
      "page": 12,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "De eekhoorn schiet de boom in. De kinderen volgen het pad.",
      "start": 10.84,
      "end": 14.035
    },
    {
      "page": 13,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Achter de bocht steekt Maryam haar hand op.",
      "start": 14.785,
      "end": 16.66
    },
    {
      "page": 13,
      "beat": 1,
      "speaker": "Maryam",
      "text": "Even luisteren.",
      "start": 17.15,
      "end": 17.945
    },
    {
      "page": 13,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "De kinderen staan stil. Geen stemmen. Geen stappen.",
      "start": 18.435,
      "end": 21.53
    },
    {
      "page": 13,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Alleen tikkende takken, een vogel en ritselende bladeren.",
      "start": 22.02,
      "end": 25.435
    },
    {
      "page": 13,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Dan wijst Amina naar het mos. Adam kijkt mee.",
      "start": 25.925,
      "end": 28.66
    },
    {
      "page": 13,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Hoedjes op steeltjes!",
      "start": 29.15,
      "end": 30.325
    },
    {
      "page": 14,
      "beat": 0,
      "speaker": "Amina",
      "text": "Paddenstoelen!",
      "start": 31.075,
      "end": 31.91
    },
    {
      "page": 14,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Sami houdt zijn rugzak vast en kijkt onder een brede hoed.",
      "start": 32.4,
      "end": 35.175
    },
    {
      "page": 14,
      "beat": 2,
      "speaker": "Sami",
      "text": "Zou het daaronder regenen?",
      "start": 35.665,
      "end": 36.6
    },
    {
      "page": 14,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Adam hurkt erbij.",
      "start": 37.09,
      "end": 38.005
    },
    {
      "page": 14,
      "beat": 4,
      "speaker": "Adam",
      "text": "Daar kan jouw kevertje ook schuilen, Maryam.",
      "start": 38.495,
      "end": 40.59
    },
    {
      "page": 14,
      "beat": 5,
      "speaker": "Maryam",
      "text": "Dat heeft nu veel keuze.",
      "start": 41.08,
      "end": 42.395
    },
    {
      "page": 14,
      "beat": 6,
      "speaker": "Meester Bob",
      "text": "Langs het mos staan grote en kleine paddenstoelen.",
      "start": 42.885,
      "end": 45.54
    },
    {
      "page": 14,
      "beat": 7,
      "speaker": "Meester Bob",
      "text": "En bij die tak! Ze laten ze allemaal staan.",
      "start": 46.03,
      "end": 48.565
    },
    {
      "page": 15,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Amina telt de paddenstoelen bij het mos.",
      "start": 49.315,
      "end": 51.15
    },
    {
      "page": 15,
      "beat": 1,
      "speaker": "Amina",
      "text": "Zeven. Die kleine hoort er ook bij.",
      "start": 51.64,
      "end": 54.295
    },
    {
      "page": 15,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Sami telt bij de gevallen tak.",
      "start": 54.785,
      "end": 56.28
    },
    {
      "page": 15,
      "beat": 3,
      "speaker": "Sami",
      "text": "Hier staan er vijf.",
      "start": 56.77,
      "end": 57.685
    },
    {
      "page": 15,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Zeven hier en vijf daar.",
      "start": 58.175,
      "end": 59.69
    },
    {
      "page": 15,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Hoeveel paddenstoelen zijn dat samen?",
      "start": 60.18,
      "end": 61.655
    }
  ]
},
{
  "id": "part-05",
  "src": "assets/book-narration/part-05-clean-v2.mp3",
  "duration": 52.183,
  "pages": [
    16,
    17,
    18
  ],
  "endsWithQuestion": true,
  "cues": [
    {
      "page": 16,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Samen twaalf paddenstoelen. Maryam kijkt naar de kleinste.",
      "start": 0.4,
      "end": 3.794
    },
    {
      "page": 16,
      "beat": 1,
      "speaker": "Maryam",
      "text": "Die had ik bijna niet gezien.",
      "start": 4.284,
      "end": 5.639
    },
    {
      "page": 16,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Adam staat op. Aan zijn broek hangt een blad.",
      "start": 6.129,
      "end": 8.463
    },
    {
      "page": 16,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Sami wijst ernaar.",
      "start": 8.953,
      "end": 9.928
    },
    {
      "page": 16,
      "beat": 4,
      "speaker": "Sami",
      "text": "Pas op. Straks krijg jij een blaadjesbroek.",
      "start": 10.418,
      "end": 12.573
    },
    {
      "page": 16,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Adam veegt het weg. Verderop beweegt nóg een blad.",
      "start": 13.063,
      "end": 15.958
    },
    {
      "page": 16,
      "beat": 6,
      "speaker": "Meester Bob",
      "text": "Dat valt niet. Dat loopt!",
      "start": 16.448,
      "end": 18.003
    },
    {
      "page": 17,
      "beat": 0,
      "speaker": "Sami",
      "text": "Dat blad gaat ervandoor!",
      "start": 18.753,
      "end": 19.848
    },
    {
      "page": 17,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Een puntig snuitje, een rug vol stekels… een egel!",
      "start": 20.338,
      "end": 23.633
    },
    {
      "page": 17,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Hij trekt een droog blad onder de struik. Maryam hurkt.",
      "start": 24.123,
      "end": 27.058
    },
    {
      "page": 17,
      "beat": 3,
      "speaker": "Maryam",
      "text": "Wat gaat hij daarmee doen?",
      "start": 27.548,
      "end": 28.703
    },
    {
      "page": 17,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Daar ligt zijn nest. Bladeren houden hem warm tijdens zijn winterslaap.",
      "start": 29.193,
      "end": 32.828
    },
    {
      "page": 17,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Adam kijkt.",
      "start": 33.318,
      "end": 34.053
    },
    {
      "page": 17,
      "beat": 6,
      "speaker": "Adam",
      "text": "Dus de bladeren zijn zijn deken?",
      "start": 34.543,
      "end": 36.558
    },
    {
      "page": 17,
      "beat": 7,
      "speaker": "Meester Bob",
      "text": "Maryam knikt.",
      "start": 37.048,
      "end": 37.783
    },
    {
      "page": 17,
      "beat": 8,
      "speaker": "Maryam",
      "text": "Dan mag de wind die niet meenemen.",
      "start": 38.273,
      "end": 39.828
    },
    {
      "page": 18,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Voor het nest liggen negen bladeren bij de wortel, en vier bij de tak.",
      "start": 40.578,
      "end": 44.173
    },
    {
      "page": 18,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Sami fluistert.",
      "start": 44.663,
      "end": 45.538
    },
    {
      "page": 18,
      "beat": 2,
      "speaker": "Sami",
      "text": "Daar kan nog een hele deken bij.",
      "start": 46.028,
      "end": 47.383
    },
    {
      "page": 18,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Twee groepjes losse bladeren.",
      "start": 47.873,
      "end": 49.448
    },
    {
      "page": 18,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Hoeveel liggen er samen klaar?",
      "start": 49.938,
      "end": 51.213
    }
  ]
},
{
  "id": "part-06",
  "src": "assets/book-narration/part-06-clean-v2.mp3",
  "duration": 48.995,
  "pages": [
    19,
    20,
    21
  ],
  "endsWithQuestion": true,
  "cues": [
    {
      "page": 19,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Samen dertien bladeren. De egel trekt er eentje naar binnen.",
      "start": 0.4,
      "end": 4.035
    },
    {
      "page": 19,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Zijn neus verdwijnt ook. Maryam staat zachtjes op.",
      "start": 4.525,
      "end": 7.52
    },
    {
      "page": 19,
      "beat": 2,
      "speaker": "Maryam",
      "text": "Kom. Dan kan hij verder doen.",
      "start": 8.01,
      "end": 9.625
    },
    {
      "page": 19,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Ze sluipen verder. Geen schoenenmuziek nu.",
      "start": 10.115,
      "end": 12.45
    },
    {
      "page": 19,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Verderop schijnt de zon door de bomen.",
      "start": 12.94,
      "end": 14.675
    },
    {
      "page": 19,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Amina ziet iets roze tussen het geel en bruin.",
      "start": 15.165,
      "end": 17.64
    },
    {
      "page": 20,
      "beat": 0,
      "speaker": "Amina",
      "text": "Bloemen!",
      "start": 18.39,
      "end": 18.965
    },
    {
      "page": 20,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Aan de bosrand staan roze bloemen. Sami komt kijken.",
      "start": 19.455,
      "end": 22.47
    },
    {
      "page": 20,
      "beat": 2,
      "speaker": "Sami",
      "text": "Nu nog?",
      "start": 22.96,
      "end": 23.395
    },
    {
      "page": 20,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Ja, zelfs in de herfst! Amina hurkt.",
      "start": 23.885,
      "end": 26.4
    },
    {
      "page": 20,
      "beat": 4,
      "speaker": "Amina",
      "text": "Ik dacht dat alles hier geel en bruin zou zijn.",
      "start": 26.89,
      "end": 29.425
    },
    {
      "page": 20,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Bij de boom staat een groepje, naast de steen nog één.",
      "start": 29.915,
      "end": 32.77
    },
    {
      "page": 20,
      "beat": 6,
      "speaker": "Meester Bob",
      "text": "De dunne steeltjes wiegen in de wind.",
      "start": 33.26,
      "end": 35.175
    },
    {
      "page": 21,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Amina telt de open bloemen bij de boom.",
      "start": 35.925,
      "end": 37.84
    },
    {
      "page": 21,
      "beat": 1,
      "speaker": "Amina",
      "text": "Hier zijn er zes.",
      "start": 38.33,
      "end": 39.505
    },
    {
      "page": 21,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Sami wijst naar de open bloemen naast de steen.",
      "start": 39.995,
      "end": 42.21
    },
    {
      "page": 21,
      "beat": 3,
      "speaker": "Sami",
      "text": "En daar zeven.",
      "start": 42.7,
      "end": 43.435
    },
    {
      "page": 21,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Zes open bloemen hier en zeven daar.",
      "start": 43.925,
      "end": 46.06
    },
    {
      "page": 21,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Hoeveel open bloemen zijn dat samen?",
      "start": 46.55,
      "end": 48.025
    }
  ]
},
{
  "id": "part-07",
  "src": "assets/book-narration/part-07-clean-v2.mp3",
  "duration": 48.11,
  "pages": [
    22,
    23,
    24
  ],
  "endsWithQuestion": true,
  "cues": [
    {
      "page": 22,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Samen dertien bloemen. Dan blaast de wind een blad over het pad.",
      "start": 0.4,
      "end": 4.155
    },
    {
      "page": 22,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Het blijft haken aan een wortel. Een windstootje maakt het los.",
      "start": 4.645,
      "end": 7.68
    },
    {
      "page": 22,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Adam kijkt het na.",
      "start": 8.17,
      "end": 9.085
    },
    {
      "page": 22,
      "beat": 3,
      "speaker": "Adam",
      "text": "Dat blad weet de weg!",
      "start": 9.575,
      "end": 10.81
    },
    {
      "page": 22,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Ze volgen het pad. Bij een boom ritselt iets.",
      "start": 11.3,
      "end": 13.875
    },
    {
      "page": 22,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Grote oren tussen de bladeren!",
      "start": 14.365,
      "end": 15.92
    },
    {
      "page": 23,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Bij een hol zit een bosmuis, met iets kleins in zijn bek.",
      "start": 16.67,
      "end": 19.365
    },
    {
      "page": 23,
      "beat": 1,
      "speaker": "Amina",
      "text": "Een zaadje.",
      "start": 19.855,
      "end": 20.69
    },
    {
      "page": 23,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Hij verdwijnt. Een tweede muis komt voorbij.",
      "start": 21.18,
      "end": 23.415
    },
    {
      "page": 23,
      "beat": 3,
      "speaker": "Adam",
      "text": "Hoe vinden ze zulke kleine zaadjes?",
      "start": 23.905,
      "end": 25.92
    },
    {
      "page": 23,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Maryam kijkt naar zijn snuffelende neus.",
      "start": 26.41,
      "end": 28.305
    },
    {
      "page": 23,
      "beat": 5,
      "speaker": "Maryam",
      "text": "Ze kijken niet alleen. Die neus helpt ook.",
      "start": 28.795,
      "end": 31.29
    },
    {
      "page": 23,
      "beat": 6,
      "speaker": "Meester Bob",
      "text": "Ook muizen leggen een voorraad aan.",
      "start": 31.78,
      "end": 33.435
    },
    {
      "page": 23,
      "beat": 7,
      "speaker": "Meester Bob",
      "text": "Sami voelt aan zijn rugzak. Zijn voorraad zit er nog.",
      "start": 33.925,
      "end": 36.66
    },
    {
      "page": 24,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Acht zaadjes bij het hol. Zes op een droog blad.",
      "start": 37.41,
      "end": 39.945
    },
    {
      "page": 24,
      "beat": 1,
      "speaker": "Maryam",
      "text": "Dat hebben ze allemaal gevonden.",
      "start": 40.435,
      "end": 42.01
    },
    {
      "page": 24,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Twee groepjes: acht bij het hol en zes op het blad.",
      "start": 42.5,
      "end": 45.335
    },
    {
      "page": 24,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Hoeveel zaadjes zijn dat samen?",
      "start": 45.825,
      "end": 47.14
    }
  ]
},
{
  "id": "part-08",
  "src": "assets/book-narration/part-08-clean-v2.mp3",
  "duration": 48.34,
  "pages": [
    25,
    26,
    27
  ],
  "endsWithQuestion": true,
  "cues": [
    {
      "page": 25,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Samen veertien zaadjes. Eén muis verdwijnt met een zaadje. De andere volgt.",
      "start": 0.4,
      "end": 4.995
    },
    {
      "page": 25,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Stil. Adam blijft kijken.",
      "start": 5.485,
      "end": 7.12
    },
    {
      "page": 25,
      "beat": 2,
      "speaker": "Adam",
      "text": "Zijn ze weg?",
      "start": 7.61,
      "end": 8.265
    },
    {
      "page": 25,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Daar is een snuitje. En daar nog één! Sami lacht.",
      "start": 8.755,
      "end": 11.63
    },
    {
      "page": 25,
      "beat": 4,
      "speaker": "Sami",
      "text": "Alleen even gaan opbergen.",
      "start": 12.12,
      "end": 13.195
    },
    {
      "page": 25,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "De kinderen wandelen verder. Hoog boven hen klinkt gefladder.",
      "start": 13.685,
      "end": 16.8
    },
    {
      "page": 26,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Iedereen kijkt omhoog. Adam buigt zijn hoofd steeds verder naar achteren.",
      "start": 17.55,
      "end": 21.225
    },
    {
      "page": 26,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Hij stapt achteruit. Sami tikt tegen zijn arm.",
      "start": 21.715,
      "end": 24.23
    },
    {
      "page": 26,
      "beat": 2,
      "speaker": "Sami",
      "text": "De boom staat er nog, hoor.",
      "start": 24.72,
      "end": 25.795
    },
    {
      "page": 26,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Oef! Adam stopt net voor de stam. Boven hen vliegen vogels.",
      "start": 26.285,
      "end": 30.16
    },
    {
      "page": 26,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Amina wijst.",
      "start": 30.65,
      "end": 31.405
    },
    {
      "page": 26,
      "beat": 5,
      "speaker": "Amina",
      "text": "Daar is een groepje.",
      "start": 31.895,
      "end": 32.93
    },
    {
      "page": 26,
      "beat": 6,
      "speaker": "Adam",
      "text": "En daar nog een!",
      "start": 33.42,
      "end": 34.335
    },
    {
      "page": 26,
      "beat": 7,
      "speaker": "Meester Bob",
      "text": "Kijk maar mee!",
      "start": 34.825,
      "end": 35.42
    },
    {
      "page": 27,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Amina telt het eerste groepje.",
      "start": 36.17,
      "end": 37.605
    },
    {
      "page": 27,
      "beat": 1,
      "speaker": "Amina",
      "text": "Zes vogels.",
      "start": 38.095,
      "end": 39.13
    },
    {
      "page": 27,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Adam wijst naar het tweede.",
      "start": 39.62,
      "end": 40.795
    },
    {
      "page": 27,
      "beat": 3,
      "speaker": "Adam",
      "text": "Hier zijn er vijf.",
      "start": 41.285,
      "end": 42.3
    },
    {
      "page": 27,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Zes in het ene groepje, vijf in het andere.",
      "start": 42.79,
      "end": 45.085
    },
    {
      "page": 27,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Hoeveel vogels vliegen er samen voorbij?",
      "start": 45.575,
      "end": 47.37
    }
  ]
},
{
  "id": "part-09",
  "src": "assets/book-narration/part-09-clean-v2.mp3",
  "duration": 67.551,
  "pages": [
    28,
    29,
    30,
    31
  ],
  "endsWithQuestion": true,
  "cues": [
    {
      "page": 28,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Samen elf vogels. Ze vliegen verder, tot achter de bomen.",
      "start": 0.4,
      "end": 3.955
    },
    {
      "page": 28,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Adam kijkt ze na.",
      "start": 4.445,
      "end": 5.34
    },
    {
      "page": 28,
      "beat": 2,
      "speaker": "Adam",
      "text": "Die zijn veel sneller dan wij.",
      "start": 5.83,
      "end": 7.525
    },
    {
      "page": 28,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Sami houdt zijn voet stil.",
      "start": 8.015,
      "end": 9.33
    },
    {
      "page": 28,
      "beat": 4,
      "speaker": "Sami",
      "text": "Horen jullie dat?",
      "start": 9.82,
      "end": 10.495
    },
    {
      "page": 28,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Sjjj… sjjj… Geen geritsel. Achter de bomen stroomt water.",
      "start": 10.985,
      "end": 16.0
    },
    {
      "page": 29,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Het pad komt bij een beek. Een blad draait op het water.",
      "start": 16.75,
      "end": 19.724
    },
    {
      "page": 29,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Adam wijst het na.",
      "start": 20.214,
      "end": 21.15
    },
    {
      "page": 29,
      "beat": 2,
      "speaker": "Adam",
      "text": "Dat blad mag varen. Wij moeten stappen.",
      "start": 21.64,
      "end": 23.835
    },
    {
      "page": 29,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Sami hurkt op de droge oever. Aan de overkant schuift iets bruins.",
      "start": 24.325,
      "end": 28.181
    },
    {
      "page": 29,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Amina ziet een brede, platte staart.",
      "start": 28.671,
      "end": 31.046
    },
    {
      "page": 29,
      "beat": 5,
      "speaker": "Amina",
      "text": "Kijk daar.",
      "start": 31.536,
      "end": 32.251
    },
    {
      "page": 29,
      "beat": 6,
      "speaker": "Meester Bob",
      "text": "Een dier komt tevoorschijn, met een tak in zijn bek.",
      "start": 32.741,
      "end": 35.176
    },
    {
      "page": 30,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Twee bevers! Eentje sleept een tak.",
      "start": 35.926,
      "end": 38.281
    },
    {
      "page": 30,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Ze bouwen een dam van takken in de beek.",
      "start": 38.771,
      "end": 40.746
    },
    {
      "page": 30,
      "beat": 2,
      "speaker": "Adam",
      "text": "Krijgt hij daar geen pijn van aan zijn tanden?",
      "start": 41.236,
      "end": 43.251
    },
    {
      "page": 30,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Bevertanden zijn sterk. Ze knagen er zelfs hout mee af!",
      "start": 43.741,
      "end": 46.976
    },
    {
      "page": 30,
      "beat": 4,
      "speaker": "Sami",
      "text": "Die bouwt gewoon met zijn tanden.",
      "start": 47.466,
      "end": 48.701
    },
    {
      "page": 30,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "De bever legt zijn tak neer.",
      "start": 49.191,
      "end": 50.726
    },
    {
      "page": 30,
      "beat": 6,
      "speaker": "Maryam",
      "text": "En de beek stroomt maar door.",
      "start": 51.216,
      "end": 52.871
    },
    {
      "page": 30,
      "beat": 7,
      "speaker": "Meester Bob",
      "text": "Tussen de stenen glinstert het water.",
      "start": 53.361,
      "end": 55.376
    },
    {
      "page": 31,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Bij de dam liggen acht takken hier en zeven daar.",
      "start": 56.126,
      "end": 58.821
    },
    {
      "page": 31,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Adam telt mee vanop de overkant.",
      "start": 59.311,
      "end": 61.046
    },
    {
      "page": 31,
      "beat": 2,
      "speaker": "Adam",
      "text": "Die hebben nog werk.",
      "start": 61.536,
      "end": 62.511
    },
    {
      "page": 31,
      "beat": 3,
      "speaker": "Meester Bob",
      "text": "Acht hier en zeven daar.",
      "start": 63.001,
      "end": 64.576
    },
    {
      "page": 31,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Hoeveel losse takken zijn dat samen?",
      "start": 65.066,
      "end": 66.581
    }
  ]
},
{
  "id": "part-10",
  "src": "assets/book-narration/part-10-clean-v2.mp3",
  "duration": 53.515,
  "pages": [
    32,
    33
  ],
  "endsWithQuestion": false,
  "cues": [
    {
      "page": 32,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Samen vijftien takken. Eentje gaat naar de dam.",
      "start": 0.4,
      "end": 3.475
    },
    {
      "page": 32,
      "beat": 1,
      "speaker": "Meester Bob",
      "text": "Duwen, schuiven… daar ligt hij goed!",
      "start": 3.965,
      "end": 6.4
    },
    {
      "page": 32,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Sami legt zijn hand op zijn buik.",
      "start": 6.89,
      "end": 8.405
    },
    {
      "page": 32,
      "beat": 3,
      "speaker": "Sami",
      "text": "Ik krijg honger van al dat werken.",
      "start": 8.895,
      "end": 10.25
    },
    {
      "page": 32,
      "beat": 4,
      "speaker": "Meester Bob",
      "text": "Maryam kijkt hem aan.",
      "start": 10.74,
      "end": 11.775
    },
    {
      "page": 32,
      "beat": 5,
      "speaker": "Maryam",
      "text": "Jij hebt toch niet gebouwd?",
      "start": 12.265,
      "end": 13.52
    },
    {
      "page": 32,
      "beat": 6,
      "speaker": "Sami",
      "text": "Van het kijken dan.",
      "start": 14.01,
      "end": 14.865
    },
    {
      "page": 32,
      "beat": 7,
      "speaker": "Meester Bob",
      "text": "Lachend stappen ze terug. De schaduwen worden langer.",
      "start": 15.355,
      "end": 18.35
    },
    {
      "page": 32,
      "beat": 8,
      "speaker": "Meester Bob",
      "text": "Knisper, knasper, onder hun schoenen.",
      "start": 18.84,
      "end": 20.975
    },
    {
      "page": 33,
      "beat": 0,
      "speaker": "Meester Bob",
      "text": "Aan de bosrand kijkt Amina om.",
      "start": 21.725,
      "end": 23.34
    },
    {
      "page": 33,
      "beat": 1,
      "speaker": "Amina",
      "text": "Die roze bloemen. Daar was ik bijna voorbijgelopen.",
      "start": 23.83,
      "end": 27.185
    },
    {
      "page": 33,
      "beat": 2,
      "speaker": "Meester Bob",
      "text": "Adam trekt zijn jas dicht.",
      "start": 27.675,
      "end": 28.93
    },
    {
      "page": 33,
      "beat": 3,
      "speaker": "Adam",
      "text": "Zou die egel nu al onder zijn bladerendeken zitten?",
      "start": 29.42,
      "end": 32.215
    },
    {
      "page": 33,
      "beat": 4,
      "speaker": "Maryam",
      "text": "Misschien moet hij nog verder bouwen.",
      "start": 32.705,
      "end": 34.4
    },
    {
      "page": 33,
      "beat": 5,
      "speaker": "Meester Bob",
      "text": "Sami voelt aan zijn rugzak.",
      "start": 34.89,
      "end": 36.265
    },
    {
      "page": 33,
      "beat": 6,
      "speaker": "Sami",
      "text": "Mijn voorraad mag er straks uit.",
      "start": 36.755,
      "end": 38.15
    },
    {
      "page": 33,
      "beat": 7,
      "speaker": "Meester Bob",
      "text": "Een rood blad landt vlak naast Sami's schoen.",
      "start": 38.64,
      "end": 41.015
    },
    {
      "page": 33,
      "beat": 8,
      "speaker": "Meester Bob",
      "text": "Hij wacht… en stapt er voorzichtig naast.",
      "start": 41.505,
      "end": 44.0
    },
    {
      "page": 33,
      "beat": 9,
      "speaker": "Sami",
      "text": "Die laat ik liggen.",
      "start": 44.49,
      "end": 45.185
    },
    {
      "page": 33,
      "beat": 10,
      "speaker": "Meester Bob",
      "text": "Amina kijkt.",
      "start": 45.675,
      "end": 46.45
    },
    {
      "page": 33,
      "beat": 11,
      "speaker": "Amina",
      "text": "Voor een kevertje?",
      "start": 46.94,
      "end": 47.995
    },
    {
      "page": 33,
      "beat": 12,
      "speaker": "Sami",
      "text": "Je weet maar nooit.",
      "start": 48.485,
      "end": 49.18
    },
    {
      "page": 33,
      "beat": 13,
      "speaker": "Meester Bob",
      "text": "Ze lopen het bos uit. Achter hen ritselt het.",
      "start": 49.67,
      "end": 52.545
    }
  ]
}
];
