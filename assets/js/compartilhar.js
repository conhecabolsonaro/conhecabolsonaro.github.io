/* Conheça Bolsonaro — compartilhar (site e páginas de cada caso) e letra grande. Sem dependências. */
(function () {
  'use strict'

  const SITE = 'https://conhecabolsonaro.github.io/'
  const enc = encodeURIComponent
  const $ = (s, el = document) => el.querySelector(s)
  const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  const cut = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,;:.]+\S*$/, '') + '…' }
  // *, _ e ~ formatam texto no WhatsApp
  const plain = s => String(s || '').replace(/[*_~]/g, '')
  const pretty = u => String(u).replace(/^https?:\/\//, '').replace(/\/$/, '')

  // marcas (simple-icons, CC0) e ícones de traço
  const BRAND = {
    whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
    telegram: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
    facebook: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
    x: 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z',
    threads: 'M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z',
    bluesky: 'M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026',
  }
  const brand = k => `<svg class="sh-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${BRAND[k]}"/></svg>`
  const stroke = d => `<svg class="sh-ico st" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`
  const ICO = {
    link: stroke('<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/>'),
    msg: stroke('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12.5h5"/>'),
    img: stroke('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M9 15.5l2.2-2.4 1.8 1.8 2-2.2"/>'),
    qr: stroke('<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h1M19 14h1"/>'),
    mail: stroke('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'),
    more: stroke('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>'),
  }

  // ------------------------------------------------------------------ mensagens
  // d = { url, titulo, meta, texto, fontes, convite, imagem: { kicker, grande, rotulo, ano, cor } }
  function pack(d) {
    const url = d.url || SITE
    const titulo = plain(d.titulo)
    const corpo = bold => {
      const out = []
      if (titulo) out.push(bold ? `*${titulo}*` : titulo)
      if (d.meta) out.push(plain(d.meta))
      if (d.texto) out.push('', plain(cut(d.texto, 420)))
      if (d.fontes) out.push('', 'Fontes: ' + plain(d.fontes))
      out.push('', d.convite || 'Leia com as fontes:', url)
      return out.join('\n')
    }
    return { url, titulo, whats: corpo(true), texto: corpo(false), curto: cut(titulo, 220) }
  }
  function links(d) {
    const p = pack(d)
    return {
      whatsapp: 'https://wa.me/?text=' + enc(p.whats),
      telegram: `https://t.me/share/url?url=${enc(p.url)}&text=${enc(p.curto)}`,
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(p.url),
      x: `https://twitter.com/intent/tweet?text=${enc(cut(p.titulo, 200))}&url=${enc(p.url)}`,
      threads: 'https://www.threads.net/intent/post?text=' + enc(p.curto + ' ' + p.url),
      bluesky: 'https://bsky.app/intent/compose?text=' + enc(p.curto + ' ' + p.url),
      email: `mailto:?subject=${enc(p.titulo || 'Conheça Bolsonaro')}&body=${enc(p.texto)}`,
    }
  }

  // ------------------------------------------------------------------ janela
  let dlg = null, cur = null, objUrl = null, imgFile = null
  const NETS = [['telegram', 'Telegram'], ['facebook', 'Facebook'], ['x', 'X (Twitter)'], ['threads', 'Threads'], ['bluesky', 'Bluesky']]

  function build() {
    dlg = document.createElement('dialog')
    dlg.className = 'share'
    dlg.setAttribute('aria-labelledby', 'shTitle')
    dlg.innerHTML = `<div class="share-in">
      <div class="share-top"><p class="share-h" id="shTitle">Compartilhar</p><button class="icon-btn" type="button" data-sh="close" aria-label="Fechar">✕</button></div>
      <p class="share-what" id="shWhat"></p>
      <a class="share-wa" id="shWa" href="#" target="_blank" rel="noopener">${brand('whatsapp')}<span>Enviar no WhatsApp</span></a>
      <div class="share-grid" id="shGrid"></div>
      <div class="share-extra" id="shExtra" hidden></div>
      <p class="share-url"><span id="shUrl"></span></p>
      <div class="share-toast" id="shToast" role="status" aria-live="polite"></div>
    </div>`
    document.body.appendChild(dlg)
    dlg.addEventListener('click', onClick)
    dlg.addEventListener('close', () => {
      const ex = $('#shExtra', dlg); ex.hidden = true; ex.innerHTML = ''
      if (objUrl) { URL.revokeObjectURL(objUrl); objUrl = null }
      imgFile = null
    })
  }

  function open(d) {
    if (!dlg) build()
    cur = d
    const L = links(d)
    $('#shTitle', dlg).textContent = d.rotulo || 'Compartilhar'
    $('#shWhat', dlg).textContent = d.titulo || ''
    $('#shWa', dlg).href = L.whatsapp
    $('#shUrl', dlg).textContent = pretty(pack(d).url)
    const items = []
    if (navigator.share) items.push(`<button type="button" data-sh="native">${ICO.more}<span>Outros apps</span></button>`)
    items.push(`<button type="button" data-sh="copy">${ICO.link}<span>Copiar link</span></button>`)
    items.push(`<button type="button" data-sh="msg">${ICO.msg}<span>Copiar mensagem</span></button>`)
    items.push(`<button type="button" data-sh="img">${ICO.img}<span>Imagem para status</span></button>`)
    NETS.forEach(([k, label]) => items.push(`<a href="${escH(L[k])}" target="_blank" rel="noopener" data-net="${k}">${brand(k)}<span>${label}</span></a>`))
    items.push(`<a href="${escH(L.email)}" data-net="email">${ICO.mail}<span>E-mail</span></a>`)
    items.push(`<button type="button" data-sh="qr">${ICO.qr}<span>QR code</span></button>`)
    $('#shGrid', dlg).innerHTML = items.join('')
    const ex = $('#shExtra', dlg); ex.hidden = true; ex.innerHTML = ''
    if (!dlg.open) dlg.showModal()
    $('#shWa', dlg).focus({ preventScroll: true })
  }

  function onClick(e) {
    if (e.target === dlg) return dlg.close()
    const b = e.target.closest('[data-sh]'); if (!b) return
    const p = pack(cur)
    const act = b.dataset.sh
    if (act === 'close') dlg.close()
    else if (act === 'copy') copy(p.url, 'Link copiado')
    else if (act === 'msg') copy(p.whats, 'Mensagem copiada. É só colar na conversa.')
    else if (act === 'native') navigator.share({ title: p.titulo || 'Conheça Bolsonaro', text: p.titulo + (cur.meta ? ' · ' + plain(cur.meta) : ''), url: p.url }).catch(() => {})
    else if (act === 'img') showImage()
    else if (act === 'imgshare' && imgFile) navigator.share({ files: [imgFile], text: p.titulo + '\n' + p.url }).catch(() => {})
    else if (act === 'qr') showQR()
  }

  function toast(msg) {
    const t = $('#shToast', dlg); t.textContent = msg; t.classList.add('show')
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2600)
  }
  function copy(text, ok) {
    const fallback = () => {
      const t = document.createElement('textarea')
      t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      dlg.appendChild(t); t.select()
      let r = false; try { r = document.execCommand('copy') } catch (err) { r = false }
      t.remove()
      toast(r ? ok : 'Não deu para copiar. Selecione o endereço abaixo.')
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => toast(ok), fallback)
    else fallback()
  }

  // ------------------------------------------------------------------ imagem para status e stories (1080 × 1920)
  async function showImage() {
    const ex = $('#shExtra', dlg)
    ex.hidden = false
    ex.innerHTML = '<p class="share-wait">Preparando a imagem…</p>'
    let blob
    try { blob = await storyBlob(cur) } catch (err) { ex.innerHTML = '<p class="share-wait">Não foi possível gerar a imagem neste aparelho.</p>'; return }
    if (objUrl) URL.revokeObjectURL(objUrl)
    objUrl = URL.createObjectURL(blob)
    const name = (cur.arquivo || 'conheca-bolsonaro') + '.png'
    imgFile = new File([blob], name, { type: 'image/png' })
    const canFiles = !!(navigator.canShare && navigator.canShare({ files: [imgFile] }))
    ex.innerHTML = `<figure class="share-img"><img src="${objUrl}" alt="Prévia da imagem para status e stories"></figure>
      <div class="share-img-act">
        ${canFiles ? '<button class="btn-primary" type="button" data-sh="imgshare">Compartilhar imagem</button>' : ''}
        <a class="${canFiles ? 'link-ghost' : 'btn-primary'}" href="${objUrl}" download="${escH(name)}">Baixar imagem</a>
      </div>
      <p class="share-hint">Use no <b>Status</b> do WhatsApp ou nos <b>Stories</b> do Instagram. A imagem já traz o endereço do site.</p>`
    ex.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  const FONT = '"Hanken Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif'
  function wrap(x, text, max) {
    const out = []; let line = ''
    String(text || '').split(/\s+/).filter(Boolean).forEach(w => {
      const t = line ? line + ' ' + w : w
      if (line && x.measureText(t).width > max) { out.push(line); line = w } else line = t
    })
    if (line) out.push(line)
    return out
  }
  function clampLines(x, ls, n, max) {
    if (ls.length <= n) return ls
    const out = ls.slice(0, n)
    let last = out[n - 1] + '…'
    while (x.measureText(last).width > max && last.length > 2) last = last.slice(0, -2).replace(/[\s,;:.]+$/, '') + '…'
    out[n - 1] = last
    return out
  }
  const spacing = (x, v) => { if ('letterSpacing' in x) x.letterSpacing = v }

  async function storyBlob(d) {
    const im = d.imagem || {}
    const W = 1080, H = 1920, P = 92, MAXW = W - P * 2
    const c = document.createElement('canvas'); c.width = W; c.height = H
    const x = c.getContext('2d')
    if (document.fonts && document.fonts.load) {
      try { await Promise.race([Promise.all(['400 90px', '500 40px', '600 30px'].map(f => document.fonts.load(`${f} "Hanken Grotesk"`))), new Promise(r => setTimeout(r, 2500))]) } catch (err) { /* segue com a fonte de reserva */ }
    }
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H)
    x.textBaseline = 'alphabetic'
    // ano ao fundo, como nas cenas do site
    if (im.ano) {
      x.fillStyle = '#f3f0fd'; x.font = `400 520px ${FONT}`; spacing(x, '-30px'); x.textAlign = 'right'
      x.fillText(String(im.ano), W + 30, H - 330); x.textAlign = 'left'
    }
    // marca
    x.strokeStyle = '#8052ff'; x.lineWidth = 8; x.lineJoin = 'round'
    x.beginPath(); x.moveTo(P + 24, 112); x.lineTo(P + 50, 158); x.lineTo(P - 2, 158); x.closePath(); x.stroke()
    x.fillStyle = '#0a0a0a'; x.font = `600 30px ${FONT}`; spacing(x, '4px'); x.fillText('CONHEÇA BOLSONARO', P + 70, 156)
    let y = 330
    if (im.kicker) {
      x.fillStyle = im.cor || '#5b34d6'; x.font = `600 32px ${FONT}`; spacing(x, '3px')
      clampLines(x, wrap(x, String(im.kicker).toUpperCase(), MAXW), 2, MAXW).forEach(l => { x.fillText(l, P, y); y += 44 })
      y += 46
    }
    if (im.grande) {
      let s = 150; x.font = `400 ${s}px ${FONT}`; spacing(x, '-5px')
      while (x.measureText(im.grande).width > MAXW && s > 70) { s -= 6; x.font = `400 ${s}px ${FONT}` }
      x.fillStyle = '#5b34d6'; y += s * 0.78; x.fillText(im.grande, P, y); y += 40
      if (im.rotulo) {
        x.fillStyle = '#4a4a4a'; x.font = `500 36px ${FONT}`; spacing(x, '0px')
        clampLines(x, wrap(x, im.rotulo, MAXW), 2, MAXW).forEach(l => { y += 46; x.fillText(l, P, y) })
      }
      y += 70
    }
    const footTop = H - 330
    const titulo = d.titulo || ''
    let size = 92, tl
    for (; size >= 56; size -= 6) {
      x.font = `400 ${size}px ${FONT}`; spacing(x, `${-size * 0.03}px`)
      tl = wrap(x, titulo, MAXW)
      if (tl.length <= (im.grande ? 5 : 7) && y + tl.length * size * 1.08 < footTop - 120) break
    }
    tl = clampLines(x, tl, im.grande ? 5 : 7, MAXW)
    x.fillStyle = '#0a0a0a'
    tl.forEach(l => { y += size * 1.08; x.fillText(l, P, y) })
    if (d.texto) {
      y += 40
      x.font = `400 38px ${FONT}`; spacing(x, '0px'); x.fillStyle = '#2a2a2a'
      const room = Math.floor((footTop - 60 - y) / 53)
      if (room > 0) clampLines(x, wrap(x, d.texto, MAXW), Math.min(room, 9), MAXW).forEach(l => { y += 53; x.fillText(l, P, y) })
    }
    // rodapé: onde ler
    x.fillStyle = '#ececea'; x.fillRect(P, footTop, MAXW, 2)
    x.fillStyle = '#6b6b6b'; x.font = `400 34px ${FONT}`; spacing(x, '0px')
    x.fillText(im.chamada || 'Leia a história completa, com as fontes:', P, footTop + 84)
    x.fillStyle = '#0a0a0a'; x.font = `600 58px ${FONT}`; spacing(x, '-1px')
    x.fillText('conhecabolsonaro.github.io', P, footTop + 164)
    const path = pretty(pack(d).url).replace(/^[^/]+/, '')
    if (path) { x.fillStyle = '#5b34d6'; x.font = `500 30px ${FONT}`; spacing(x, '0px'); x.fillText(clampLines(x, [path], 1, MAXW)[0], P, footTop + 216) }
    return new Promise((ok, no) => c.toBlob(b => (b ? ok(b) : no(new Error('toBlob'))), 'image/png'))
  }

  // ------------------------------------------------------------------ QR code (biblioteca carregada só quando pedida)
  let qrLoading = null
  function loadQR() {
    if (window.qrcode) return Promise.resolve()
    if (!qrLoading) qrLoading = new Promise((ok, no) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'
      s.onload = ok; s.onerror = () => { qrLoading = null; no(new Error('qr')) }
      document.head.appendChild(s)
    })
    return qrLoading
  }
  async function showQR() {
    const ex = $('#shExtra', dlg)
    const url = pack(cur).url
    ex.hidden = false
    ex.innerHTML = '<p class="share-wait">Gerando o QR code…</p>'
    try {
      await loadQR()
      const q = window.qrcode(0, 'M'); q.addData(url); q.make()
      ex.innerHTML = `<figure class="share-qr">${q.createSvgTag({ cellSize: 6, margin: 2, scalable: true, alt: 'QR code para ' + pretty(url) })}<figcaption>Aponte a câmera do celular para abrir<br><b>${escH(pretty(url))}</b></figcaption></figure>`
    } catch (err) {
      ex.innerHTML = '<p class="share-wait">Sem conexão para gerar o QR code agora.</p>'
    }
  }

  // ------------------------------------------------------------------ letra grande
  const KEY = 'cb-letra'
  const Letra = {
    get on() { return document.documentElement.classList.contains('grande') },
    chosen() { try { return localStorage.getItem(KEY) } catch (err) { return null } },
    set(v) {
      document.documentElement.classList.toggle('grande', !!v)
      try { localStorage.setItem(KEY, v ? 'grande' : 'normal') } catch (err) { /* vale só nesta visita */ }
      sync()
      document.dispatchEvent(new CustomEvent('letra', { detail: !!v }))
    },
    toggle() { this.set(!this.on) },
  }
  function sync() {
    document.querySelectorAll('[data-letra]').forEach(b => {
      b.setAttribute('aria-pressed', String(Letra.on))
      const t = b.querySelector('[data-letra-label]')
      if (t) t.textContent = Letra.on ? 'Letra normal' : 'Letra grande'
    })
  }
  document.addEventListener('click', e => { if (e.target.closest('[data-letra]')) Letra.toggle() })
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync); else sync()

  window.Compartilhar = { SITE, open, links, pack, storyBlob, icon: brand }
  window.Letra = Letra
})()
