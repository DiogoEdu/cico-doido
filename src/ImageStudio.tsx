import {useEffect, useRef, useState} from 'react';
import {blackTransparent} from './image';

export default function ImageStudio() {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState('');
  const [result, setResult] = useState('');
  const [threshold, setThreshold] = useState(155);
  const [angle, setAngle] = useState(0);
  const [size, setSize] = useState(2400);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const active = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {mounted.current = true; return () => {mounted.current = false;};}, []);
  useEffect(() => {if (!file) {setSource(''); return;} const url = URL.createObjectURL(file); setSource(url); return () => URL.revokeObjectURL(url);}, [file]);
  useEffect(() => () => {if (result) URL.revokeObjectURL(result);}, [result]);
  function invalidate() {setResult(''); setStatus(''); setError('');}
  async function create() {
    if (!file || !source || active.current) return;
    active.current = true; setBusy(true); invalidate();
    try {
      const image = new Image(); image.src = source; await image.decode();
      const scale = Math.min(1, 3000 / Math.max(image.naturalWidth, image.naturalHeight));
      const w = Math.max(1, Math.round(image.naturalWidth * scale)), h = Math.max(1, Math.round(image.naturalHeight * scale));
      const radians = angle * Math.PI / 180;
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(Math.abs(w * Math.cos(radians)) + Math.abs(h * Math.sin(radians))) + 2;
      canvas.height = Math.ceil(Math.abs(h * Math.cos(radians)) + Math.abs(w * Math.sin(radians))) + 2;
      const context = canvas.getContext('2d', {willReadFrequently: true}); if (!context) throw new Error('Seu navegador não conseguiu abrir o editor.');
      context.translate(canvas.width / 2, canvas.height / 2); context.rotate(radians); context.drawImage(image, -w / 2, -h / 2, w, h); context.resetTransform();
      const data = context.getImageData(0, 0, canvas.width, canvas.height);
      const bounds = blackTransparent(data.data, canvas.width, canvas.height, threshold);
      if (!bounds) throw new Error('Nenhum traço encontrado. Aumente a intensidade para preservar mais detalhes.');
      context.putImageData(data, 0, 0);
      const output = document.createElement('canvas');
      const factor = size * .9 / Math.max(bounds.width, bounds.height);
      const dw = Math.max(1, Math.round(bounds.width * factor)), dh = Math.max(1, Math.round(bounds.height * factor));
      const margin = Math.round(size * .05);
      output.width = dw + margin * 2; output.height = dh + margin * 2;
      const out = output.getContext('2d'); if (!out) throw new Error('Não foi possível preparar o PNG.');
      out.imageSmoothingEnabled = true; out.imageSmoothingQuality = 'high';
      out.drawImage(canvas, bounds.left, bounds.top, bounds.width, bounds.height, margin, margin, dw, dh);
      const blob = await new Promise<Blob>((resolve, reject) => output.toBlob(b => b ? resolve(b) : reject(new Error('Não foi possível salvar o PNG.')), 'image/png'));
      if (mounted.current) {setResult(URL.createObjectURL(blob)); setStatus(`PNG pronto: ${output.width} × ${output.height} pixels. Confira a inclinação, os textos e os detalhes.`);}
    } catch (e) {if (mounted.current) setError(e instanceof Error ? e.message : 'Não foi possível preparar a imagem.');}
    finally {active.current = false; if (mounted.current) setBusy(false);}
  }
  return <div className="image-studio">
    <h3>Sua arte preta e transparente, grátis.</h3>
    <p>Remova fundos claros, deixe os traços pretos e centralize a arte. Ajuste a inclinação para endireitar. Tudo acontece neste aparelho, sem enviar a imagem para serviços externos.</p>
    <label className="image-upload">Imagem de referência<input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e => {
      invalidate(); setAngle(0); const selected = e.target.files?.[0];
      if (!selected) {setFile(null); return;}
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(selected.type) || selected.size > 10 * 1024 * 1024 || !selected.size) {setFile(null); setError('Escolha um PNG, JPG ou WebP de até 10 MB.'); e.target.value = ''; return;}
      setFile(selected);
    }}/><small>PNG, JPG ou WebP · até 10 MB</small></label>
    {source && <div className="image-preview"><h4>Referência</h4><div className="image-checker"><img src={source} alt="Arte original enviada"/></div></div>}
    <div className="image-controls"><label>Intensidade dos traços · {threshold}<input type="range" min="30" max="245" value={threshold} disabled={busy} onChange={e=>{setThreshold(Number(e.target.value)); invalidate();}}/><small>Aumente para recuperar traços claros; diminua para remover mais fundo.</small></label>
    <label>Endireitar · {angle.toFixed(1)}°<input type="range" min="-20" max="20" step="0.1" value={angle} disabled={busy} onChange={e=>{setAngle(Number(e.target.value)); invalidate();}}/></label>
    <label>Tamanho do lado maior<select value={size} disabled={busy} onChange={e=>{setSize(Number(e.target.value)); invalidate();}}><option value="1600">1600 pixels</option><option value="2400">2400 pixels</option><option value="3600">3600 pixels</option></select></label></div>
    <p className="settings-note">Melhor para letras e desenhos escuros sobre fundo claro. Não recria detalhes perdidos nem corrige perspectiva ou cada elemento separadamente. Ampliar aumenta o tamanho do arquivo; a nitidez depende do original.</p>
    <button className="voice-button" disabled={!file || busy} onClick={()=>void create()}>{busy ? 'Preparando arte…' : 'criar tela da imagem'}</button>
    {status && <p role="status">{status}</p>}{error && <p role="alert" className="storage-error">{error}</p>}
    {result && <div className="image-preview"><h4>Arte final · PNG transparente</h4><div className="image-checker"><img src={result} alt="Arte centralizada em preto com fundo transparente"/></div><a className="image-download" href={result} download="arte-preta-transparente.png">Baixar PNG transparente</a></div>}
  </div>;
}
