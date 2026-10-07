import test from 'node:test';
import assert from 'node:assert/strict';
import {blackTransparent} from '../src/image.ts';
test('retira fundo bege, preserva traços escuros e transparência original', () => {
  const p = new Uint8ClampedArray([240,220,200,255, 80,50,20,255, 0,0,0,0, 90,80,70,128]);
  assert.deepEqual(blackTransparent(p,2,2,155), {left:1,top:0,width:1,height:2});
  assert.deepEqual([...p],[0,0,0,0,0,0,0,255,0,0,0,0,0,0,0,128]);
});
test('não produz arte vazia e ajuste recupera detalhes claros', () => {
  assert.equal(blackTransparent(new Uint8ClampedArray([255,255,255,255]),1,1,245),null);
  assert.equal(blackTransparent(new Uint8ClampedArray([180,180,180,255]),1,1,155),null);
  assert.deepEqual(blackTransparent(new Uint8ClampedArray([180,180,180,255]),1,1,200),{left:0,top:0,width:1,height:1});
});
