export type ChatMessage={role:string,text:string};
export const greeting:ChatMessage={role:'assistant',text:'Opa! Sou o Ciço. Pode chegar: vamos tirar as ideias da cabeça e colocar o dia em ordem. Diga ajuda para conhecer meus comandos.'};
export function readHistory(raw:string|null):ChatMessage[]{
try{const data=JSON.parse(raw||'null');if(!Array.isArray(data))return [greeting];const valid=data.filter(m=>m&&['assistant','user','search','notice'].includes(m.role)&&typeof m.text==='string'&&m.text.trim()).slice(-100).map(m=>({role:m.role,text:m.text.slice(0,2000)}));return valid.length?valid:[greeting];}catch{return [greeting];}
}
