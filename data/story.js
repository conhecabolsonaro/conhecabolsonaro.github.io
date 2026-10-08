/*
  Roteiro da história contada na rolagem.

  Cada capítulo é uma cena que aparece na linha do tempo logo antes do episódio indicado em "event"
  (antes de qualquer episódio da mesma data). Assim a revelação acontece no ponto certo da cronologia.
  O número e a afirmação principal saem do episódio em "event"; as demais afirmações, dos episódios em "also".
  A cena oferece todos para abrir.

  viz.type:
    words    só o texto, revelado palavra por palavra
    counter  número que sobe até "value" (format: brl | usd | int | years | pct)
    tiles    "count" fichas de "unit" que caem uma a uma, com total corrente
    grid     "total" itens, dos quais "highlight" acendem
    versus   duas barras que crescem até os percentuais
*/
window.STORY = {
  chapters: [
    {
      id: 'prologo', n: 'Prólogo', title: 'Antes do filho, o pai',
      event: 'gap-jair-pre-2018-e-alerj-2009-2017-artigo-veja-1986-prisao-disciplinar',
      also: ['gap-jair-pre-2018-e-alerj-2009-2017-eleito-vereador-rio-1988'],
      hook: 'Setembro de 1986. O capitão Jair Bolsonaro é punido com prisão disciplinar por um artigo na Veja. Dois anos depois, já na reserva, é eleito vereador do Rio. Começa ali a carreira política da família.',
      viz: { type: 'words' },
    },
    {
      id: 'gabinete', n: 'Capítulo 1', title: 'O gabinete',
      event: 'rachadinha-alerj-origem-mandatos-alerj',
      also: ['milicia-adriano-mocao-louvor-2003'],
      hook: 'Em 2003, Flávio toma posse na Alerj como o deputado estadual mais jovem da legislatura. No mesmo ano, propõe uma moção de louvor a um tenente da PM que o Ministério Público do Rio apontaria, anos depois, como um dos chefes da milícia de Rio das Pedras.',
      viz: { type: 'words' },
    },
    {
      id: 'relatorio', n: 'Capítulo 2', title: 'O relatório',
      event: 'rachadinha-alerj-origem-coaf-queiroz-revelado',
      also: ['queiroz-michelle-stf-arquiva-cheques'],
      hook: 'Dezembro de 2018. Flávio acaba de ser eleito senador quando o Estadão revela um relatório do Coaf sobre a conta de seu ex-assessor na Alerj, Fabrício Queiroz.',
      viz: { type: 'counter', value: 1200000, format: 'brl', caption: 'em movimentação considerada atípica em um ano (jan/2016–jan/2017). Entre os valores, um cheque de R$ 24 mil para Michelle Bolsonaro, que Jair atribuiu à devolução de um empréstimo. Em 2021, o STF arquivou um pedido para investigá-lo pelos cheques.' },
    },
    {
      id: 'depositos', n: 'Capítulo 3', title: '48 depósitos',
      event: 'rachadinha-alerj-origem-48-depositos',
      hook: 'Janeiro de 2019. O Jornal Nacional revela outro trecho do Coaf, desta vez sobre a conta do próprio Flávio: depósitos em dinheiro, todos do mesmo valor, feitos no caixa eletrônico da Assembleia.',
      viz: { type: 'tiles', count: 48, unit: 2000, unitLabel: 'R$ 2 mil', caption: 'em 48 depósitos de R$ 2 mil, entre junho e julho de 2017. Flávio disse que o dinheiro veio da venda de um apartamento e que R$ 2 mil era o limite do caixa eletrônico.' },
    },
    {
      id: 'atibaia', n: 'Capítulo 4', title: 'Atibaia',
      event: 'rachadinha-alerj-processo-queiroz-preso-atibaia',
      hook: '18 de junho de 2020. Fabrício Queiroz é preso em Atibaia (SP), numa casa de Frederick Wassef, então advogado de Flávio.',
      viz: { type: 'words' },
    },
    {
      id: 'denuncia', n: 'Capítulo 5', title: 'A denúncia',
      event: 'rachadinha-alerj-processo-denuncia-mprj',
      also: ['rachadinha-alerj-processo-tjrj-rejeita-denuncia'],
      hook: 'Outubro de 2020. O Ministério Público do Rio denuncia Flávio, Queiroz e mais 15 pessoas por organização criminosa, peculato e lavagem de dinheiro.',
      viz: { type: 'counter', value: 6100000, format: 'brl', caption: 'teriam sido desviados do gabinete entre 2007 e 2018, segundo a acusação. A denúncia nunca foi recebida: depois que o STJ e o STF anularam as principais provas, o TJ do Rio a rejeitou em 2022, sem julgar o mérito. Flávio não chegou a ser réu.' },
    },
    {
      id: 'mansao', n: 'Capítulo 6', title: 'A mansão',
      event: 'mansao-brb-compra-mansao-lago-sul',
      hook: 'Janeiro de 2021. Com a denúncia ainda à espera de análise, Flávio e a mulher assinam a compra de uma casa no Lago Sul, em Brasília.',
      viz: { type: 'counter', value: 5970000, format: 'brl', caption: 'pela casa, com R$ 3,1 milhões financiados pelo BRB, o banco público do Distrito Federal.' },
    },
    {
      id: 'dinheiro-vivo', n: 'Capítulo 7', title: 'Dinheiro vivo',
      event: 'imoveis-dinheiro-vivo-uol-51-de-107-imoveis',
      also: ['imoveis-dinheiro-vivo-bolsonaro-qual-o-problema'],
      hook: 'Agosto de 2022, em plena campanha. O UOL levanta os imóveis negociados pela família Bolsonaro desde os anos 1990 e confere, um a um, como foram pagos.',
      viz: { type: 'grid', total: 107, highlight: 51, caption: 'imóveis da família foram pagos total ou parcialmente em dinheiro vivo: R$ 13,5 milhões na época, R$ 25,6 milhões em valores corrigidos.', quote: '“Qual o problema?”, respondeu Jair Bolsonaro.' },
    },
    {
      id: 'oito-de-janeiro', n: 'Capítulo 8', title: 'Depois da derrota',
      event: 'jair-golpe-joias-ataques-8-de-janeiro',
      also: ['jair-golpe-joias-minuta-casa-torres'],
      hook: '8 de janeiro de 2023. Apoiadores de Bolsonaro invadem e depredam as sedes dos Três Poderes. Dois dias depois, a Polícia Federal apreende na casa de Anderson Torres, ex-ministro da Justiça, a minuta de um decreto para rever o resultado da eleição.',
      viz: { type: 'words' },
    },
    {
      id: 'abin', n: 'Capítulo 9', title: 'A Abin paralela',
      event: 'abin-paralela-pf-uso-para-proteger-filhos',
      also: ['abin-paralela-4a-fase-lista-monitorados'],
      hook: 'Julho de 2024. Segundo a Polícia Federal, uma estrutura paralela dentro da Abin monitorou ministros do STF, jornalistas e auditores da Receita ligados ao caso de Flávio. Ele nega relação com a agência e não foi indiciado.',
      viz: { type: 'words' },
    },
    {
      id: 'indiciamento', n: 'Capítulo 10', title: 'O indiciamento',
      event: 'jair-golpe-joias-pf-indicia-37',
      hook: 'Novembro de 2024. A Polícia Federal conclui o inquérito sobre a tentativa de golpe depois da eleição de 2022.',
      viz: { type: 'counter', value: 37, format: 'int', caption: 'pessoas indiciadas por golpe de Estado, abolição violenta do Estado Democrático de Direito e organização criminosa, entre elas Jair Bolsonaro.' },
    },
    {
      id: 'tarifaco', n: 'Capítulo 11', title: 'O tarifaço',
      event: 'eduardo-tarifaco-50-por-cento',
      also: ['eduardo-condenacao-coacao-stf'],
      hook: 'Julho de 2025. Eduardo Bolsonaro, licenciado do mandato, está nos Estados Unidos desde março. Donald Trump anuncia uma tarifa sobre produtos brasileiros e cita o processo contra Jair.',
      viz: { type: 'counter', value: 50, format: 'pct', caption: 'de tarifa sobre o Brasil. Em 2026, o STF concluiu que Eduardo articulou a medida para pressionar ministros e o condenou por coação no curso do processo.' },
    },
    {
      id: 'sentenca', n: 'Capítulo 12', title: 'A sentença',
      event: 'jair-golpe-joias-condenacao-stf',
      hook: '11 de setembro de 2025. Por 4 votos a 1, a Primeira Turma do Supremo condena Jair Bolsonaro pela trama golpista.',
      viz: { type: 'counter', value: 27, format: 'years', suffix: 'e 3 meses', caption: 'de prisão, em regime inicial fechado.' },
    },
    {
      id: 'tornozeleira', n: 'Capítulo 13', title: 'A tornozeleira',
      event: 'flavio-senado-2026-vigilia-e-prisao-preventiva-do-pai',
      also: ['jair-golpe-joias-prisao-preventiva-tornozeleira'],
      hook: 'Novembro de 2025. Flávio convoca uma vigília de oração perto da casa do pai. Na madrugada seguinte, a tornozeleira de Jair registra uma violação: ele admite ter usado um ferro de solda no aparelho. Horas depois, é preso.',
      viz: { type: 'words' },
    },
    {
      id: 'escolhido', n: 'Capítulo 14', title: 'O escolhido',
      event: 'flavio-senado-2026-anuncio-pre-candidatura',
      also: ['flavio-senado-2026-preco-da-candidatura'],
      hook: '5 de dezembro de 2025. Preso, Jair escolhe Flávio como candidato do PL à Presidência. Dois dias depois, o filho diz que tem “um preço” para desistir. À noite, explica qual: o pai livre e nas urnas.',
      viz: { type: 'words' },
    },
    {
      id: 'dark-horse', n: 'Capítulo 15', title: 'Dark Horse',
      event: 'banco-master-intercept-flavio-dark-horse',
      also: ['banco-master-stf-inquerito-dark-horse'],
      hook: 'Maio de 2026. Áudios revelados pelo Intercept mostram Flávio cobrando de Daniel Vorcaro, do Banco Master, dinheiro para um filme sobre o pai.',
      viz: { type: 'counter', value: 24000000, format: 'usd', caption: 'negociados para o filme, segundo os áudios. Flávio confirmou o pedido e diz que era patrocínio privado. Em julho, o STF abriu inquérito e ele passou a ser investigado, sem indiciamento até agora.' },
    },
    {
      id: 'brb', n: 'Capítulo 16', title: 'A volta da mansão',
      event: 'mansao-brb-pf-apura-financiamento',
      hook: 'Outubro de 2026. A dois dias da eleição, reportagens informam que a Polícia Federal passou a analisar o empréstimo do BRB que ajudou a pagar a casa do Lago Sul. Não há acusação contra Flávio.',
      viz: { type: 'words' },
    },
  ],
  epilogue: {
    id: 'epilogo', n: 'Agora', title: '4 de outubro de 2026',
    event: 'flavio-senado-2026-primeiro-turno',
    hook: 'Depois de tudo o que esta história conta, Flávio Bolsonaro termina o 1º turno da eleição presidencial à frente de Lula.',
    viz: { type: 'versus', a: { label: 'Flávio Bolsonaro (PL)', value: 47.03 }, b: { label: 'Lula (PT)', value: 45.16 }, caption: 'dos votos válidos. O 2º turno é em 25 de outubro.' },
  },
}
