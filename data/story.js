/*
  Roteiro da história contada na rolagem.

  Cada capítulo é uma cena que aparece na linha do tempo logo antes do episódio indicado em "event"
  (antes de qualquer episódio da mesma data). Assim a revelação acontece no ponto certo da cronologia.
  O número e a afirmação principal saem do episódio em "event"; as demais afirmações, dos episódios em "also".
  A cena oferece todos para abrir.

  Recortes: "views" lista em quais recortes a cena aparece (padrão: todos). "bolso" troca campos da cena
  no recorte de quem se declara bolsonarista, que mostra Flávio e os irmãos sem acusar o pai.
  A numeração dos capítulos é feita na hora, conforme o recorte.

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
      id: 'prologo', views: [], n: 'Prólogo', title: 'Antes do filho, o pai',
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
      bolso: { viz: { type: 'counter', value: 1200000, format: 'brl', caption: 'em movimentação considerada atípica em um ano (jan/2016–jan/2017), segundo o Coaf.' } },
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
      bolso: {
        also: [],
        hook: 'Agosto de 2022, em plena campanha. O UOL levanta os imóveis negociados pela família Bolsonaro desde os anos 1990 e confere, um a um, como foram pagos. Só a parte dos filhos Flávio, Carlos e Eduardo chega a:',
        viz: { type: 'counter', value: 15700000, format: 'brl', caption: 'pagos em dinheiro vivo por imóveis, em valores corrigidos pela inflação, segundo o levantamento do UOL.' },
      },
    },
    {
      id: 'oito-de-janeiro', views: [], n: 'Capítulo 8', title: 'Depois da derrota',
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
      id: 'indiciamento', views: [], n: 'Capítulo 10', title: 'O indiciamento',
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
      id: 'sentenca', views: [], n: 'Capítulo 12', title: 'A sentença',
      event: 'jair-golpe-joias-condenacao-stf',
      hook: '11 de setembro de 2025. Por 4 votos a 1, a Primeira Turma do Supremo condena Jair Bolsonaro por golpe de Estado.',
      viz: { type: 'counter', value: 27, format: 'years', suffix: 'e 3 meses', caption: 'de prisão, em regime inicial fechado.' },
    },
    {
      id: 'tornozeleira', views: ['geral'], n: 'Capítulo 13', title: 'A tornozeleira',
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
      bolso: { hook: '5 de dezembro de 2025. Jair escolhe Flávio como candidato do PL à Presidência. Dois dias depois, Flávio diz que tem “um preço” para desistir da candidatura. À noite, explica qual: o pai livre e nas urnas.' },
    },
    {
      id: 'dark-horse', n: 'Capítulo 15', title: 'Dark Horse',
      event: 'banco-master-intercept-flavio-dark-horse',
      also: ['banco-master-stf-inquerito-dark-horse'],
      hook: 'Maio de 2026. Áudios revelados pelo Intercept mostram Flávio cobrando de Daniel Vorcaro, do Banco Master, dinheiro para um filme sobre o pai.',
      viz: { type: 'counter', value: 134000000, format: 'brl', caption: 'negociados para o filme, segundo os áudios (US$ 24 milhões; o valor em reais é a conversão da imprensa). Flávio confirmou o pedido e diz que era patrocínio privado. Em julho, o STF abriu inquérito e ele passou a ser investigado, sem indiciamento até agora.' },
    },
    {
      id: 'brb', n: 'Capítulo 16', title: 'A volta da mansão',
      event: 'mansao-brb-pf-apura-financiamento',
      hook: 'Outubro de 2026. A dois dias da eleição, reportagens informam que a Polícia Federal passou a analisar o empréstimo do BRB que ajudou a pagar a casa do Lago Sul. Não há acusação contra Flávio.',
      viz: { type: 'words' },
    },
  ],
  // Flávio em 4 assuntos: leitura rápida logo depois da capa. Cada linha abre a ficha do episódio indicado.
  // "filtro" diz o que "Ver tudo" mostra na linha do tempo; "rostos" são as pessoas do assunto.
  // "Flávio em 1 minuto": cartões ilustrados logo depois da capa. Cada um resume um episódio ("event"),
  // com o número em destaque, uma frase e a situação jurídica atual. Os textos saem do próprio episódio.
  // icon: medalha | megafone | pessoas | extrato | dinheiro | documento | algema | repasse | loja | predios | casa | olho | filme | grafico
  resumo: [
    {
      id: 'medalha', tema: 'Milícia', cat: 'milicia', icon: 'medalha', ano: '2005', grande: 'Medalha Tiradentes',
      texto: 'Flávio propôs a maior honraria da Alerj ao PM Adriano da Nóbrega, que estava preso, acusado de homicídio. Em 2019, o MP do Rio o apontou como um dos chefes da milícia de Rio das Pedras.',
      status: 'Homenagem aprovada em 2005 e nunca revogada. Adriano foi absolvido do homicídio em 2007.',
      event: 'milicia-adriano-medalha-tiradentes-2005',
    },
    {
      id: 'defesa', tema: 'Milícia', cat: 'milicia', icon: 'megafone', ano: '2007', grande: 'Defendeu milícias',
      texto: 'Na tribuna da Alerj, Flávio descreveu as milícias como policiais que afastam bandidos das comunidades. Semanas depois, disse à imprensa que planejava um projeto para regulamentá-las.',
      status: 'Discurso registrado pela Alerj. Não há notícia de que o projeto tenha sido apresentado.',
      event: 'milicia-adriano-flavio-defende-milicias-2007',
    },
    {
      id: 'gabinete', tema: 'Milícia', cat: 'milicia', icon: 'pessoas', ano: '2019', grande: 'Mãe e ex-mulher',
      texto: 'A mãe e a ex-mulher de Adriano da Nóbrega foram assessoras de Flávio na Alerj até 2018, indicadas por Queiroz. Para o MP, a ex-mulher era funcionária fantasma.',
      status: 'Investigadas no caso da rachadinha, cuja ação penal foi arquivada em 2022. A ex-mulher de Adriano ainda responde por improbidade; Flávio não é réu nessa ação.',
      event: 'milicia-adriano-mae-e-ex-mulher-no-gabinete',
    },
    {
      id: 'coaf', tema: 'Queiroz', cat: 'rachadinha', icon: 'extrato', ano: '2018', grande: 'R$ 1,2 milhão',
      texto: 'movimentados em um ano na conta de Fabrício Queiroz, então assessor de Flávio. O Coaf considerou a movimentação atípica. Só numa agência dentro da Alerj, os saques somaram R$ 159 mil.',
      status: 'Deu origem à investigação. Este relatório foi mantido pelo STF, mas outras provas caíram em 2021 e o caso foi arquivado em 2022. Ninguém foi condenado.',
      event: 'rachadinha-alerj-origem-coaf-queiroz-revelado',
    },
    {
      id: 'depositos', tema: 'Rachadinha', cat: 'rachadinha', icon: 'dinheiro', ano: '2019', grande: '48 × R$ 2 mil',
      texto: 'depósitos em dinheiro vivo na conta de Flávio, feitos em cinco dias de junho e julho de 2017, no caixa eletrônico da Alerj. Total: R$ 96 mil.',
      status: 'Em 2021, o STF anulou relatórios do Coaf feitos a pedido do MP. O caso foi arquivado em 2022.',
      event: 'rachadinha-alerj-origem-48-depositos',
    },
    {
      id: 'denuncia', tema: 'Rachadinha', cat: 'rachadinha', icon: 'documento', ano: '2020', grande: 'R$ 6,1 milhões',
      texto: 'teriam sido desviados do gabinete de Flávio entre 2007 e 2018, com 12 assessores devolvendo parte do salário, segundo a denúncia do MP do Rio.',
      status: 'Denúncia rejeitada em 2022, sem julgamento de mérito, depois que as principais provas foram anuladas.',
      event: 'rachadinha-alerj-processo-denuncia-mprj',
    },
    {
      id: 'atibaia', tema: 'Queiroz', cat: 'rachadinha', icon: 'algema', ano: '2020', grande: 'Queiroz preso',
      texto: 'O ex-assessor de Flávio, apontado pelo MP como operador do esquema, foi preso em Atibaia (SP), num imóvel de Frederick Wassef, então advogado de Flávio.',
      status: 'Foi para a prisão domiciliar em 2020 e ficou livre em 2021. O STJ anulou as decisões do juiz, inclusive a prisão, e a denúncia caiu em 2022. Não há condenação.',
      event: 'rachadinha-alerj-processo-queiroz-preso-atibaia',
    },
    {
      id: 'adriano', tema: 'Milícia', cat: 'milicia', icon: 'repasse', ano: '2020', grande: 'R$ 400 mil',
      texto: 'repassados por Adriano da Nóbrega a contas administradas por Queiroz, segundo o MP, que pôs Adriano no “núcleo executivo” do esquema do gabinete.',
      status: 'Estimativa do MP. O caso foi arquivado em 2022, depois da anulação das provas.',
      event: 'milicia-adriano-mp-nucleo-executivo-400-mil',
    },
    {
      id: 'chocolates', tema: 'Dinheiro vivo', cat: 'imoveis', icon: 'loja', ano: '2020', grande: '1.512 depósitos',
      texto: 'em dinheiro vivo na loja de chocolates de Flávio, de 2015 a 2018. Para o MP, a loja servia para lavar o dinheiro da rachadinha.',
      status: 'A suspeita foi arquivada com o caso, em 2022. O STF negou a reabertura em 2025.',
      event: 'imoveis-dinheiro-vivo-loja-chocolates-1512-depositos',
    },
    {
      id: 'imoveis', tema: 'Dinheiro vivo', cat: 'imoveis', icon: 'predios', ano: '2022', grande: '51 de 107',
      texto: 'imóveis negociados pelo clã Bolsonaro desde os anos 1990 foram pagos, total ou parcialmente, em dinheiro vivo, segundo escrituras reunidas pelo UOL. Flávio e os irmãos Carlos e Eduardo negociaram 19 deles.',
      status: 'Comprar imóvel em espécie não é crime. Parte das compras entrou em investigações do MP, quase todas anuladas ou arquivadas. Ninguém foi condenado.',
      event: 'imoveis-dinheiro-vivo-uol-51-de-107-imoveis',
    },
    {
      id: 'mansao', tema: 'Mansão', cat: 'imoveis', icon: 'casa', ano: '2021', grande: 'R$ 5,97 milhões',
      texto: 'é o preço da mansão de Flávio em Brasília. R$ 3,1 milhões vieram do BRB, banco público do DF, a 3,71% ao ano, abaixo dos cerca de 4,85% praticados na época, segundo O Globo.',
      status: 'A PF apura o empréstimo, revelou O Globo em outubro de 2026. Em 2025, a Justiça do DF, em 1ª instância, o considerou regular. Não há acusação formal.',
      event: 'mansao-brb-compra-mansao-lago-sul',
    },
    {
      id: 'abin', tema: 'Abin', cat: 'abin', icon: 'olho', ano: '2020', grande: 'Abin',
      texto: 'Relatórios atribuídos à agência de inteligência do governo do pai orientavam a defesa de Flávio para anular o caso das rachadinhas, revelou a Época.',
      status: 'O GSI negou a autoria e a PGR arquivou a apuração em 2022. Em 2024, a PF disse que a “Abin paralela” monitorou 3 auditores da Receita ligados ao caso. Flávio não foi indiciado.',
      event: 'abin-paralela-relatorios-abin-defesa-flavio',
    },
    {
      id: 'master', tema: 'Banco Master', cat: 'financas', icon: 'filme', ano: '2026', grande: 'R$ 134 milhões',
      texto: 'pedidos por Flávio a Daniel Vorcaro, ex-dono do Banco Master, hoje preso, para um filme sobre o pai. Flávio confirmou ter pedido o dinheiro. Vorcaro pagou ao menos R$ 61 milhões.',
      status: 'Flávio é investigado no STF por corrupção, lavagem e evasão de divisas. Não foi indiciado.',
      event: 'banco-master-intercept-flavio-dark-horse',
    },
    {
      id: 'patrimonio', tema: 'Patrimônio', cat: 'financas', icon: 'grafico', ano: '2026', grande: 'R$ 1,7 → 8,2 mi',
      texto: 'é a evolução do patrimônio declarado por Flávio à Justiça Eleitoral entre 2018 e 2026: alta real de 211%, já descontada a inflação. Só a mansão no Lago Sul, de R$ 6,2 milhões, responde por três quartos do total.',
      status: 'Declaração pública ao TSE. Não há investigação específica sobre o patrimônio, mas a PF apura o financiamento da mansão, o principal bem.',
      event: 'imoveis-dinheiro-vivo-flavio-patrimonio-tse-2026',
    },
  ],
  assuntos: [
    {
      id: 'milicia', tema: 'Milícia',
      titulo: 'Defendeu milícias e condecorou um PM depois apontado como chefe miliciano.',
      rostos: ['adriano', 'raimunda', 'danielle-nobrega'],
      filtro: { temas: ['milicia'], pessoas: ['flavio'] },
      linhas: [
        { ano: '2003', texto: 'Propôs moção de louvor ao PM Adriano da Nóbrega.', event: 'milicia-adriano-mocao-louvor-2003' },
        { ano: '2005', texto: 'Deu a Medalha Tiradentes a Adriano, então preso acusado de homicídio.', event: 'milicia-adriano-medalha-tiradentes-2005' },
        { ano: '2007', texto: 'Defendeu as milícias na tribuna da Alerj.', event: 'milicia-adriano-flavio-defende-milicias-2007' },
        { ano: 'até 2018', texto: 'A mãe e a mulher de Adriano trabalhavam no gabinete dele.', event: 'milicia-adriano-mae-e-ex-mulher-no-gabinete' },
      ],
    },
    {
      id: 'queiroz', tema: 'Queiroz',
      titulo: 'R$ 1,2 milhão na conta do assessor.',
      rostos: ['queiroz', 'wassef'],
      filtro: { pessoas: ['flavio', 'queiroz'] },
      linhas: [
        { ano: '2007–18', texto: 'Foi assessor, motorista e segurança de Flávio na Alerj.', event: 'rachadinha-alerj-origem-composicao-gabinete' },
        { ano: '2018', texto: 'O Coaf apontou R$ 1,2 milhão em movimentação atípica na conta dele.', event: 'rachadinha-alerj-origem-coaf-queiroz-revelado' },
        { ano: '2020', texto: 'Foi preso na casa do advogado de Flávio, em Atibaia.', event: 'rachadinha-alerj-processo-queiroz-preso-atibaia' },
        { ano: '2020', texto: 'Recebeu mais de R$ 400 mil de Adriano da Nóbrega, segundo o MP.', event: 'milicia-adriano-mp-nucleo-executivo-400-mil' },
        { ano: '2026', texto: 'Esteve em ato da campanha de Flávio.', event: 'queiroz-michelle-2026-campanha-flavio' },
      ],
    },
    {
      id: 'rachadinha', tema: 'Rachadinha e dinheiro vivo',
      titulo: 'R$ 6,1 milhões desviados do gabinete, segundo a acusação.',
      rostos: ['flavio', 'queiroz'],
      filtro: { temas: ['rachadinha', 'imoveis'], pessoas: ['flavio'] },
      linhas: [
        { ano: '2017', texto: '48 depósitos de R$ 2 mil em dinheiro na conta de Flávio.', event: 'rachadinha-alerj-origem-48-depositos' },
        { ano: '2015–18', texto: '1.512 depósitos em espécie na loja de chocolates dele.', event: 'imoveis-dinheiro-vivo-loja-chocolates-1512-depositos' },
        { ano: '2020', texto: 'Denunciado por peculato, lavagem e organização criminosa.', event: 'rachadinha-alerj-processo-denuncia-mprj' },
        { ano: '2022', texto: 'A denúncia foi rejeitada depois que STJ e STF anularam as provas.', event: 'rachadinha-alerj-processo-tjrj-rejeita-denuncia' },
      ],
    },
    {
      id: 'master', tema: 'Banco Master e BRB',
      titulo: 'R$ 134 milhões negociados com um banqueiro hoje preso.',
      rostos: ['vorcaro', 'paulo-henrique-costa'],
      filtro: { temas: ['financas'], pessoas: ['flavio'] },
      linhas: [
        { ano: '2021', texto: 'Comprou mansão de R$ 5,97 mi com R$ 3,1 mi do banco público BRB.', event: 'mansao-brb-compra-mansao-lago-sul' },
        { ano: '2026', texto: 'Áudios: negociou R$ 134 milhões com Daniel Vorcaro para um filme sobre o pai.', event: 'banco-master-intercept-flavio-dark-horse' },
        { ano: '2026', texto: 'Passou a ser investigado no STF por corrupção e lavagem.', event: 'banco-master-stf-inquerito-dark-horse' },
        { ano: '2026', texto: 'A PF apura o empréstimo; o ex-presidente do BRB está preso.', event: 'mansao-brb-pf-apura-financiamento' },
      ],
    },
  ],
  epilogue: {
    id: 'epilogo', n: 'Agora', title: '4 de outubro de 2026',
    event: 'flavio-senado-2026-primeiro-turno',
    hook: 'Depois de tudo o que esta história conta, Flávio Bolsonaro termina o 1º turno da eleição presidencial à frente de Lula.',
    viz: { type: 'versus', a: { label: 'Flávio Bolsonaro (PL)', value: 47.03 }, b: { label: 'Lula (PT)', value: 45.16 }, caption: 'dos votos válidos. O 2º turno é em 25 de outubro.' },
  },
}
