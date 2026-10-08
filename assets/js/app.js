/* Conheça Bolsonaro — a história contada na rolagem (sem dependências além do d3 para o mapa) */
(function () {
  'use strict'

  const D = window.DOSSIE
  const STORY = window.STORY || { chapters: [] }
  const $ = (s, el = document) => el.querySelector(s)
  const $$ = (s, el = document) => [...el.querySelectorAll(s)]
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
  const ease = t => 1 - Math.pow(1 - t, 3)

  if (!D || !Array.isArray(D.events) || !D.events.length) {
    $('#timeline').innerHTML = '<div class="empty"><b>Dados não encontrados</b>Gere os dados com node scripts/build-data.mjs.</div>'
    return
  }

  const mqMobile = matchMedia('(max-width: 760px)')
  const isMobile = () => mqMobile.matches
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)').matches
  const Letra = window.Letra || { on: false, chosen: () => 'normal', set() {} }
  let reduce = reduceMQ || Letra.on

  // ------------------------------------------------------------------ dicionários
  // [cor viva (triângulos, pontos), cor de texto sobre fundo claro]
  const CAT = {
    rachadinha: ['#ff4d2e', '#c2341a'], imoveis: ['#ffb829', '#8a5a00'], milicia: ['#d6246e', '#a3124f'], abin: ['#1e9bd7', '#0b6a96'],
    golpe: ['#ff7a00', '#a84f00'], joias: ['#c9a227', '#7a620f'], pandemia: ['#15846e', '#0f6655'], desinformacao: ['#ff5fa2', '#b02a66'],
    internacional: ['#3b6cff', '#2146c4'], financas: ['#00a3a3', '#006e6e'], partido: ['#8c7a5b', '#5e5038'], eleicoes: ['#8052ff', '#5b34d6'],
    familia: ['#b5651d', '#8a4a12'], outros: ['#8e8e93', '#5c5c61'],
  }
  const KINDS = {
    revelacao: ['Revelação', '#ffb829'], investigacao: ['Investigação', '#1e9bd7'], operacao: ['Operação', '#ff7a00'],
    denuncia: ['Denúncia', '#ff4d2e'], 'decisao-judicial': ['Decisão judicial', '#3b6cff'], prisao: ['Prisão', '#e0002a'],
    condenacao: ['Condenação', '#a8001f'], arquivamento: ['Arquivado', '#15846e'], declaracao: ['Declaração', '#8e8e93'],
    politica: ['Política', '#8052ff'], outro: ['Registro', '#8e8e93'],
  }
  const GROUPS = {
    familia: ['Família', '#ff4d2e'], gabinete: ['Gabinete', '#ffb829'], milicia: ['Milícia', '#d6246e'], governo: ['Governo', '#ff7a00'],
    partido: ['Partido e aliados', '#8c7a5b'], justica: ['Justiça', '#3b6cff'], outros: ['Outros', '#9b9b9b'],
  }
  const KEY_PEOPLE = ['flavio', 'jair', 'carlos', 'eduardo', 'renan', 'michelle', 'queiroz']
  // nomes pelos quais as pessoas são conhecidas (primeiro + último nome às vezes confunde: Jair Renan, Ramagem)
  const KNOWN_AS = {
    flavio: 'Flávio Bolsonaro', jair: 'Jair Bolsonaro', carlos: 'Carlos Bolsonaro', eduardo: 'Eduardo Bolsonaro', renan: 'Jair Renan',
    michelle: 'Michelle Bolsonaro', 'ana-cristina': 'Ana Cristina Valle', rogeria: 'Rogéria Bolsonaro', queiroz: 'Fabrício Queiroz',
    'marcia-aguiar': 'Márcia Aguiar', adriano: 'Adriano da Nóbrega', wassef: 'Frederick Wassef', valdemar: 'Valdemar Costa Neto',
    ramagem: 'Alexandre Ramagem', heleno: 'Augusto Heleno', 'mauro-cid': 'Mauro Cid', 'braga-netto': 'Braga Netto',
    'anderson-torres': 'Anderson Torres', zambelli: 'Carla Zambelli', moraes: 'Alexandre de Moraes', vorcaro: 'Daniel Vorcaro',
    lessa: 'Ronnie Lessa', fernanda: 'Fernanda Bolsonaro', 'nunes-marques': 'Nunes Marques', 'gilmar-mendes': 'Gilmar Mendes',
    tarcisio: 'Tarcísio de Freitas', 'danielle-nobrega': 'Danielle da Nóbrega', 'daniela-nobrega': 'Daniela da Nóbrega',
    raimunda: 'Raimunda Magalhães', wal: 'Wal do Açaí', 'paulo-figueiredo': 'Paulo Figueiredo', 'alexandre-santini': 'Alexandre Santini',
    'jose-vicente-santini': 'José Vicente Santini', 'nathalia-queiroz': 'Nathalia Queiroz', 'evelyn-queiroz': 'Evelyn Queiroz',
    'renato-bolsonaro': 'Renato Bolsonaro', 'paulo-henrique-costa': 'Paulo Henrique Costa', lula: 'Lula',
    gonet: 'Paulo Gonet', aras: 'Augusto Aras', dino: 'Flávio Dino', 'ciro-nogueira': 'Ciro Nogueira', 'maria-do-rosario': 'Maria do Rosário',
    itabaiana: 'Flávio Itabaiana', noronha: 'João Otávio de Noronha', 'juliana-dal-piva': 'Juliana Dal Piva', ibaneis: 'Ibaneis Rocha',
    'claudio-castro': 'Cláudio Castro',
  }
  const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const MONTHS_LONG = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

  const catLabel = c => (D.categories && D.categories[c]) || c
  const catColor = c => (CAT[c] || CAT.outros)[0]
  const catInk = c => (CAT[c] || CAT.outros)[1]
  const kind = k => KINDS[k] || KINDS.outro

  // ------------------------------------------------------------------ índices
  const people = new Map(D.people.map(p => [p.key, p]))
  const evById = new Map()
  D.events.forEach((e, i) => {
    e._n = i + 1
    evById.set(e.id, e)
    ;(e.aliases || []).forEach(a => evById.set(a, e))
    const names = e.people.map(k => (people.get(k) || {}).name || k).join(' ')
    e._q = norm([e.title, e.summary, e.details, e.status, e.defense, names, catLabel(e.category), e.sources.map(s => s.outlet + ' ' + s.title).join(' ')].join(' '))
  })
  // ------------------------------------------------------------------ o mesmo site para todos, com Flávio em destaque
  const LEDE = 'Corrupção, rachadinha, milícia e Queiroz. Os casos de Flávio, com as fontes.'
  const mode = 'geral'
  // a antiga pergunta "você se considera bolsonarista?" saiu; a resposta guardada no aparelho é apagada
  try { localStorage.removeItem('cb-recorte') } catch (err) { /* sem armazenamento */ }
  const BROTHERS = ['carlos', 'eduardo', 'renan']
  // classificação de cada episódio (research/foco.json); sem ela, uma aproximação pelas pessoas citadas
  const focusOf = e => e.focus || { f: e.people.includes('flavio') ? 'p' : 'a', b: e.people.filter(k => BROTHERS.includes(k)), j: false }
  const isStar = e => focusOf(e).f === 'p'
  // gravidade (research/gravidade.json): grave = dinheiro público, corrupção, lavagem, rachadinha, crimes graves
  const gravOf = e => e.grav || { g: e.importance === 3 ? 'grave' : e.importance === 2 ? 'medio' : 'menor', r: '' }
  const isGrave = e => gravOf(e).g === 'grave'
  const BASE = D.events
  let viewCount = new Map()
  function countPeople() {
    viewCount = new Map()
    BASE.forEach(e => e.people.forEach(k => viewCount.set(k, (viewCount.get(k) || 0) + 1)))
  }
  const vc = k => viewCount.get(k) || 0
  countPeople()

  // cenas da história na ordem da cronologia, ancoradas no episódio que revelam
  let SCENES = [], sceneByEvent = new Set()
  function computeScenes() {
    const visible = c => !c.views || c.views.includes(mode)
    let k = 0
    const chapters = STORY.chapters.filter(visible).map(c => ({ ...c, n: c.id === 'prologo' ? 'Prólogo' : `Capítulo ${++k}` }))
    SCENES = [...chapters.map(c => ({ ch: c, epi: false })), ...(STORY.epilogue && visible(STORY.epilogue) ? [{ ch: STORY.epilogue, epi: true }] : [])]
      .filter(x => evById.has(x.ch.event))
      .map(x => ({ ...x, sort: evById.get(x.ch.event).sort }))
      .sort((a, b) => a.sort.localeCompare(b.sort))
    sceneByEvent = new Set(SCENES.map(x => x.ch.event))
  }
  computeScenes()

  function shortName(n) {
    const parts = String(n).split(/\s+/)
    return parts.length <= 2 ? n : parts[0] + ' ' + parts[parts.length - 1]
  }
  const displayName = key => KNOWN_AS[key] || shortName((people.get(key) || {}).name || key)
  const initials = name => {
    const w = String(name || '?').split(/\s+/).filter(x => /^[A-ZÀ-Ý]/.test(x))
    return ((w[0] || '?')[0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase()
  }
  function fmtDate(e, style) {
    const [y, m, d] = e.date.split('-')
    if (e.precision === 'year' || !m) return y
    if (e.precision === 'month' || !d) return style === 'long' ? `${MONTHS_LONG[+m - 1]} de ${y}` : `${MONTHS[+m - 1]} ${y}`
    return style === 'long' ? `${+d} de ${MONTHS_LONG[+m - 1]} de ${y}` : `${+d} ${MONTHS[+m - 1]} ${y}`
  }
  function fmtSourceDate(d) {
    const m = String(d || '').match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/)
    if (!m) return d || ''
    return m[3] ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : `${MONTHS[+m[2] - 1]} ${m[1]}`
  }
  const updated = (() => { const [y, m, d] = D.meta.updated.split('-'); return { short: `${+d} ${MONTHS[+m - 1]} ${y}`, long: `${+d} de ${MONTHS_LONG[+m - 1]} de ${y}` } })()
  function fmtBRL(v) {
    const f = (n, dig) => n.toLocaleString('pt-BR', { maximumFractionDigits: dig })
    if (v >= 1e9) return `R$ ${f(v / 1e9, 1)} bi`
    if (v >= 1e6) return `R$ ${f(v / 1e6, v >= 1e7 ? 1 : 2)} mi`
    if (v >= 1e4) return `R$ ${f(v / 1e3, 0)} mil`
    return `R$ ${f(v, 0)}`
  }
  const stripTags = s => String(s).replace(/<[^>]*>/g, '').trim()

  function avatar(key, cls = 'av') {
    const p = people.get(key) || { name: key }
    if (p.portrait && p.portrait.url) return `<img class="${cls}" src="${esc(p.portrait.thumb || p.portrait.url)}" alt="" title="${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer">`
    return `<span class="${cls}" title="${esc(p.name)}" aria-hidden="true">${esc(initials(p.name))}</span>`
  }

  // destaque de busca insensível a acentos; cada pedaço é escapado separadamente
  const ACC = { a: '[aáàâãä]', e: '[eéèêë]', i: '[iíìîï]', o: '[oóòôõö]', u: '[uúùûü]', c: '[cç]', n: '[nñ]' }
  let hlRegex = null
  const setHighlight = terms => {
    hlRegex = terms.length ? new RegExp('(' + terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[aeioucn]/g, ch => ACC[ch])).join('|') + ')', 'gi') : null
  }
  const hl = s => {
    const str = String(s ?? '')
    if (!hlRegex) return esc(str)
    return str.split(hlRegex).map((part, i) => i % 2 ? '<mark>' + esc(part) + '</mark>' : esc(part)).join('')
  }

  // ------------------------------------------------------------------ estado e filtros
  const state = { q: '', terms: [], persons: new Set(), cats: new Set(), milestones: false }
  let filtered = D.events
  // a história (com cenas) só some quando algo realmente filtra
  const isFiltering = () => !!(state.terms.length || state.persons.size || state.cats.size)

  function readUrl() {
    const sp = new URLSearchParams(location.search)
    ;(sp.get('pessoas') || '').split(',').filter(k => people.has(k)).forEach(k => state.persons.add(k))
    ;(sp.get('temas') || '').split(',').filter(c => D.categories[c]).forEach(c => state.cats.add(c))
    if (sp.get('q')) state.q = sp.get('q')
  }
  function writeUrl() {
    const sp = new URLSearchParams()
    if (state.persons.size) sp.set('pessoas', [...state.persons].join(','))
    if (state.cats.size) sp.set('temas', [...state.cats].join(','))
    if (state.milestones) sp.set('graves', '1')
    if (state.q) sp.set('q', state.q)
    const qs = sp.toString()
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash)
  }

  function applyFilters(opts = {}) {
    state.terms = norm(state.q).split(/\s+/).filter(t => t.length > 1)
    setHighlight(state.terms)
    filtered = BASE.filter(e =>
      (!state.milestones || isGrave(e)) &&
      (!state.cats.size || state.cats.has(e.category) || e.tags.some(t => state.cats.has(t))) &&
      [...state.persons].every(p => e.people.includes(p)) &&
      state.terms.every(t => e._q.includes(t)))
    renderTimeline()
    renderActiveFilters()
    syncControls()
    writeUrl()
    measureToolbar()
    if (opts.scroll) scrollToStoryStart()
  }

  // ------------------------------------------------------------------ capa
  function renderHero() {
    const c = D.meta.counts
    const [y0, y1] = D.meta.years
    $('#heroLabel').textContent = `${BASE.length} episódios · dados até ${updated.short}`
    $('#footerDate').textContent = updated.long
    $('#heroLede').textContent = LEDE
  }
  function countUp(el, to, delay = 0) {
    if (reduce) return
    el.textContent = '0'
    setTimeout(() => {
      const t0 = performance.now(), dur = 1500
      const step = t => {
        const k = Math.min(1, (t - t0) / dur)
        el.textContent = Math.round(to * ease(k)).toLocaleString('pt-BR')
        if (k < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, delay)
  }

  // ------------------------------------------------------------------ constelação
  function initConstellation() {
    const cv = $('#constellation')
    if (!cv || !cv.getContext) return
    const ctx = cv.getContext('2d')
    const tip = $('#cTip')
    let N = 0, eps = [], amb = [], proj = new Float32Array(0)
    let seed = 20261004
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
    const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) }

    // espiral: o episódio mais antigo no centro, o mais recente na borda. Só os episódios são triângulos.
    function build(list) {
    seed = 20261004
    N = list.length
    eps = list.map((e, i) => {
      const t = N > 1 ? i / (N - 1) : 0
      const arm = i % 3
      const theta = t * Math.PI * 4.4 + arm * (2 * Math.PI / 3) + gauss() * 0.16
      const r = 0.08 + 0.92 * Math.pow(t, 0.82) + gauss() * 0.025
      return { x: r * Math.cos(theta), y: gauss() * 0.06 * (1.3 - t * 0.5), z: r * Math.sin(theta), s: 3.2 + e.importance * 2, rot: rnd() * 6.283, spin: rnd() - 0.5, c: catColor(e.category), e }
    })
    // poeira ambiente: pontos pequenos, não triângulos
    amb = []
    const AMB = isMobile() ? 220 : 700
    for (let k = 0; k < AMB; k++) {
      const b = eps[Math.floor(rnd() * N)]
      const near = k < AMB * 0.8
      const sp = near ? 0.04 + rnd() * 0.05 : 0.3
      amb.push({ x: b.x + gauss() * sp, y: b.y + gauss() * sp * 0.7, z: b.z + gauss() * sp, s: 0.7 + rnd() * 1.1, c: b.c, a: near ? 0.42 : 0.2 })
    }
    proj = new Float32Array(N * 3)
    }
    build(BASE)

    let W = 0, H = 0, running = false, hover = -1, raf = 0, ptr = null
    let tiltT = 0, tilt = 0
    const t0 = performance.now()

    function resize() {
      const r = cv.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = r.width; H = r.height
      cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(performance.now())
    }
    function tri(x, y, size, a) {
      ctx.moveTo(x + size * Math.cos(a), y + size * Math.sin(a))
      ctx.lineTo(x + size * Math.cos(a + 2.0944), y + size * Math.sin(a + 2.0944))
      ctx.lineTo(x + size * Math.cos(a + 4.1888), y + size * Math.sin(a + 4.1888))
      ctx.closePath()
    }
    function draw(now) {
      const el = now - t0
      const k = reduce ? 1 : ease(clamp(el / 2400))
      tilt += (tiltT - tilt) * 0.05
      const angle = -0.7 + (reduce ? 0 : el * 0.00005)
      const ca = Math.cos(angle), sa = Math.sin(angle)
      const ct = Math.cos(1.05 + tilt), st = Math.sin(1.05 + tilt)
      const cx = W / 2, cy = H * 0.47, R = Math.min(W * 0.48, H * 0.62), f = 2.6
      ctx.clearRect(0, 0, W, H)
      ctx.lineJoin = 'round'
      const P = p => {
        const x1 = p.x * ca - p.z * sa, z1 = p.x * sa + p.z * ca
        const y2 = p.y * ct - z1 * st, z2 = p.y * st + z1 * ct
        const s = f / (f + z2)
        return [cx + x1 * s * R * k, cy + y2 * s * R * k, s, z2]
      }
      for (const p of amb) {
        const [x, y, s, z] = P(p)
        ctx.globalAlpha = p.a * k * (0.6 + 0.4 * (1 - z))
        ctx.fillStyle = p.c
        const r = p.s * s
        ctx.fillRect(x - r, y - r, r * 2, r * 2)
      }
      for (let i = 0; i < N; i++) {
        const p = eps[i]
        const [x, y, s] = P(p)
        proj[i * 3] = x; proj[i * 3 + 1] = y; proj[i * 3 + 2] = s
        const on = i === hover
        ctx.globalAlpha = k
        ctx.strokeStyle = p.c
        ctx.lineWidth = on ? 2.2 : 1.5
        ctx.beginPath(); tri(x, y, p.s * s * (on ? 1.9 : 1), p.rot + el * 0.0003 * p.spin)
        if (on) { ctx.fillStyle = p.c; ctx.fill() }
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      // com o cursor parado, o triângulo se move: refaz a escolha e reposiciona a etiqueta
      if (ptr) {
        const i = pick(ptr.x, ptr.y, ptr.r)
        if (i !== hover) { hover = i; showTip(i) } else if (i >= 0) placeTip(i)
      }
    }
    const loop = now => { if (!running) return; draw(now); raf = requestAnimationFrame(loop) }
    const start = () => { if (running || reduce) return; running = true; raf = requestAnimationFrame(loop) }
    const stop = () => { running = false; cancelAnimationFrame(raf) }

    function pick(mx, my, radius) {
      let best = -1, bd = radius * radius
      for (let i = 0; i < N; i++) {
        const dx = proj[i * 3] - mx, dy = proj[i * 3 + 1] - my, d = dx * dx + dy * dy
        if (d < bd) { bd = d; best = i }
      }
      return best
    }
    function placeTip(i) {
      tip.style.left = clamp(proj[i * 3], 150, Math.max(150, W - 150)) + 'px'
      tip.style.top = Math.max(proj[i * 3 + 1], 90) + 'px'
    }
    function showTip(i) {
      if (i < 0) { tip.hidden = true; cv.classList.remove('is-hover'); return }
      const e = eps[i].e
      tip.innerHTML = `<small style="--tc:${catInk(e.category)}">${fmtDate(e)} · ${esc(catLabel(e.category))}</small>${esc(e.title)}`
      tip.hidden = false
      placeTip(i)
      cv.classList.add('is-hover')
    }
    cv.addEventListener('pointermove', ev => {
      const r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top
      tiltT = ((my / r.height) - 0.5) * 0.25
      const rad = ev.pointerType === 'touch' ? 22 : 14
      ptr = { x: mx, y: my, r: rad }
      const i = pick(mx, my, rad)
      if (i !== hover) { hover = i; showTip(i); if (reduce) draw(performance.now()) }
    })
    cv.addEventListener('pointerleave', () => { ptr = null; hover = -1; showTip(-1); tiltT = 0; if (reduce) draw(performance.now()) })
    cv.addEventListener('click', ev => {
      const r = cv.getBoundingClientRect()
      const i = hover >= 0 ? hover : pick(ev.clientX - r.left, ev.clientY - r.top, 22)
      if (i >= 0) openEvent(eps[i].e.id, D.events)
    })
    new ResizeObserver(resize).observe(cv)
    new IntersectionObserver(en => { en[0].isIntersecting ? start() : stop() }).observe(cv)
    resize()
    return { rebuild(list) { hover = -1; showTip(-1); build(list); draw(performance.now()) } }
  }
  let constellation = null

  // ------------------------------------------------------------------ compartilhar
  const SH = window.Compartilhar
  const LINKS = window.LINKS || { site: 'https://conhecabolsonaro.github.io/', caso: {}, assunto: [], capitulo: [] }
  const SHARE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" class="st"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>'
  const outletsOf = e => [...new Set(e.sources.map(s => String(s.outlet).replace(/\s*\(.*\)\s*/g, '').trim()))]
  const casoUrl = e => LINKS.caso[e.id] ? `${LINKS.site}caso/${LINKS.caso[e.id]}/` : `${LINKS.site}#ficha/${e.id}`
  function casoShare(e) {
    const g = gravOf(e)
    const kicker = g.g === 'grave' && g.r ? g.r : catLabel(e.category)
    const meta = `${fmtDate(e, 'long')} · ${kicker}`
    const a = e.amounts[0]
    return {
      url: casoUrl(e), titulo: e.title, meta, texto: e.summary, fontes: outletsOf(e).slice(0, 3).join(', '), arquivo: LINKS.caso[e.id] || e.id,
      imagem: { kicker: meta, ano: e.year, cor: g.g === 'grave' ? '#c2341a' : catInk(e.category), grande: a ? moneyShort('R$ ', a.value_brl) : '', rotulo: a ? a.label.replace(/\s*\(.*?\)\s*/g, ' ').trim() : '' },
    }
  }
  function siteShare(grande) {
    return {
      url: LINKS.site + (grande ? '?letra=maior' : ''), rotulo: grande ? 'Compartilhar a versão com letra grande' : 'Compartilhar o site',
      titulo: 'Flávio Bolsonaro, episódio por episódio', meta: grande ? 'Versão com letra grande' : '',
      texto: `Rachadinha, dinheiro vivo, milícia, Queiroz e Banco Master: ${D.events.length} episódios em ordem, com as fontes.`,
      convite: 'Antes de votar, conheça:', arquivo: 'conheca-bolsonaro',
      imagem: { kicker: 'Antes de votar, conheça', cor: '#5b34d6', grande: `${D.events.length} episódios`, rotulo: `${D.meta.counts.sources.toLocaleString('pt-BR')} links de fontes · dados até ${updated.short}`, chamada: 'Leia a história completa, com as fontes:' },
    }
  }
  function resumoShare() {
    const cards = (STORY.resumo || []).filter(c => evById.has(c.event))
    return {
      url: LINKS.site + '#resumo', rotulo: 'Compartilhar o resumo',
      titulo: 'Flávio Bolsonaro em 1 minuto', meta: `${cards.length} pontos que pesam contra ele, com as fontes`,
      texto: cards.slice(0, 6).map(c => `${c.grande}: ${c.texto}`).join(' '),
      convite: 'Veja o resumo completo:', arquivo: 'flavio-em-1-minuto',
      imagem: { kicker: 'O resumo', cor: '#c2341a', grande: `${cards.length} pontos`, rotulo: 'que pesam contra Flávio Bolsonaro', chamada: 'Veja o resumo, com as fontes:' },
    }
  }
  function assuntoShare(a) {
    const linhas = a.linhas.filter(l => evById.has(l.event))
    return {
      url: LINKS.assunto.includes(a.id) ? `${LINKS.site}assunto/${a.id}/` : `${LINKS.site}#assunto-${a.id}`,
      titulo: `${a.tema}: ${a.titulo}`, meta: 'Flávio Bolsonaro em 4 assuntos', texto: linhas.map(l => `${l.ano}: ${l.texto}`).join(' '), arquivo: 'assunto-' + a.id,
      imagem: { kicker: a.tema, cor: '#c2341a' },
    }
  }
  function capShare(ch) {
    const e = evById.get(ch.event)
    const big = ch.viz ? finalNum(ch.viz) : ''
    const cap = ch.viz && ch.viz.caption ? ch.viz.caption : ''
    const date = ch.id === (STORY.epilogue || {}).id ? `dados até ${updated.short}` : (e ? fmtDate(e, 'long') : '')
    return {
      url: LINKS.capitulo.includes(ch.id) ? `${LINKS.site}capitulo/${ch.id}/` : `${LINKS.site}#cap-${ch.id}`,
      titulo: big ? `${ch.title}: ${big}` : ch.title, meta: date, texto: ch.hook + (cap ? ' ' + (big ? big + ' ' : '') + cap : ''), arquivo: 'capitulo-' + ch.id,
      imagem: { kicker: date, ano: e && ch.id !== (STORY.epilogue || {}).id ? e.year : '', cor: '#5b34d6', grande: big, rotulo: cap.length > 90 ? cap.slice(0, 88).replace(/\s+\S*$/, '') + '…' : cap },
    }
  }
  function openShare(d) { if (SH) SH.open(d) }
  // botões de compartilhar fora da ficha (cartões, assuntos, cenas, menu, capa, rodapé)
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-sh-ev], [data-sh-site], [data-sh-assunto], [data-sh-cap]')
    if (!b || b.closest('#sheet')) return
    e.preventDefault(); e.stopPropagation()
    if (b.dataset.shEv) { const ev = evById.get(b.dataset.shEv); if (ev) openShare(casoShare(ev)) }
    else if (b.dataset.shSite === 'resumo') openShare(resumoShare())
    else if ('shSite' in b.dataset) openShare(siteShare(b.dataset.shSite === 'grande'))
    else if (b.dataset.shAssunto) { const a = (STORY.assuntos || []).find(x => x.id === b.dataset.shAssunto); if (a) openShare(assuntoShare(a)) }
    else if (b.dataset.shCap) { const sc = SCENES.find(x => x.ch.id === b.dataset.shCap); const ch = sc ? sc.ch : [...STORY.chapters, STORY.epilogue].find(x => x && x.id === b.dataset.shCap); if (ch) openShare(capShare(ch)) }
  }, true)

  // ------------------------------------------------------------------ a história (linha do tempo)
  function erasFor(y) { return (D.eras || []).filter(r => y >= r.from && y <= r.to).map(r => r.label) }
  const sceneDate = ch => { const e = evById.get(ch.event); return e ? fmtDate(e) : '' }

  // valor final de cada cena, no mesmo formato em que o contador termina
  function moneyShort(prefix, v) {
    if (v >= 1e6) return `${prefix}${(v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ${v < 2e6 ? 'milhão' : 'milhões'}`
    return prefix + Math.round(v).toLocaleString('pt-BR')
  }
  function fmtCounter(v, val, final) {
    if (v.format === 'brl') return final ? moneyShort('R$ ', v.value) : 'R$ ' + Math.round(val).toLocaleString('pt-BR')
    if (v.format === 'usd') return final ? moneyShort('US$ ', v.value) : 'US$ ' + Math.round(val).toLocaleString('pt-BR')
    if (v.format === 'pct') return Math.round(val) + '%'
    return Math.round(val).toLocaleString('pt-BR')
  }
  function finalNum(v) {
    if (v.type === 'counter') return fmtCounter(v, v.value, true) + (v.format === 'years' ? ` anos ${v.suffix || ''}` : '')
    if (v.type === 'tiles') return 'R$ ' + (v.count * v.unit).toLocaleString('pt-BR')
    if (v.type === 'grid') return `${v.highlight} de ${v.total}`
    return ''
  }
  function goHTML(ch) {
    const ids = [ch.event, ...(ch.also || [])].filter(id => id && evById.has(id))
    const share = `<button class="btn-share ghost" type="button" data-sh-cap="${esc(ch.id)}">${SHARE_SVG}<span>Compartilhar</span></button>`
    if (!ids.length) return `<div class="scene-go">${share}</div>`
    const [main, ...rest] = ids
    return `<div class="scene-go"><button class="link-ghost" type="button" data-open="${esc(main)}">Abrir a ficha →</button>${rest.map(id => `<button class="link-ghost sm" type="button" data-open="${esc(id)}">Ver também: ${esc(fmtDate(evById.get(id)))}</button>`).join('')}${share}</div>`
  }
  function vizHTML(ch) {
    const v = ch.viz || { type: 'words' }
    if (v.type === 'words') return ''
    const sr = `<span class="sr-only">${esc(finalNum(v))} </span>`
    if (v.type === 'counter') {
      const zero = v.format === 'brl' ? 'R$ 0' : v.format === 'usd' ? 'US$ 0' : v.format === 'pct' ? '0%' : '0'
      const suffix = v.format === 'years' ? `<small>anos ${esc(v.suffix || '')}</small>` : ''
      return `<div class="viz"><div class="viz-num" aria-hidden="true"><span data-num>${zero}</span>${suffix}</div><p class="viz-cap">${sr}${esc(v.caption)}</p>${goHTML(ch)}</div>`
    }
    if (v.type === 'tiles') {
      return `<div class="viz viz-tiles"><div class="tiles" aria-hidden="true">${`<i class="tile">${esc(v.unitLabel)}</i>`.repeat(v.count)}</div><div class="viz-num" aria-hidden="true"><span data-num>R$ 0</span></div><p class="viz-cap">${sr}${esc(v.caption)}</p>${goHTML(ch)}</div>`
    }
    if (v.type === 'grid') {
      return `<div class="viz viz-grid"><div class="dots" aria-hidden="true">${'<i class="dot-h"></i>'.repeat(v.total)}</div><div class="viz-num" aria-hidden="true"><span data-num>0</span><small>de ${v.total}</small></div><p class="viz-cap">${sr}${esc(v.caption)}</p>${v.quote ? `<p class="viz-quote">${esc(v.quote)}</p>` : ''}${goHTML(ch)}</div>`
    }
    if (v.type === 'versus') {
      const pct = x => x.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '%'
      const row = (r, cls) => `<div class="vs-row ${cls}"><p><span>${esc(r.label)}</span><b data-vs="${r.value}" aria-hidden="true">0,00%</b><span class="sr-only">${pct(r.value)}</span></p><div class="vs-bar" aria-hidden="true"><i></i></div></div>`
      return `<div class="viz"><div class="versus">${row(v.a, 'a')}${row(v.b, 'b')}</div><p class="viz-cap">${esc(v.caption)}</p>${goHTML(ch)}</div>`
    }
    return ''
  }
  function sceneHTML(ch, isEpilogue) {
    const v = ch.viz || { type: 'words' }
    const words = ch.hook.split(/\s+/).map(w => `<span class="w">${esc(w)}</span>`).join(' ')
    const date = isEpilogue ? `dados até ${updated.short}` : sceneDate(ch)
    const ev = evById.get(ch.event)
    const bg = isEpilogue ? '2º' : (ev ? String(ev.year) : '')
    const wordsOnly = v.type === 'words'
    return `<section class="scene${wordsOnly ? ' words-only' : ''}" data-scene="${esc(ch.id)}" id="cap-${esc(ch.id)}" aria-label="${esc(ch.n)}: ${esc(ch.title)}">
      <div class="scene-pin">
        <span class="scene-bg" aria-hidden="true">${esc(bg)}</span>
        <div class="scene-inner">
          <div class="scene-text">
            <p class="scene-kicker"><span>${esc(ch.n)}</span><i>${esc(date)}</i></p>
            <h3 class="scene-title">${esc(ch.title)}</h3>
            <p class="scene-hook"><span class="sr-only">${esc(ch.hook)}</span><span aria-hidden="true">${words}</span></p>
            ${wordsOnly ? goHTML(ch) : ''}
          </div>
          ${vizHTML(ch)}
        </div>
      </div>
    </section>`
  }
  function miniHTML(e) {
    const g = gravOf(e)
    return `<article class="ep ep-mini${g.g === 'grave' ? ' is-grave' : ''}${isStar(e) ? ' is-star' : ''}" id="ep-${esc(e.id)}" data-open="${esc(e.id)}" style="--c:${catColor(e.category)};--ci:${catInk(e.category)}">
      <span class="ep-dot" aria-hidden="true"></span>
      <div class="ep-body"><p class="mini"><time datetime="${esc(e.date)}">${fmtDate(e)}</time><a class="ep-link" href="#ficha/${esc(e.id)}">${hl(e.title)}</a>${g.g === 'grave' && g.r ? `<span class="crime sm">${esc(g.r)}</span>` : ''}</p></div>
    </article>`
  }
  function epHTML(e) {
    const g = gravOf(e)
    if (!isStar(e) || g.g === 'menor') return miniHTML(e)
    const grave = g.g === 'grave'
    const [kl, kc] = kind(e.kind)
    const vid = e.videos[0], img = e.images[0]
    const showMedia = (grave || e.importance === 3) && (vid || img)
    const media = !showMedia ? '' : vid
      ? `<figure class="ep-media is-video" aria-hidden="true"><img src="https://i.ytimg.com/vi/${esc(vid.youtube_id)}/hqdefault.jpg" alt="" loading="lazy"></figure>`
      : `<figure class="ep-media"><img src="${esc(img.url)}" alt="${esc(img.caption)}" loading="lazy" referrerpolicy="no-referrer"></figure>`
    const amts = e.amounts.slice(0, 2).map(a => `<span class="amt"><b>${fmtBRL(a.value_brl)}</b>${esc(a.label)}</span>`).join('')
    const shown = e.people.slice(0, 4)
    const names = e.people.slice(0, 2).map(displayName).join(', ') + (e.people.length > 2 ? ` +${e.people.length - 2}` : '')
    return `<article class="ep imp-${e.importance}${grave ? ' ep-grave' : ''}${showMedia ? ' has-media' : ''}" id="ep-${esc(e.id)}" data-open="${esc(e.id)}" style="--c:${catColor(e.category)};--ci:${catInk(e.category)}">
      <span class="ep-dot" aria-hidden="true"></span>
      <div class="ep-body">
        <div class="ep-meta"><time datetime="${esc(e.date)}">${fmtDate(e)}</time><span class="pill">${esc(catLabel(e.category))}</span><span class="kind" style="--k:${kc}"><i></i>${kl}</span>${grave ? `<span class="crime">${esc(g.r || 'Caso grave')}</span>` : ''}</div>
        <h4 class="ep-title"><a class="ep-link" href="#ficha/${esc(e.id)}">${hl(e.title)}</a></h4>
        <p class="ep-sum">${hl(e.summary)}</p>
        ${amts ? `<div class="ep-amounts">${amts}</div>` : ''}
        <div class="ep-foot">${shown.length ? `<span class="avs" aria-hidden="true">${shown.map(k => avatar(k)).join('')}</span><span>${esc(names)}</span>` : ''}<span>${e.sources.length} fonte${e.sources.length === 1 ? '' : 's'}${e.videos.length ? ` · ${e.videos.length} vídeo${e.videos.length === 1 ? '' : 's'}` : ''}</span><button class="ep-share" type="button" data-sh-ev="${esc(e.id)}" aria-label="Compartilhar: ${esc(e.title)}">${SHARE_SVG}</button><span class="ep-go" aria-hidden="true">Ficha <span>→</span></span></div>
      </div>
      ${media}
    </article>`
  }
  // um ano pode ser cortado por cenas: o 1º trecho leva a âncora #ano-AAAA, os demais são continuação
  function listHTML(evs) {
    const grouping = !isFiltering() && !state.milestones
    const groupable = e => grouping && !isGrave(e) && (!isStar(e) || gravOf(e).g === 'menor')
    let out = '', run = []
    const flushRun = () => {
      if (run.length >= 2) out += `<details class="ctx"><summary><span>+${run.length} episódios de contexto</span></summary>${run.map(epHTML).join('')}</details>`
      else out += run.map(epHTML).join('')
      run = []
    }
    for (const e of evs) { if (groupable(e)) run.push(e); else { flushRun(); out += epHTML(e) } }
    flushRun()
    return out
  }
  function yearHTML(year, evs, opts) {
    const eras = erasFor(year)
    const total = opts.total
    const compact = !evs.some(e => isStar(e) && gravOf(e).g !== 'menor')
    return `<section class="yr${opts.first ? ' first' : ''}${opts.cont ? ' cont' : ''}${compact ? ' yr-compact' : ''}"${opts.cont ? '' : ` id="ano-${year}"`} data-year="${year}">
      <div class="yr-side">
        <h3 class="yr-num" aria-label="${year}">${[...String(year)].map(d => `<span class="d" aria-hidden="true"><span>${d}</span></span>`).join('')}</h3>
        <p class="yr-meta"><b>${total} episódio${total === 1 ? '' : 's'}</b>${eras.map(r => `<span>${esc(r)}</span>`).join('')}</p>
      </div>
      <div class="yr-list"><span class="yr-prog" aria-hidden="true"></span>${listHTML(evs)}</div>
    </section>`
  }

  function renderTimeline() {
    const tl = timelineEl
    if (!filtered.length) {
      tl.innerHTML = '<div class="empty"><b>Nada encontrado</b>Tente outro termo ou <button class="link-ghost" type="button" id="emptyReset">limpe os filtros</button>.</div>'
      $('#emptyReset').addEventListener('click', () => resetFilters())
      setupTimeline(); renderYears()
      return
    }
    const story = !isFiltering()
    const yearTotals = new Map()
    filtered.forEach(e => yearTotals.set(e.year, (yearTotals.get(e.year) || 0) + 1))
    let html = '', block = [], blockYear = null, firstAfterBreak = true, seen = new Set(), si = 0, pendingMini = null
    const ANTES = 2003
    let list = filtered
    if (story) {
      const antes = filtered.filter(e => e.year < ANTES)
      if (antes.length) {
        const byYear = new Map()
        antes.forEach(e => { if (!byYear.has(e.year)) byYear.set(e.year, []); byYear.get(e.year).push(e) })
        const inner = [...byYear].map(([y, evs]) => yearHTML(y, evs, { first: false, cont: false, total: evs.length })).join('')
        html += `<details class="antes" id="antes"><summary><b>Antes de Flávio</b><span>${antes[0].year}–${ANTES - 1} · ${antes.length} episódio${antes.length === 1 ? '' : 's'}</span></summary>${inner}</details>`
        while (si < SCENES.length && SCENES[si].sort < String(ANTES)) si++
      }
      list = filtered.filter(e => e.year >= ANTES)
    }

    const flush = () => {
      if (!block.length) return
      html += yearHTML(blockYear, block, { first: firstAfterBreak, cont: seen.has(blockYear), total: yearTotals.get(blockYear) })
      seen.add(blockYear); block = []; firstAfterBreak = false
    }
    for (const e of list) {
      // cenas cuja data já chegou entram antes deste episódio (e antes de outros da mesma data)
      while (si < SCENES.length && SCENES[si].sort <= e.sort) {
        flush()
        const sc = SCENES[si++]
        if (story) { html += sceneHTML(sc.ch, sc.epi); firstAfterBreak = true }
        else pendingMini = sc.ch
      }
      if (pendingMini) {
        flush()
        html += `<div class="chapter-mini"><span>${esc(pendingMini.n)}</span><h3>${esc(pendingMini.title)}</h3></div>`
        pendingMini = null; firstAfterBreak = true
      }
      if (e.year !== blockYear) { flush(); blockYear = e.year }
      block.push(e)
    }
    flush()
    if (story) while (si < SCENES.length) { const sc = SCENES[si++]; html += sceneHTML(sc.ch, sc.epi) }
    tl.innerHTML = html
    setupTimeline()
    renderYears()
  }

  // ------------------------------------------------------------------ motor da rolagem
  let scenes = [], yrs = [], epObs, yrObs, sceneObs, activeYear = null, activeMonth = null
  const timelineEl = $('#timeline')

  function setupTimeline() {
    ;[epObs, yrObs, sceneObs].forEach(o => o && o.disconnect())
    const all = SCENES.map(s => s.ch)
    scenes = $$('.scene', timelineEl).map(el => {
      const ch = all.find(c => c.id === el.dataset.scene)
      const s = {
        el, ch, words: $$('.w', el), on: 0, num: $('[data-num]', el), tiles: $$('.tile', el), dots: $$('.dot-h', el),
        bars: $$('.vs-bar i', el), vs: $$('[data-vs]', el), p: -1, k: -1, t: -1, tall: false,
        hookEl: $('.scene-hook', el), vizEl: $('.tiles, .dots, .viz-num, .versus', el), playedWords: false, playedViz: false,
      }
      if (s.dots.length) {
        // ordem em que os itens acendem: embaralhada, mas sempre a mesma
        let seed = 51; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
        s.order = s.dots.map((_, i) => i).sort(() => rnd() - 0.5)
      }
      return s
    })
    yrs = $$('.yr', timelineEl).map(el => ({ el, year: +el.dataset.year, list: $('.yr-list', el), prog: $('.yr-prog', el), items: [], p: -1, lit: -1, lt: 0 }))
    cacheOffsets()

    if (reduce || !('IntersectionObserver' in window)) {
      $$('.ep, .yr', timelineEl).forEach(el => el.classList.add('in'))
      scenes.forEach(s => applyScene(s, 1))
    } else {
      epObs = new IntersectionObserver(en => en.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); epObs.unobserve(x.target) } }), { rootMargin: '0px 0px -10% 0px' })
      $$('.ep', timelineEl).forEach(el => epObs.observe(el))
      yrObs = new IntersectionObserver(en => en.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); yrObs.unobserve(x.target) } }), { rootMargin: '0px 0px -15% 0px' })
      $$('.yr', timelineEl).forEach(el => yrObs.observe(el))
      // celular (ou tela baixa demais para prender a cena): texto e número tocam cada um quando aparecem
      sceneObs = new IntersectionObserver(en => en.forEach(x => {
        if (!x.isIntersecting) return
        const s = x.target._scene
        if (!s || !(isMobile() || s.tall)) return
        if (x.target === s.hookEl && !s.playedWords) {
          s.playedWords = true
          tween(isMobile() ? 520 : 900, k => applyWords(s, k), s.vizEl ? null : () => s.el.classList.add('done'))
        }
        if (x.target === s.vizEl && !s.playedViz) {
          s.playedViz = true
          tween(isMobile() ? 950 : 1300, k => applyViz(s, ease(k)), () => s.el.classList.add('done'))
        }
      }), { threshold: 0.9, rootMargin: '0px 0px -12% 0px' })
      scenes.forEach(s => [s.hookEl, s.vizEl].forEach(t => { if (t) { t._scene = s; sceneObs.observe(t) } }))
    }
    activeYear = null; activeMonth = null
    onScroll()
  }
  function cacheOffsets() {
    yrs.forEach(y => { y.items = $$('.ep', y.el).filter(it => !it.closest('details:not([open])')); y.lit = -1; y.lt = y.prog.offsetTop; y.items.forEach(it => { it._off = it.offsetTop + (it.classList.contains('ep-mini') ? 18 : isMobile() ? 30 : 34) }) })
    // cena mais alta que a tela não é presa: anima quando aparece, como no celular
    scenes.forEach(s => {
      const inner = $('.scene-inner', s.el)
      s.tall = !isMobile() && !reduce && inner.offsetHeight - 80 > window.innerHeight
      s.el.classList.toggle('is-tall', s.tall)
    })
  }
  function tween(dur, fn, end) {
    const t0 = performance.now()
    const st = t => { const k = clamp((t - t0) / dur); fn(k); if (k < 1) requestAnimationFrame(st); else if (end) end() }
    requestAnimationFrame(st)
  }

  function applyWords(s, wp) {
    const on = Math.round(clamp(wp) * s.words.length)
    if (on === s.on) return
    const [a, b] = on > s.on ? [s.on, on] : [on, s.on]
    for (let i = a; i < b; i++) s.words[i].classList.toggle('on', i < on)
    s.on = on
  }
  function applyViz(s, t) {
    const v = (s.ch && s.ch.viz) || { type: 'words' }
    if (v.type === 'words' || t === s.t) return
    s.t = t
    if (v.type === 'counter' && s.num) {
      s.num.textContent = fmtCounter(v, v.value * t, t >= 1)
    } else if (v.type === 'tiles') {
      const k = Math.round(t * v.count)
      if (k !== s.k) { s.tiles.forEach((el, i) => el.classList.toggle('on', i < k)); s.k = k }
      if (s.num) s.num.textContent = 'R$ ' + (k * v.unit).toLocaleString('pt-BR')
    } else if (v.type === 'grid') {
      const k = Math.round(t * v.highlight)
      if (k !== s.k) { const lit = new Set(s.order.slice(0, k)); s.dots.forEach((el, i) => el.classList.toggle('on', lit.has(i))); s.k = k }
      if (s.num) s.num.textContent = String(k)
    } else if (v.type === 'versus') {
      const vals = [v.a.value, v.b.value]
      s.bars.forEach((b, i) => { b.style.width = (vals[i] * t) + '%' })
      s.vs.forEach((el, i) => { el.textContent = (vals[i] * t).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%' })
    }
  }
  function applyScene(s, p) {
    if (Math.abs(p - s.p) < 0.0004) return
    s.p = p
    const wordsOnly = !s.vizEl
    applyWords(s, p / (wordsOnly ? 0.62 : 0.4))
    if (!wordsOnly) applyViz(s, ease(clamp((p - 0.34) / 0.48)))
    s.el.classList.toggle('done', p > (wordsOnly ? 0.7 : 0.84))
  }

  let ticking = false
  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => { ticking = false; update() })
  }
  const heroEl = $('.hero')
  function update() {
    const vh = window.innerHeight
    $('#nav').classList.toggle('scrolled', window.scrollY > 8)
    document.body.classList.toggle('past-hero', window.scrollY > (heroEl ? heroEl.offsetHeight : vh) * 0.6)

    // cenas presas (desktop): a rolagem conduz a revelação
    let inScene = false
    if (!isMobile() && !reduce) {
      for (const s of scenes) {
        if (s.tall) continue
        const r = s.el.getBoundingClientRect()
        if (r.bottom < 0) { if (s.p !== 1) applyScene(s, 1); continue }
        if (r.top > vh) { if (s.p !== 0) applyScene(s, 0); continue }
        applyScene(s, clamp(-r.top / Math.max(1, r.height - vh)))
        if (r.top <= 2 && r.bottom >= vh - 2) inScene = true
      }
    }
    document.body.classList.toggle('in-scene', inScene)

    // o traço avança e cada ponto acende quando é alcançado
    const anchor = vh * (isMobile() ? 0.74 : 0.62)
    let current = null, litTotal = 0, lastLit = null
    for (const y of yrs) {
      const r = y.list.getBoundingClientRect()
      const top = r.top + y.lt, h = Math.max(1, r.height - y.lt)
      const p = clamp((anchor - top) / h)
      if (p !== y.p) { y.prog.style.transform = `scaleY(${p.toFixed(4)})`; y.p = p }
      let lit = 0
      if (p >= 1) lit = y.items.length
      else if (p > 0) { for (const it of y.items) { if (r.top + it._off < anchor) lit++; else break } }
      if (lit !== y.lit) { y.items.forEach((it, i) => it.classList.toggle('lit', i < lit)); y.lit = lit }
      litTotal += lit
      if (lit) lastLit = y.items[lit - 1]
      if (r.top - 70 < anchor) current = y
    }
    const tr = timelineEl.getBoundingClientRect()
    document.body.classList.toggle('in-timeline', tr.top < vh * 0.4 && tr.bottom > vh * 0.6 && yrs.length > 0)
    if (current) {
      const t = lastLit && $('time', lastLit)
      const m = t ? String(t.getAttribute('datetime')).match(/^\d{4}-(\d{2})/) : null
      const label = m && t.getAttribute('datetime').slice(0, 4) === String(current.year) ? `${MONTHS[+m[1] - 1]} ${current.year}` : String(current.year)
      if (label !== activeMonth) { $('#ppYear').textContent = label; activeMonth = label }
      $('#ppCount').textContent = isMobile() ? `${litTotal}/${filtered.length}` : `${litTotal} de ${filtered.length} episódios`
      if (current.year !== activeYear) {
        activeYear = current.year
        const bar = $('#years')
        $$('button', bar).forEach(b => b.classList.toggle('is-active', +b.dataset.year === activeYear))
        const act = $(`button[data-year="${activeYear}"]`, bar)
        if (act) bar.scrollTo({ left: act.offsetLeft - bar.clientWidth / 2 + act.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' })
      }
    }
    // a barra chamada pela pílula (celular) some quando a leitura continua
    if (document.body.classList.contains('tb-summoned') && Math.abs(window.scrollY - summonY) > 160) document.body.classList.remove('tb-summoned')
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', () => { measureToolbar(); cacheOffsets(); onScroll() })
  if ('ResizeObserver' in window) new ResizeObserver(() => { cacheOffsets(); onScroll() }).observe(timelineEl)
  // abrir "+N episódios" ou "Antes de Flávio" muda a lista visível
  timelineEl.addEventListener('toggle', () => { cacheOffsets(); onScroll() }, true)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { cacheOffsets(); onScroll() })
  // ao cruzar o limite do celular no meio de uma cena, ela é observada de novo e termina de tocar
  mqMobile.addEventListener('change', () => {
    cacheOffsets()
    if (sceneObs) scenes.forEach(s => [s.hookEl, s.vizEl].forEach(t => { if (t) { sceneObs.unobserve(t); sceneObs.observe(t) } }))
    onScroll()
  })

  function measureToolbar() {
    const tb = $('#toolbar')
    if (tb) document.documentElement.style.setProperty('--tb-h', tb.offsetHeight + 'px')
  }
  const navH = () => $('#nav').offsetHeight
  // no celular a barra de filtros não fica presa no topo
  const tbOff = () => isMobile() ? 0 : $('#toolbar').offsetHeight
  function scrollToStoryStart() {
    document.body.classList.remove('tb-summoned')
    const top = isMobile() ? $('#toolbar').getBoundingClientRect().top + window.scrollY - navH() - 8
      : timelineEl.getBoundingClientRect().top + window.scrollY - navH() - tbOff()
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'auto' })
  }
  function goTo(el, extra = 0) {
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - navH() - tbOff() + extra
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }
  // "Começar": cai direto na primeira cena, sem passar pela barra de filtros
  function startStory() {
    const s = $('.scene', timelineEl)
    if (!s) return goTo($('#historia'))
    const top = s.getBoundingClientRect().top + window.scrollY + ((isMobile() || reduce || s.classList.contains('is-tall')) ? -navH() : 2)
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }

  // ------------------------------------------------------------------ barra de filtros
  let summonY = 0
  function renderYears() {
    const counts = new Map()
    filtered.forEach(e => counts.set(e.year, (counts.get(e.year) || 0) + 1))
    const all = [...new Set(BASE.map(e => e.year))].sort((a, b) => a - b)
    $('#years').innerHTML = all.map(y => `<button type="button" data-year="${y}" ${counts.get(y) ? '' : 'disabled'} aria-label="${y}: ${counts.get(y) || 0} episódios">${y}</button>`).join('')
  }
  function renderFilterControls() {
    const ppl = D.people.filter(p => vc(p.key) > 0 && (p.profile || vc(p.key) >= 4)).sort((a, b) => {
      const ia = KEY_PEOPLE.indexOf(a.key), ib = KEY_PEOPLE.indexOf(b.key)
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
      return vc(b.key) - vc(a.key)
    })
    $('#personChips').innerHTML = ppl.map(p => `<button class="chip${p.portrait ? '' : ' no-av'}" type="button" data-person="${esc(p.key)}" aria-pressed="false">${p.portrait ? avatar(p.key, 'chip-av') : ''}${esc(displayName(p.key))} <span class="n">${vc(p.key)}</span></button>`).join('')
    const catCount = {}
    BASE.forEach(e => { catCount[e.category] = (catCount[e.category] || 0) + 1 })
    $('#catChips').innerHTML = Object.keys(D.categories).filter(c => catCount[c]).map(c => `<button class="chip no-av" type="button" data-cat="${c}" aria-pressed="false" style="--c:${catColor(c)}"><span class="sw"></span>${esc(catLabel(c))} <span class="n">${catCount[c]}</span></button>`).join('')
  }
  function syncControls() {
    $$('[data-person]', $('#personChips')).forEach(b => b.setAttribute('aria-pressed', state.persons.has(b.dataset.person)))
    $$('[data-cat]', $('#catChips')).forEach(b => b.setAttribute('aria-pressed', state.cats.has(b.dataset.cat)))
    $('#peopleN').textContent = state.persons.size || ''
    $('#themesN').textContent = state.cats.size || ''
    // só reescreve a caixa quando a mudança veio de fora dela (não apaga o espaço enquanto se digita)
    const qi = $('#q')
    if (qi.value.trim() !== state.q) qi.value = state.q
    $('#resultCount').innerHTML = `<b>${filtered.length}</b> de ${BASE.length} episódios`
  }
  function renderActiveFilters() {
    const parts = []
    state.persons.forEach(k => parts.push(`<button type="button" data-rm-person="${esc(k)}">${esc(displayName(k))}</button>`))
    state.cats.forEach(c => parts.push(`<button type="button" data-rm-cat="${esc(c)}">${esc(catLabel(c))}</button>`))
    if (state.milestones) parts.push('<button type="button" data-rm-milestones>Só os graves</button>')
    if (state.terms.length) parts.push(`<button type="button" data-rm-q>“${esc(state.q)}”</button>`)
    $('#activeFilters').innerHTML = parts.length ? `<span>Mostrando:</span> ${parts.join('')} <button type="button" data-rm-all>Limpar tudo</button>` : ''
  }
  function resetFilters() {
    state.q = ''; state.persons.clear(); state.cats.clear(); state.milestones = false
    applyFilters({ scroll: true })
  }
  function togglePop(which) {
    ;[['peopleBtn', 'peoplePop'], ['themesBtn', 'themesPop']].forEach(([b, p]) => {
      const open = p === which && $('#' + p).hidden
      $('#' + p).hidden = !open
      $('#' + b).setAttribute('aria-expanded', open)
    })
    measureToolbar()
  }
  function bindFilters() {
    let t, lastTerms = ''
    $('#q').addEventListener('input', e => {
      clearTimeout(t)
      t = setTimeout(() => {
        state.q = e.target.value.trim()
        const terms = norm(state.q).split(/\s+/).filter(x => x.length > 1).join(' ')
        if (terms === lastTerms) { writeUrl(); return }   // uma letra solta não refaz a página
        lastTerms = terms
        applyFilters({ scroll: true })
      }, 180)
    })
    $('#peopleBtn').addEventListener('click', () => togglePop('peoplePop'))
    $('#themesBtn').addEventListener('click', () => togglePop('themesPop'))
    $('#personChips').addEventListener('click', e => {
      const b = e.target.closest('[data-person]'); if (!b) return
      const k = b.dataset.person
      state.persons.has(k) ? state.persons.delete(k) : state.persons.add(k)
      applyFilters({ scroll: true })
    })
    $('#catChips').addEventListener('click', e => {
      const b = e.target.closest('[data-cat]'); if (!b) return
      const c = b.dataset.cat
      state.cats.has(c) ? state.cats.delete(c) : state.cats.add(c)
      applyFilters({ scroll: true })
    })
    $('#activeFilters').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return
      if ('rmAll' in b.dataset) return resetFilters()
      if (b.dataset.rmPerson) state.persons.delete(b.dataset.rmPerson)
      if (b.dataset.rmCat) state.cats.delete(b.dataset.rmCat)
      if ('rmMilestones' in b.dataset) state.milestones = false
      if ('rmQ' in b.dataset) state.q = ''
      applyFilters({ scroll: true })
    })
    $('#years').addEventListener('click', e => {
      const b = e.target.closest('[data-year]'); if (!b || b.disabled) return
      document.body.classList.remove('tb-summoned')
      const t = $('#ano-' + b.dataset.year), d = t && t.closest('details')
      if (d && !d.open) { d.open = true; cacheOffsets() }
      goTo(t, 8)
    })
    // o caminho do clique é lido no início: remover um filtro não fecha o painel aberto
    document.addEventListener('click', e => {
      if (!e.composedPath().includes($('#toolbar'))) {
        if (!$('#peoplePop').hidden || !$('#themesPop').hidden) togglePop(null)
        if (document.body.classList.contains('tb-summoned') && !e.composedPath().includes($('#progressPill'))) document.body.classList.remove('tb-summoned')
      }
    })
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$('#sheet').open) { togglePop(null); document.body.classList.remove('tb-summoned') }
      if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName) && !$('#sheet').open) { e.preventDefault(); goTo($('#historia')); setTimeout(() => $('#q').focus({ preventScroll: true }), 300) }
    })
    $$('[data-start]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); startStory() }))
    $('#progressPill').addEventListener('click', () => {
      if (isMobile()) {
        // no celular a barra vem até o leitor, sem tirar ele do lugar
        const on = document.body.classList.toggle('tb-summoned')
        summonY = window.scrollY
        if (on) measureToolbar()
        return
      }
      const r = $('#toolbar').getBoundingClientRect()
      if (r.top <= navH() + 1 && r.bottom > 0) { $('#q').focus({ preventScroll: true }); return }
      window.scrollTo({ top: r.top + window.scrollY - navH() - 12, behavior: reduce ? 'auto' : 'smooth' })
    })
  }
  function filterByPerson(k) {
    state.persons.clear(); state.cats.clear(); state.q = ''; state.milestones = false
    state.persons.add(k)
    applyFilters()
    goTo($('#timeline'))
  }

  // ------------------------------------------------------------------ cliques que abrem fichas
  document.addEventListener('click', e => {
    const yt = e.target.closest('.yt button'); if (yt) { e.stopPropagation(); playYt(yt.closest('.yt')); return }
    if (e.target.closest('#sheet')) return
    const o = e.target.closest('[data-open]')
    if (o) {
      if (e.target.closest('a.ep-link')) e.preventDefault()
      const list = timelineEl.contains(o) && o.classList.contains('ep') ? filtered
        : o.closest('#resumoTrack') ? resumoCards().map(c => evById.get(c.event))
        : o.closest('#faixa') ? D.events.filter(e => isStar(e) && isGrave(e)) : D.events
      openEvent(o.dataset.open, list)
    }
  })

  // ------------------------------------------------------------------ ficha
  const sheet = $('#sheet')
  let sheetList = [], sheetIdx = -1
  function ytLite(v) {
    return `<div class="yt" data-yt="${esc(v.youtube_id)}"><img src="https://i.ytimg.com/vi/${esc(v.youtube_id)}/hqdefault.jpg" alt="" loading="lazy"><button type="button" aria-label="Assistir: ${esc(v.title)}"><span></span></button></div>`
  }
  function playYt(el) {
    el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(el.dataset.yt)}?autoplay=1&rel=0" title="Vídeo do YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  }
  function related(e) {
    return BASE.filter(x => x.id !== e.id).map(x => {
      const shared = x.people.filter(p => e.people.includes(p) && p !== 'flavio' && p !== 'jair').length
      return [shared * 2 + (x.category === e.category ? 2 : 0) + (x.topic === e.topic ? 1 : 0) - Math.abs(x.year - e.year) * 0.15 + x.importance * 0.3, x]
    }).sort((a, b) => b[0] - a[0]).slice(0, 5).map(([, x]) => x)
  }
  function openEvent(id, list) {
    const e = evById.get(id); if (!e) return
    const keepNav = sheet.open && document.activeElement && document.activeElement.closest && document.activeElement.closest('#sheet [data-nav]')
    const keepDir = keepNav ? keepNav.dataset.nav : null
    sheetList = list && list.includes(e) ? list : D.events
    sheetIdx = sheetList.indexOf(e)
    const [kl, kc] = kind(e.kind)
    const media = []
    if (e.videos[0]) media.push(`<div>${ytLite(e.videos[0])}<p class="vcap">${esc(e.videos[0].channel)} · ${esc(e.videos[0].title)}</p></div>`)
    e.images.slice(0, e.videos[0] ? 1 : 2).forEach(img => media.push(`<figure><img src="${esc(img.url)}" alt="${esc(img.caption)}" loading="lazy" referrerpolicy="no-referrer"><figcaption>${esc(img.caption)}${img.credit ? ` — Foto: ${esc(stripTags(img.credit))}` : ''}${img.license ? ` (${esc(img.license)})` : ''}${img.source_page ? ` · <a href="${esc(img.source_page)}" target="_blank" rel="noopener">origem</a>` : ''}</figcaption></figure>`))
    const facts = []
    if (e.status) facts.push(`<dt>Situação atual<small>até ${updated.short}</small></dt><dd class="status">${esc(e.status)}</dd>`)
    if (e.defense) facts.push(`<dt>O que dizem os citados</dt><dd>${esc(e.defense)}</dd>`)
    if (e.amounts.length) facts.push(`<dt>Valores citados</dt><dd><ul class="amounts">${e.amounts.map(a => `<li><b>${fmtBRL(a.value_brl)}</b><span>${esc(a.label)}</span></li>`).join('')}</ul></dd>`)
    if (e.people.length) facts.push(`<dt>Pessoas</dt><dd><div class="s-people">${e.people.map(k => { const p = people.get(k) || { name: k }; return `<button class="chip${p.portrait ? '' : ' no-av'}" type="button" data-sheet-person="${esc(k)}" title="${esc(p.name)}: ver todos os episódios">${p.portrait ? avatar(k, 'chip-av') : ''}${esc(displayName(k))}</button>` }).join('')}</div></dd>`)
    facts.push(`<dt>Fontes (${e.sources.length})</dt><dd><ol class="sources">${e.sources.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a><small>${esc(s.outlet)}${s.date ? ' · ' + esc(fmtSourceDate(s.date)) : ''}</small></li>`).join('')}</ol></dd>`)
    if (e.videos.length > 1) facts.push(`<dt>Mais vídeos</dt><dd><div class="s-media">${e.videos.slice(1).map(v => `<div>${ytLite(v)}<p class="vcap">${esc(v.channel)} · ${esc(v.title)}</p></div>`).join('')}</div></dd>`)
    const rel = related(e)
    if (rel.length) facts.push(`<dt>Relacionados</dt><dd><div class="s-related">${rel.map(x => `<button class="related" type="button" data-goto="${esc(x.id)}"><small>${fmtDate(x)}</small><span>${esc(x.title)}</span></button>`).join('')}</div></dd>`)
    $('#sheetInner').innerHTML = `
      <div class="sheet-top">
        <span class="crumb">Ficha ${e._n} de ${D.events.length} · ${esc(catLabel(e.category))}</span>
        <button class="icon-btn" type="button" data-nav="-1" aria-label="Episódio anterior" ${sheetIdx <= 0 ? 'disabled' : ''}>←</button>
        <button class="icon-btn" type="button" data-nav="1" aria-label="Próximo episódio" ${sheetIdx >= sheetList.length - 1 ? 'disabled' : ''}>→</button>
        <button class="icon-btn sh-top" type="button" data-sh-ev="${esc(e.id)}">${SHARE_SVG}<span>Compartilhar</span></button>
        <button class="icon-btn" type="button" data-close aria-label="Fechar">✕</button>
      </div>
      <article class="sheet-body">
        <div class="s-meta" style="--c:${catColor(e.category)};--ci:${catInk(e.category)}">
          <time datetime="${esc(e.date)}">${fmtDate(e, 'long')}</time><span class="pill">${esc(catLabel(e.category))}</span><span class="kind" style="--k:${kc}"><i></i>${kl}</span>${e.importance === 3 ? '<span class="marco">Marco</span>' : ''}
        </div>
        <h2 class="s-title" id="sheetTitle" tabindex="-1">${esc(e.title)}</h2>
        <p class="s-lead">${esc(e.summary)}</p>
        ${SH ? `<div class="s-share"><a class="btn-wa" href="${esc(SH.links(casoShare(e)).whatsapp)}" target="_blank" rel="noopener">${SH.icon('whatsapp')}<span>Enviar no WhatsApp</span></a><button class="btn-sh" type="button" data-sh-ev="${esc(e.id)}">${SHARE_SVG}<span>Outras formas</span></button></div>` : ''}
        ${media.length ? `<div class="s-media">${media.join('')}</div>` : ''}
        ${e.details ? `<p class="s-details">${esc(e.details)}</p>` : ''}
        <dl class="s-facts">${facts.join('')}</dl>
      </article>`
    $('#sheetInner').scrollTop = 0
    const first = !sheet.open
    if (first) sheet.showModal()
    // o foco fica dentro da ficha: as setas do teclado continuam funcionando e o leitor de tela lê o novo título
    const keepBtn = keepDir && $(`#sheet [data-nav="${keepDir}"]:not(:disabled)`)
    ;(keepBtn || $('#sheetTitle')).focus({ preventScroll: true })
    history.replaceState(null, '', location.pathname + location.search + '#ficha/' + e.id)
  }
  sheet.addEventListener('close', () => {
    $('#sheetInner').innerHTML = ''
    if (location.hash.startsWith('#ficha/')) history.replaceState(null, '', location.pathname + location.search)
  })
  sheet.addEventListener('click', e => {
    if (e.target === sheet) return sheet.close()
    const yt = e.target.closest('.yt button'); if (yt) return playYt(yt.closest('.yt'))
    const nav = e.target.closest('[data-nav]')
    if (nav && !nav.disabled) { const n = sheetList[sheetIdx + Number(nav.dataset.nav)]; if (n) openEvent(n.id, sheetList) }
    if (e.target.closest('[data-close]')) sheet.close()
    const shb = e.target.closest('[data-sh-ev]')
    if (shb) { const ev = evById.get(shb.dataset.shEv); if (ev) openShare(casoShare(ev)) }
    const go = e.target.closest('[data-goto]'); if (go) openEvent(go.dataset.goto, D.events)
    const sp = e.target.closest('[data-sheet-person]'); if (sp) { sheet.close(); filterByPerson(sp.dataset.sheetPerson) }
  })
  sheet.addEventListener('keydown', e => {
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !/input|textarea/i.test(document.activeElement.tagName)) {
      const n = sheetList[sheetIdx + (e.key === 'ArrowRight' ? 1 : -1)]
      if (n) openEvent(n.id, sheetList)
    }
  })
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show')
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2200)
  }

  // ------------------------------------------------------------------ Flávio em 1 minuto (resumo ilustrado)
  const ICON = {
    medalha: '<circle cx="12" cy="15" r="5"/><path d="M8.5 3h7l-1.8 7.3M10.3 10.3 8.5 3"/><path d="m12 13 .8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2z"/>',
    megafone: '<path d="M4 10v4h3l8 4.5v-13L7 10z"/><path d="M18.5 9a4 4 0 0 1 0 6M7 14l1.5 5h2.5L10 15"/>',
    pessoas: '<circle cx="8.5" cy="8" r="3.2"/><circle cx="16.5" cy="9" r="2.6"/><path d="M2.8 20a5.7 5.7 0 0 1 11.4 0M14 15.3a4.6 4.6 0 0 1 7.2 4.7"/>',
    extrato: '<rect x="4.5" y="3" width="15" height="18" rx="2"/><path d="M8 7.5h8M8 11h8M8 14.5h4"/><path d="M14.5 17.5l2-2.5 1.5 1.5"/>',
    dinheiro: '<rect x="2.5" y="6.5" width="19" height="11" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 10v4M18 10v4"/>',
    documento: '<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5M8.5 12.5h7M8.5 16h5"/>',
    algema: '<circle cx="7" cy="15.5" r="4"/><circle cx="17" cy="15.5" r="4"/><path d="M8.5 11.8 10 6.5h4l1.5 5.3M10 6.5a2 2 0 0 1 4 0"/>',
    repasse: '<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
    loja: '<path d="M4 9.5h16L18.5 4h-13z"/><path d="M5.5 9.5V20h13V9.5M10 20v-5.5h4V20"/>',
    predios: '<path d="M3 21h18M5 21V9l6-4v16M11 21V10.5h8V21"/><path d="M14 13.5h2M14 17h2M7.5 11h1M7.5 14h1M7.5 17h1"/>',
    casa: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 9.5V20h13V9.5M10 20v-5h4v5"/>',
    olho: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    filme: '<rect x="3" y="9.5" width="18" height="11" rx="1.6"/><path d="M3.2 9.5 4.8 4.4 20.5 4l.3 5.5M8.5 4.3 7 9.5M13.5 4.2 12 9.5M18.4 4.1 17 9.5"/>',
    grafico: '<path d="M3.5 20h17"/><path d="M5 16l4.5-4.5 3.5 3 6.5-7"/><path d="M15.5 7.5h4v4"/>',
  }
  const resumoCards = () => (STORY.resumo || []).filter(c => evById.has(c.event))
  function renderResumo() {
    const cards = resumoCards()
    const sec = $('#resumo')
    if (!sec) return
    if (!cards.length) { sec.hidden = true; return }
    // faixa: cada ponto é um caso grave em que Flávio é o protagonista
    const graves = D.events.filter(e => isStar(e) && isGrave(e))
    const y0 = Math.min(...graves.map(e => e.year)), y1 = Math.max(+D.meta.updated.slice(0, 4), ...graves.map(e => e.year))
    const byYear = new Map()
    graves.forEach(e => { if (!byYear.has(e.year)) byYear.set(e.year, []); byYear.get(e.year).push(e) })
    $('#faixaN').innerHTML = `<em>${graves.length} casos graves</em> em ${y1 - y0} anos`
    const faixa = $('#faixa')
    faixa.style.setProperty('--anos', y1 - y0 + 1)
    let html = ''
    for (let y = y0; y <= y1; y++) {
      const lab = y === y0 || y === y1 || (y - y0) % 5 === 0
      html += `<div class="fx-ano${lab ? ' lab' : ''}">${(byYear.get(y) || []).map(e => `<button class="fx-dot" type="button" data-open="${esc(e.id)}" title="${esc(fmtDate(e))}: ${esc(e.title)}" aria-label="${esc(fmtDate(e))}: ${esc(e.title)}"></button>`).join('')}<span>${y}</span></div>`
    }
    faixa.innerHTML = html
    // cartões
    $('#rsN').textContent = cards.length
    const total = cards.length + 1
    $('#resumoTrack').innerHTML = cards.map((c, i) => {
      const len = String(c.grande).length
      return `<article class="rc" data-open="${esc(c.event)}" style="--rc:${catColor(c.cat)};--rc-ink:${catInk(c.cat)}">
        <div class="rc-top"><span class="rc-tema">${esc(c.tema)}</span><span class="rc-ano">${esc(c.ano)}</span></div>
        <span class="rc-ico" aria-hidden="true"><svg viewBox="0 0 24 24">${ICON[c.icon] || ICON.documento}</svg></span>
        <p class="rc-big${len > 14 ? ' sm' : len > 10 ? ' md' : ''}">${esc(c.grande)}</p>
        <p class="rc-txt">${esc(c.texto)}</p>
        <p class="rc-st"><b>Situação:</b> ${esc(c.status)}</p>
        <div class="rc-pe"><a class="ep-link rc-go" href="#ficha/${esc(c.event)}">Ver a notícia <span aria-hidden="true">→</span></a><button class="ep-share" type="button" data-sh-ev="${esc(c.event)}" aria-label="Compartilhar: ${esc(c.grande)}">${SHARE_SVG}</button></div>
        <span class="rc-n" aria-hidden="true">${i + 1}/${total}</span>
      </article>`
    }).join('') + `<article class="rc rc-end">
        <p class="rc-big">E tem mais.</p>
        <p class="rc-txt">São ${D.events.length} episódios, em ordem e com as fontes. Veja a história completa ou mande este resumo para alguém.</p>
        <div class="rc-end-act"><a class="btn-primary" href="#historia" data-start>Ver a história completa</a><button class="btn-share" type="button" data-sh-site="resumo">${SHARE_SVG}<span>Compartilhar o resumo</span></button></div>
        <span class="rc-n" aria-hidden="true">${total}/${total}</span>
      </article>`
    syncResumoProgress()
  }
  const track = $('#resumoTrack')
  function syncResumoProgress() {
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    const p = max > 0 ? track.scrollLeft / max : 1
    $('#rsBar').style.transform = `scaleX(${Math.max(0.06, p).toFixed(3)})`
    const cards = $$('.rc', track)
    const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1
    const i = Math.min(cards.length, Math.round(track.scrollLeft / step) + 1)
    $('#rsCount').textContent = `${i} de ${cards.length}`
    $('#rsPrev').disabled = track.scrollLeft < 4
    $('#rsNext').disabled = track.scrollLeft > max - 4
    if (track.scrollLeft > 20) document.body.classList.add('rs-moved')
  }
  if (track) {
    track.addEventListener('scroll', () => requestAnimationFrame(syncResumoProgress), { passive: true })
    const page = dir => { const c = $('.rc', track); track.scrollBy({ left: dir * (c ? c.offsetWidth + 14 : 320), behavior: reduce ? 'auto' : 'smooth' }) }
    $('#rsPrev').addEventListener('click', () => page(-1))
    $('#rsNext').addEventListener('click', () => page(1))
  }

  // ------------------------------------------------------------------ Flávio em 4 assuntos (leitura rápida)
  function renderAssuntos() {
    const list = STORY.assuntos || []
    $('#graves').hidden = !list.length
    $('#gravesGrid').innerHTML = list.map(a => {
      const rostos = (a.rostos || []).filter(k => people.has(k))
      return `<article class="assunto" id="assunto-${esc(a.id)}">
        <p class="as-tema">${esc(a.tema)}</p>
        <h3 class="as-titulo">${esc(a.titulo)}</h3>
        <ol class="as-linhas">${a.linhas.filter(l => evById.has(l.event)).map(l => `<li><button type="button" data-open="${esc(l.event)}"><b>${esc(l.ano)}</b><span>${esc(l.texto)}</span><i aria-hidden="true">→</i></button></li>`).join('')}</ol>
        <div class="as-pe">
          ${rostos.length ? `<span class="avs" aria-hidden="true">${rostos.map(k => avatar(k)).join('')}</span><span class="as-nomes">${esc(rostos.map(displayName).join(', '))}</span>` : ''}
          <button class="btn-share" type="button" data-sh-assunto="${esc(a.id)}">${SHARE_SVG}<span>Compartilhar</span></button>
          <button class="link-ghost" type="button" data-assunto="${esc(a.id)}">Ver tudo →</button>
        </div>
      </article>`
    }).join('')
  }
  $('#gravesGrid').addEventListener('click', e => {
    const b = e.target.closest('[data-assunto]'); if (!b) return
    const a = (STORY.assuntos || []).find(x => x.id === b.dataset.assunto); if (!a) return
    const f = a.filtro || {}
    state.q = ''; state.milestones = false
    state.persons = new Set((f.pessoas || []).filter(k => vc(k)))
    state.cats = new Set(f.temas || [])
    applyFilters()
    goTo($('#timeline'))
  })
  function goToScene(id) {
    const s = $('#cap-' + id)
    if (!s) return false
    const pinned = !isMobile() && !reduce && !s.classList.contains('is-tall')
    window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY + (pinned ? 2 : -navH()), behavior: reduce ? 'auto' : 'smooth' })
    return true
  }

  // ------------------------------------------------------------------ números
  function renderNumbers() {
    // os valores que a história ainda não revelou vêm primeiro
    const inBase = new Set(BASE.map(e => e.id))
    const hs = (D.highlights || []).filter(h => h && (h.value_brl || h.value_text) && inBase.has(h.event))
      .sort((a, b) => sceneByEvent.has(a.event) - sceneByEvent.has(b.event))
    if (!hs.length) { $('#numeros').hidden = true; return }
    $('#numbersGrid').innerHTML = hs.map(h => {
      const e = h.event && evById.get(h.event)
      return `<button class="num" type="button" ${e ? `data-open="${esc(e.id)}"` : ''}>
        ${e ? `<small>${fmtDate(e)}${sceneByEvent.has(h.event) ? ' · na história' : ''}</small>` : ''}
        <span class="v"><span>${esc(h.value_text || fmtBRL(h.value_brl))}</span></span>
        <p>${esc(h.label)}</p>
        ${e ? '<span class="go">Abrir a ficha →</span>' : ''}
      </button>`
    }).join('')
  }

  // ------------------------------------------------------------------ pessoas
  let peopleGroup = 'todos'
  function renderPeople() {
    const ppl = D.people.filter(p => vc(p.key) > 0 && p.profile).map(p => ({ ...p, count: vc(p.key) }))
    if (!ppl.some(p => p.group === peopleGroup) && peopleGroup !== 'todos') peopleGroup = 'todos'
    const groups = ['todos', ...Object.keys(GROUPS).filter(g => ppl.some(p => p.group === g))]
    $('#peopleTabs').innerHTML = groups.map(g => `<button class="chip no-av" type="button" data-group="${g}" aria-pressed="${g === peopleGroup}">${g === 'todos' ? 'Todos' : GROUPS[g][0]} <span class="n">${g === 'todos' ? ppl.length : ppl.filter(p => p.group === g).length}</span></button>`).join('')
    const list = ppl.filter(p => peopleGroup === 'todos' || p.group === peopleGroup).sort((a, b) => {
      const ia = KEY_PEOPLE.indexOf(a.key), ib = KEY_PEOPLE.indexOf(b.key)
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
      return b.count - a.count
    })
    $('#peopleGrid').innerHTML = list.map(p => `
      <article class="person">
        <button class="p-photo" type="button" data-filter-person="${esc(p.key)}" aria-label="Ver os episódios de ${esc(displayName(p.key))}">
          ${p.portrait ? `<img src="${esc(p.portrait.url)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<span class="ini" aria-hidden="true">${esc(initials(p.name))}</span>`}
          <span class="cnt">${p.count} episódio${p.count === 1 ? '' : 's'}</span>
          ${p.portrait && p.portrait.credit ? `<span class="credit">${esc(stripTags(p.portrait.credit))}${p.portrait.license ? ' · ' + esc(p.portrait.license) : ''}</span>` : ''}
        </button>
        ${p.short_role ? `<p class="p-role">${esc(p.short_role)}</p>` : '<p class="p-role">&nbsp;</p>'}
        <h3 class="p-name">${esc(displayName(p.key))}</h3>
        ${p.relation ? `<p class="p-rel">${esc(p.relation)}</p>` : ''}
        ${p.bio ? `<p class="p-bio">${esc(p.bio)}</p>` : ''}
        <div class="p-actions">
          <button class="link-ghost" type="button" data-filter-person="${esc(p.key)}">Ver episódios →</button>
          ${p.bio && p.bio.length > 180 ? '<button class="link-ghost" type="button" data-more aria-expanded="false">Ler mais</button>' : ''}
        </div>
      </article>`).join('')
  }
  function bindPeople() {
    $('#peopleTabs').addEventListener('click', e => { const b = e.target.closest('[data-group]'); if (b) { peopleGroup = b.dataset.group; renderPeople() } })
    $('#peopleGrid').addEventListener('click', e => {
      const f = e.target.closest('[data-filter-person]'); if (f) return filterByPerson(f.dataset.filterPerson)
      const m = e.target.closest('[data-more]')
      if (m) { const bio = m.closest('.person').querySelector('.p-bio'); const o = bio.classList.toggle('open'); m.textContent = o ? 'Ler menos' : 'Ler mais'; m.setAttribute('aria-expanded', o) }
    })
  }

  // ------------------------------------------------------------------ conexões
  let graphReady = false, graphPanelBound = false, graphFocus = null
  function initGraph() {
    if (graphReady) return
    graphReady = true
    $('#graph').innerHTML = ''
    if (!window.d3) {
      // os dois scripts são "defer": se o d3 não chegou até aqui, não vai chegar
      $('#graph').hidden = true
      $('#graphPanel').innerHTML = '<p class="muted">O mapa de conexões não carregou (a biblioteca d3 foi bloqueada ou você está sem internet). As ligações de cada pessoa aparecem nas fichas e na seção Pessoas.</p>'
      return
    }
    const d3 = window.d3
    const el = $('#graph')
    const W = el.clientWidth, H = el.clientHeight
    // juízes, procuradores e o adversário eleitoral aparecem por ofício, não por ligação: ficam fora do mapa
    const nodes = D.people.filter(p => vc(p.key) >= 3 && (p.profile || vc(p.key) >= 4) && p.group !== 'justica' && p.key !== 'lula')
      .map(p => ({ ...p, id: p.key, count: vc(p.key) })).sort((a, b) => b.count - a.count).slice(0, 40)
    const labeled = new Set([...nodes].sort((a, b) => b.count - a.count).slice(0, 18).map(n => n.id))
    const ids = new Set(nodes.map(n => n.id))
    // ligações recalculadas a partir dos episódios do recorte
    const pairs = new Map()
    BASE.forEach(e => { const ps = e.people.filter(k => ids.has(k)).sort(); for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) { const key = ps[i] + '|' + ps[j]; pairs.set(key, (pairs.get(key) || 0) + 1) } })
    const links = [...pairs].map(([key, w]) => { const [a, b] = key.split('|'); return { source: a, target: b, w } })
    const r = n => (n.id === 'flavio' || n.id === 'jair' ? 30 : 9 + Math.sqrt(n.count) * 3.2)
    const svg = d3.select(el).append('svg').attr('viewBox', [0, 0, W, H])
    const defs = svg.append('defs')
    nodes.forEach(n => {
      if (!n.portrait) return
      defs.append('pattern').attr('id', 'gp-' + n.id).attr('patternContentUnits', 'objectBoundingBox').attr('width', 1).attr('height', 1)
        .append('image').attr('href', n.portrait.thumb || n.portrait.url).attr('width', 1).attr('height', 1).attr('preserveAspectRatio', 'xMidYMin slice')
    })
    const link = svg.append('g').attr('stroke-linecap', 'round').selectAll('line').data(links).join('line')
      .attr('stroke', '#8052ff').attr('stroke-opacity', l => Math.min(0.6, 0.1 + l.w * 0.045)).attr('stroke-width', l => Math.min(6, 0.7 + l.w * 0.4))
    const node = svg.append('g').selectAll('g').data(nodes).join('g').attr('class', 'node')
    node.append('circle').attr('r', r).attr('fill', n => n.portrait ? `url(#gp-${n.id})` : '#f4f4f2')
      .attr('stroke', n => (GROUPS[n.group] || GROUPS.outros)[1]).attr('stroke-width', n => KEY_PEOPLE.includes(n.id) ? 3 : 2)
    node.filter(n => !n.portrait).append('text').attr('text-anchor', 'middle').attr('dy', '.35em').style('font-size', n => Math.max(9, r(n) * 0.62) + 'px').style('fill', '#6b6b6b').style('stroke-width', 0).text(n => initials(n.name))
    node.append('title').text(n => `${n.name} — ${n.count} episódios`)
    node.filter(n => labeled.has(n.id)).append('text').attr('text-anchor', 'middle').attr('dy', n => r(n) + 15).text(n => displayName(n.id))
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(l => 95 + 150 / Math.sqrt(l.w)).strength(l => Math.min(0.7, 0.05 + l.w * 0.03)))
      .force('charge', d3.forceManyBody().strength(n => -320 - r(n) * 14))
      .force('collide', d3.forceCollide().radius(n => r(n) + (labeled.has(n.id) ? 26 : 12)))
      .force('x', d3.forceX(W / 2).strength(0.05)).force('y', d3.forceY(H / 2).strength(0.07))
    sim.on('tick', () => {
      nodes.forEach(n => { n.x = clamp(n.x, r(n) + 4, W - r(n) - 4); n.y = clamp(n.y, r(n) + 4, H - r(n) - 30) })
      link.attr('x1', l => l.source.x).attr('y1', l => l.source.y).attr('x2', l => l.target.x).attr('y2', l => l.target.y)
      node.attr('transform', n => `translate(${n.x},${n.y})`)
    })
    node.call(d3.drag()
      .on('start', (ev, n) => { if (!ev.active) sim.alphaTarget(0.25).restart(); n.fx = n.x; n.fy = n.y })
      .on('drag', (ev, n) => { n.fx = ev.x; n.fy = ev.y })
      .on('end', (ev, n) => { if (!ev.active) sim.alphaTarget(0); n.fx = null; n.fy = null }))
    const neighbors = id => new Set(links.filter(l => l.source.id === id || l.target.id === id).flatMap(l => [l.source.id, l.target.id]))
    let selected = null
    function focus(id) {
      if (!id) { node.classed('dim', false); link.classed('dim', false); return }
      const nb = neighbors(id); nb.add(id)
      node.classed('dim', n => !nb.has(n.id))
      link.classed('dim', l => l.source.id !== id && l.target.id !== id)
    }
    node.on('mouseenter', (ev, n) => focus(n.id)).on('mouseleave', () => focus(selected))
      .on('click', (ev, n) => { selected = n.id; focus(n.id); showPanel(n.id) })
    function showPanel(id) {
      const p = { ...people.get(id), count: vc(id) }
      const conns = links.filter(l => l.source.id === id || l.target.id === id).map(l => ({ k: l.source.id === id ? l.target.id : l.source.id, w: l.w })).sort((a, b) => b.w - a.w).slice(0, 10)
      const evs = BASE.filter(e => e.people.includes(id)).sort((a, b) => b.importance - a.importance || a.sort.localeCompare(b.sort)).slice(0, 10).sort((a, b) => a.sort.localeCompare(b.sort))
      $('#graphPanel').innerHTML = `
        ${p.short_role ? `<p class="p-role">${esc(p.short_role)}</p>` : ''}
        <h3>${esc(displayName(id))}</h3>
        ${p.relation ? `<p class="p-rel">${esc(p.relation)}</p>` : ''}
        <div class="p-actions"><button class="link-ghost" type="button" data-filter-person="${esc(id)}">Ver os ${p.count} episódios →</button></div>
        ${conns.length ? `<p class="pop-title">Mais ligado a</p><div class="chips">${conns.map(c => `<button class="chip no-av" type="button" data-graph-node="${esc(c.k)}">${esc(displayName(c.k))} <span class="n">${c.w}</span></button>`).join('')}</div>` : ''}
        <p class="pop-title">Principais episódios</p>
        <ul>${evs.map(e => `<li><button type="button" data-open="${esc(e.id)}">${esc(e.title)}<small>${fmtDate(e)} · ${esc(catLabel(e.category))}</small></button></li>`).join('')}</ul>`
    }
    graphFocus = id => { selected = id; focus(id); showPanel(id) }
    if (!graphPanelBound) {
      graphPanelBound = true
      $('#graphPanel').addEventListener('click', e => {
        const f = e.target.closest('[data-filter-person]'); if (f) filterByPerson(f.dataset.filterPerson)
        const g = e.target.closest('[data-graph-node]'); if (g && graphFocus) graphFocus(g.dataset.graphNode)
      })
    }
    const legend = Object.entries(GROUPS).filter(([g]) => nodes.some(n => n.group === g))
    el.insertAdjacentHTML('beforeend', `<div class="graph-legend">${legend.map(([, [l, c]]) => `<span><i style="background:${c}"></i>${l}</span>`).join('')}</div>`)
    if (people.has('flavio')) { selected = 'flavio'; showPanel('flavio') }
  }

  // ------------------------------------------------------------------ vídeos
  let videoCat = 'todos', videoLimit = 9
  function renderVideos() {
    const vids = D.videos || []
    $('#videos').hidden = !vids.length
    if (!vids.length) return
    const cats = [...new Set(vids.map(v => v.category).filter(Boolean))]
    $('#videoChips').innerHTML = ['todos', ...cats].map(c => `<button class="chip no-av" type="button" data-vcat="${c}" aria-pressed="${c === videoCat}" ${c !== 'todos' ? `style="--c:${catColor(c)}"` : ''}>${c !== 'todos' ? '<span class="sw"></span>' : ''}${c === 'todos' ? 'Todos' : esc(catLabel(c))} <span class="n">${c === 'todos' ? vids.length : vids.filter(v => v.category === c).length}</span></button>`).join('')
    const list = vids.filter(v => videoCat === 'todos' || v.category === videoCat)
    $('#videosGrid').innerHTML = list.slice(0, videoLimit).map(v => `
      <article class="video">
        ${ytLite(v)}
        <h3>${esc(v.title)}</h3>
        <p>${esc(v.channel)}${v.date ? ' · ' + esc(fmtSourceDate(v.date)) : ''}</p>
        ${v.event && evById.get(v.event) ? `<button class="link-ghost" type="button" data-open="${esc(v.event)}">Ver na história →</button>` : ''}
      </article>`).join('') + (list.length > videoLimit ? `<div class="more-row"><button class="btn-soft" type="button" id="moreVideos">Mostrar mais ${Math.min(9, list.length - videoLimit)} de ${list.length - videoLimit}</button></div>` : '')
  }
  function bindVideos() {
    $('#videoChips').addEventListener('click', e => { const b = e.target.closest('[data-vcat]'); if (b) { videoCat = b.dataset.vcat; videoLimit = 9; renderVideos() } })
    $('#videosGrid').addEventListener('click', e => { if (e.target.id === 'moreVideos') { videoLimit += 9; renderVideos() } })
  }

  // ------------------------------------------------------------------ método
  function renderMethod() {
    const c = D.meta.counts
    $('#methodStats').innerHTML = [[c.events, 'episódios'], [c.sources, 'links de fontes'], [c.outlets, 'veículos e órgãos'], [c.videos, 'vídeos verificados']]
      .map(([n, l]) => `<div><dt>${n.toLocaleString('pt-BR')}</dt><dd>${l}</dd></div>`).join('')
    $('#outlets').innerHTML = (D.meta.topOutlets || []).map(o => `<span>${esc(o.name)}<i>${o.n}</i></span>`).join('')
  }

  // ------------------------------------------------------------------ navegação
  function bindNav() {
    const links = $('#navLinks'), bg = $('#burger')
    bg.addEventListener('click', () => { const o = links.classList.toggle('open'); bg.setAttribute('aria-expanded', o) })
    links.addEventListener('click', e => {
      const a = e.target.closest('a'); if (!a) return
      links.classList.remove('open'); bg.setAttribute('aria-expanded', false)
      const target = document.getElementById(a.getAttribute('href').slice(1))
      if (target) { e.preventDefault(); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH() - 8, behavior: reduce ? 'auto' : 'smooth' }) }
    })
    const ids = ['resumo', 'graves', 'historia', 'pessoas', 'conexoes', 'videos', 'metodo']
    const obs = new IntersectionObserver(en => en.forEach(x => {
      if (x.isIntersecting) $$('.nav-links a').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + x.target.id))
    }), { rootMargin: '-45% 0px -50% 0px' })
    ids.map(id => document.getElementById(id)).filter(Boolean).forEach(s => obs.observe(s))
    const gObs = new IntersectionObserver(en => { if (en.some(x => x.isIntersecting)) { initGraph(); gObs.disconnect() } }, { rootMargin: '400px' })
    gObs.observe($('#conexoes'))
  }

  // ------------------------------------------------------------------ pergunta de entrada: idade (letra grande)
  const intro = $('#intro')
  function showIntroStep(name) {
    $$('.intro-step', intro).forEach(st => { st.hidden = st.dataset.step !== name })
    const q = $(`.intro-step[data-step="${name}"] .intro-q`, intro)
    intro.setAttribute('aria-labelledby', q.id)
    // o foco vai para a pergunta (e não para o "Sim", que pareceria já escolhido)
    q.setAttribute('tabindex', '-1'); q.focus({ preventScroll: true })
  }
  function askIdade() {
    if (intro.open) return
    intro.showModal()
    showIntroStep('idade')
  }
  intro.addEventListener('click', e => {
    const b = e.target.closest('[data-idade]')
    if (b) {
      if (b.dataset.idade === 'sim') { Letra.setLevel(2); showIntroStep('tamanho') }
      else { Letra.setLevel(0); intro.close(); window.scrollTo({ top: 0, behavior: 'auto' }) }
      return
    }
    const nv = e.target.closest('[data-nivel]')
    if (nv) { Letra.setLevel(+nv.dataset.nivel); intro.close(); window.scrollTo({ top: 0, behavior: 'auto' }) }
  })
  // Esc sem responder vale como "não"
  intro.addEventListener('cancel', () => { if (!Letra.chosen()) Letra.set(false) })
  // letra grande ligada ou desligada: a história é remontada sem (ou com) a trava de rolagem;
  // entre um tamanho grande e outro, só as medidas mudam
  document.addEventListener('letra', () => {
    const r = reduceMQ || Letra.on
    if (r !== reduce) { reduce = r; applyFilters() }
    else { measureToolbar(); cacheOffsets(); onScroll() }
  })

  // ------------------------------------------------------------------ início
  readUrl()
  renderHero()
  renderResumo()
  constellation = initConstellation()
  renderFilterControls()
  bindFilters()
  measureToolbar()
  renderAssuntos()
  renderPeople(); bindPeople()
  renderVideos(); bindVideos()
  renderMethod()
  bindNav()
  applyFilters()
  // quem chega por um link de ficha lê a ficha primeiro; a pergunta vem quando ela fecha
  if (!Letra.chosen()) {
    if (location.hash.startsWith('#ficha/')) sheet.addEventListener('close', askIdade, { once: true })
    else askIdade()
  }
  // botões de WhatsApp do site (seção "Espalhe")
  if (SH) $$('[data-wa-site]').forEach(a => { a.href = SH.links(siteShare(a.dataset.waSite === 'grande')).whatsapp })

  function openFromHash() {
    if (!location.hash.startsWith('#ficha/')) return false
    const id = decodeURIComponent(location.hash.slice(7))
    if (evById.has(id)) openEvent(id, D.events)
    return true
  }
  // voltar para um endereço sem ficha fecha a ficha aberta
  window.addEventListener('hashchange', () => { if (!openFromHash() && sheet.open) sheet.close() })
  if (!openFromHash() && location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (target) requestAnimationFrame(() => target.scrollIntoView())
  }
})()
