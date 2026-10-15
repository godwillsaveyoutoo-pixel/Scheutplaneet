// Extra illustrations follow existing source passage IDs. The audio timeline,
// arithmetic stops and saved page/beat positions remain the same.
const rightCaption={authoredSpace:true,anchor:'top-right',sidePct:4,topPct:9,widthPct:29,maxHeightPct:43,
  textSurface:'paper',protected:[{x:0,y:0,w:63,h:100,label:'Handeling en personages'}]};

export const detailShots=[
  {page:3,from:'maandag-na-01',image:'assets/book/maandag-delen.webp',
    alt:'Alina legt haar derde rode gummibeertje in haar doosje. Op het papier blijven vijf beertjes liggen.',layout:{...rightCaption}},
  {page:5,from:'dinsdag-na-03',image:'assets/book/dinsdag-ruiken.webp',
    alt:'Van over Alina’s schouder zien we Milan nog eens aan zijn eigen doosje met vier mandarijnpartjes ruiken.',layout:{...rightCaption}},
  {page:11,from:'vrijdag-na-02',image:'assets/book/vrijdag-blauwe-knikker.webp',
    alt:'Alina houdt de blauwe knikker met de witte kronkel tegen het licht en bekijkt hem aandachtig.',layout:{...rightCaption}},
  {page:13,from:'zaterdag-na-05',image:'assets/book/zaterdag-schommels.webp',
    alt:'Van achteren zien we Milan en Alina samen naar de schommels lopen.',layout:{...rightCaption}},
  {page:15,from:'zondag-na-03',image:'assets/book/zondag-fruitstokjes.webp',
    alt:'Een detail van Milans handen terwijl hij stukjes appel op zijn fruitstokje schuift.',
    layout:{...rightCaption,topPct:4,maxHeightPct:34,protected:[
      {x:0,y:0,w:63,h:100,label:'Handen en fruitstokjes'},
      {x:65,y:43,w:35,h:57,label:'Bord met appelstukjes'}]}}
];

export function visualsForPage(page){
  return [{image:page.image,alt:page.alt,layout:page.layout},...detailShots.filter(shot=>shot.page===page.page)];
}

export function visualForPassage(page,beat=0){
  let visual={image:page.image,alt:page.alt,layout:page.layout};
  for(const shot of detailShots){
    if(shot.page!==page.page)continue;
    const start=page.beats.findIndex(passage=>passage.id===shot.from);
    if(start>=0&&beat>=start)visual=shot;
  }
  return visual;
}
