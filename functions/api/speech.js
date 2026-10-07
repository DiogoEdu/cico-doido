const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
const voices=['onyx','echo'];
export function onRequestGet({env}){return json({available:!!env.OPENAI_API_KEY,voices});}
export async function onRequestPost({request,env}){
const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Origem não permitida.'},403);
if(!env.OPENAI_API_KEY)return json({error:'A voz natural ainda precisa da chave de API configurada no servidor.'},503);
if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'Formato inválido.'},415);
let body;try{const raw=await request.text();if(raw.length>10000)return json({error:'Texto muito longo.'},413);body=JSON.parse(raw);}catch{return json({error:'Pedido inválido.'},400);}
if(typeof body.text!=='string'||!body.text.trim()||body.text.length>2000||!voices.includes(body.voice))return json({error:'Texto ou voz inválidos.'},400);
const styles={calmo:'calmo e acolhedor',animado:'animado e positivo',brincalhao:'descontraído e bem-humorado',profissional:'claro e profissional',firme:'firme e respeitoso'};
try{const result=await fetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:'Bearer '+env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-4o-mini-tts',voice:body.voice,input:body.text,response_format:'mp3',instructions:'Fale em português brasileiro com voz masculina, ritmo fluido e natural, tom '+(styles[body.personality]||styles.brincalhao)+'. Evite pausas longas e uma leitura robótica.'}),signal:AbortSignal.timeout(30000)});if(!result.ok)return json({error:result.status===429?'O serviço de voz atingiu a cota. Confira os créditos da API.':'O serviço de voz não respondeu. Confira a configuração da API.'},502);return new Response(result.body,{headers:{'Content-Type':'audio/mpeg','Cache-Control':'no-store'}});}catch{return json({error:'Não consegui gerar o áudio agora. Tente novamente.'},502);}
}
