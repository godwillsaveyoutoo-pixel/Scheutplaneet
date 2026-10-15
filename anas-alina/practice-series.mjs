// Every genuine subtraction crossing ten occurs once in the shuffled pool.
const pairs=Array.from({length:8},(_,i)=>11+i).flatMap(first=>
  Array.from({length:9},(_,i)=>i+1).filter(second=>first-second<10).map(second=>[first,second]));
export function createPracticeSeries(random=Math.random){
  let pool=[],previous='';
  function refill(){
    pool=pairs.map(pair=>[...pair]);
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  }
  return {next(length=10){
    if(!Number.isInteger(length)||length<1||length>pairs.length)throw new RangeError('Choose 1–36 exercises.');
    const series=[],used=new Set();
    while(series.length<length){
      if(!pool.length)refill();
      const pair=pool.shift(),key=pair.join('-');
      if(used.has(key)||(!series.length&&key===previous)){pool.push(pair);continue;}
      series.push(pair);used.add(key);previous=key;
    }
    return series;
  }};
}
