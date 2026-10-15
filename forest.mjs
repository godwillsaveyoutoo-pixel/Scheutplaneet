export const forestStories = [
  {id:'squirrel',name:'Eekhoorn',item:'eikels',left:'Noor',right:'Noot',title:'Een voorraad voor de winter',place:'Onder de grote eik',background:'story-forest.png',sprite:null,
   intro:'Noor en Noot verzamelen eikels. Ze verstoppen een voorraad voor de koude dagen.',
   problem:(a,b)=>`Noor vindt ${a} eikels. Noot vindt er ${b}. Hoeveel kunnen ze samen bewaren?`,
   ending:n=>`Noor en Noot hebben ${n} eikels om te verstoppen.`,finish:'Hun voorraad ligt klaar voor de koude dagen.'},
  {id:'hedgehog',name:'Egel',item:'bladeren',left:'Prik',right:'Pip',title:'Een warm nest',place:'Onder de beschutte haag',background:'hedgehog-forest.png',sprite:0,
   intro:'Prik en Pip zoeken droge bladeren. Ze willen een warm nest maken voor hun winterslaap.',
   problem:(a,b)=>`Prik brengt ${a} bladeren naar het nest. Pip brengt er ${b} bij. Hoeveel liggen er samen?`,
   ending:n=>`Met ${n} bladeren maken Prik en Pip hun nest warmer.`,finish:'Nu kunnen de egels lekker wegkruipen.'},
  {id:'mouse',name:'Bosmuis',item:'zaden',left:'Mies',right:'Mo',title:'Een voorraad in het hol',place:'Tussen de boomwortels',background:'mouse-forest.png',sprite:49.05149,spriteSize:'312.06897% 100%',
   intro:'Mies en Mo zoeken zaden tussen de bladeren. In hun hol hebben ze een plekje om voedsel te bewaren.',
   problem:(a,b)=>`Mies vindt ${a} zaden. Mo brengt er ${b} bij. Hoeveel gaan er samen naar hun hol?`,
   ending:n=>`Mies en Mo brengen ${n} zaden naar hun voorraadkamer.`,finish:'De zaden zijn veilig opgeborgen in hun hol.'},
  {id:'beaver',name:'Bever',item:'takken',left:'Bram',right:'Bieke',title:'Aan het werk bij de beek',place:'Op de oever van de bosbeek',background:'beaver-forest.png',sprite:100,spriteSize:'288.82979% 100%',
   intro:'Bram en Bieke verzamelen takken bij de beek. Daarmee bouwen ze verder aan hun dam.',
   problem:(a,b)=>`Bram brengt ${a} takken naar de dam. Bieke brengt er ${b} bij. Hoeveel hebben ze samen?`,
   ending:n=>`Bram en Bieke hebben ${n} takken om verder te bouwen.`,finish:'De bevers kunnen weer aan de slag bij hun dam.'}
];
