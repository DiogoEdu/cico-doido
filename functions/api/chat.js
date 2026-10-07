const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
const styles={calmo:'calmo e acolhedor',animado:'animado e positivo',brincalhao:'bem-humorado e informal, sem exagerar nas gírias',profissional:'objetivo e profissional',firme:'direto, respeitoso e sem ofensas'};
export async function onRequestGet({env}){return json({available:!!env.AI});}
export async function onRequestPost({request,env}){
const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Origem não permitida.'},403);
if(!env.AI)return json({error:'A conexão Workers AI ainda não está disponível nesta implantação.'},503);
if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'Envie uma mensagem em JSON.'},415);
let body;try{const raw=await request.text();if(raw.length>24000)return json({error:'Conversa muito longa. Envie um pedido menor.'},413);body=JSON.parse(raw);}catch{return json({error:'Mensagem inválida.'},400);}
if(!Array.isArray(body.messages)||!body.messages.length||body.messages.length>12)return json({error:'Histórico inválido.'},400);
if(body.messages.some(m=>!m||!['user','assistant'].includes(m.role)||typeof m.content!=='string'||!m.content.trim()||m.content.length>2000)||body.messages.at(-1).role!=='user')return json({error:'Mensagem inválida.'},400);
const system='Você é Ciço Doido, assistente pessoal de Diogo. Responda em português brasileiro, com tom '+(styles[body.personality]||styles.brincalhao)+'. Use frases curtas e naturais para leitura em voz alta, sem emojis ou Markdown. Considere o histórico. Quando o usuário apontar um erro, revise o que você disse, reconheça e corrija quando houver motivo; peça detalhes se necessário e não concorde com algo falso só para agradar. Você pode errar: não invente certezas. Não tem acesso à internet, computador ou código e não pode alterar o próprio sistema ou executar ações. Não diga que realizou tarefas ou corrigiu áudio; apenas explique. Máximo de 150 palavras.';
try{const result=await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8',{messages:[{role:'system',content:system},...body.messages],max_tokens:350});if(typeof result.response!=='string'||!result.response.trim())throw new Error('empty');return json({reply:result.response.trim()});}catch{return json({error:'A IA não respondeu agora. Tente novamente; confira também a disponibilidade e a cota do Workers AI.'},502);}
}
