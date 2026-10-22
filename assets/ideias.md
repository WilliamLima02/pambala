# Ideias --- Field Shift: Adapting Farms with NASA Data

> **Objetivo deste documento:** reunir ideias pequenas, úteis e
> realistas para ajudar agricultores a tomar decisões sobre rotação de
> culturas, água e adaptação às condições climáticas.
>
> **Nota sobre o desafio:** a descrição pública do NASA Space Apps
> Challenge pede uma ferramenta de apoio à decisão que combine
> observações da Terra da NASA com informação local sobre solos,
> características das culturas e prioridades dos agricultores. A
> descrição completa e os recursos oficiais devem ser confirmados na
> página do desafio quando forem publicados. Até lá, estas são ideias
> conceptuais para discussão, não uma implementação nem recomendações
> agronómicas validadas.

Fonte oficial: [Field Shift: Adapting Farms with NASA
Data](https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/)

------------------------------------------------------------------------

## 1. Princípio orientador

Não precisamos de construir uma plataforma enorme. Podemos escolher **um
problema específico**, ajudar o utilizador a compreendê-lo e demonstrar
uma solução pequena, transparente e funcional.

Uma boa ideia para este desafio deve:

-   resolver uma dificuldade concreta dos agricultores;
-   usar dados da NASA de forma clara e relevante;
-   considerar informação local sobre culturas e solos, sem inventar
    dados em falta;
-   explicar os resultados numa linguagem simples;
-   deixar claro o que é medido, estimado ou apenas sugerido;
-   ser possível demonstrar num protótipo limitado.

## 2. Lista de ideias

### Ideia 1 --- Comparador de rotações de culturas

**Problema:** pode ser difícil comparar diferentes sequências de
culturas e perceber quais parecem mais adequadas às condições de água e
clima.

**Solução:** permitir ao agricultor comparar duas ou três rotações
possíveis, mostrando as necessidades conhecidas de cada cultura e um
resumo das condições climáticas históricas relevantes.

**Inovação:** em vez de mostrar apenas dados climáticos, a ferramenta
organiza as opções lado a lado e explica os compromissos de cada uma.

**Protótipo mínimo:** - selecionar uma localização; - escolher culturas
de uma lista limitada; - comparar duas sequências de rotação; - mostrar
indicadores climáticos e as fontes utilizadas; - assinalar dados locais
desconhecidos.

**Dados possíveis:** NASA POWER para variáveis meteorológicas; outros
produtos NASA de observação da Terra se forem relevantes e acessíveis.
As necessidades das culturas e as regras de rotação exigem fontes
agronómicas locais fiáveis.

**Dificuldade:** média.

------------------------------------------------------------------------

### Ideia 2 --- Calendário de preparação agrícola baseado no clima

**Problema:** os agricultores precisam de planear as atividades
agrícolas tendo em conta a variação da chuva e da temperatura.

**Solução:** apresentar um calendário visual com dados históricos por
mês e uma lista de aspetos a verificar antes de cada fase agrícola.

**Inovação:** transformar séries de dados difíceis de interpretar num
calendário simples, legível em telemóveis.

**Protótipo mínimo:** - escolher uma região; - visualizar chuva e
temperatura históricas por mês; - selecionar uma cultura; - mostrar
tarefas de preparação com base num calendário agronómico devidamente
referenciado.

**Limite importante:** dados históricos não são uma previsão do tempo
nem garantem quando deve ser feita a sementeira. O calendário deve ser
apresentado como apoio ao planeamento, não como uma prescrição.

**Dificuldade:** baixa a média.

------------------------------------------------------------------------

### Ideia 3 --- Indicador visual de pressão hídrica

**Problema:** os agricultores podem ter dificuldade em perceber se as
condições recentes foram relativamente secas ou húmidas.

**Solução:** mostrar um resumo visual da precipitação e, se houver dados
adequados, da humidade do solo, comparando o período escolhido com o
histórico disponível.

**Inovação:** um indicador simples --- por exemplo, "abaixo", "próximo"
ou "acima" do histórico --- acompanhado dos valores e da explicação do
cálculo.

**Protótipo mínimo:** - escolher localização e período; - apresentar
precipitação histórica; - comparar com uma referência histórica
apropriada; - explicar a origem, a unidade e a resolução espacial dos
dados.

**Dados possíveis:** NASA POWER e, caso seja viável, produtos de
humidade do solo como SMAP.

**Limite importante:** precipitação não é igual a humidade do solo. Não
se deve afirmar que o indicador mede diretamente a água disponível para
uma cultura sem dados e validação adequados.

**Dificuldade:** média.

------------------------------------------------------------------------

### Ideia 4 --- Assistente de escolha de culturas por prioridades

**Problema:** cada agricultor tem prioridades diferentes: poupar água,
proteger o solo, reduzir riscos ou manter uma cultura preferida.

**Solução:** um pequeno assistente que recolhe prioridades e compara
opções de culturas ou rotações com base em critérios explícitos.

**Inovação:** personalizar a comparação em vez de apresentar uma única
resposta para todos.

**Protótipo mínimo:** - selecionar prioridades; - indicar a região e as
condições conhecidas; - comparar duas ou três opções com uma pontuação
transparente; - explicar como cada pontuação foi calculada e quais os
dados em falta.

**Dados necessários:** clima observado pela NASA, características das
culturas e informação local sobre solo e práticas agrícolas.

**Limite importante:** a pontuação deve ser apresentada como comparação
experimental, não como recomendação científica validada.

**Dificuldade:** média.

------------------------------------------------------------------------

### Ideia 5 --- Histórico climático da exploração agrícola

**Problema:** pode ser difícil compreender como a chuva e a temperatura
de uma região variaram ao longo de vários anos.

**Solução:** um painel simples que apresenta a evolução de variáveis
climáticas para uma localização escolhida.

**Inovação:** permitir que um agricultor explore os dados por mês,
estação ou ano sem precisar de saber análise de dados.

**Protótipo mínimo:** - escolher localização; - selecionar variável e
intervalo temporal; - mostrar gráfico e valores resumidos; - identificar
tendências apenas quando o período e o método estatístico as
sustentarem.

**Dados possíveis:** NASA POWER, verificando a cobertura, as unidades e
a natureza de cada variável.

**Dificuldade:** baixa.

------------------------------------------------------------------------

### Ideia 6 --- Diário de campo com contexto climático

**Problema:** os agricultores podem registar atividades e observações
sem as relacionar com as condições ambientais.

**Solução:** um diário simples que associa registos manuais --- como
sementeira, rega ou observações do estado das plantas --- ao contexto
climático disponível para a localização.

**Inovação:** juntar a experiência local do agricultor aos dados
ambientais, em vez de depender apenas de dados de satélite.

**Protótipo mínimo:** - registar data, cultura e observação; -
apresentar chuva e temperatura disponíveis para a data; - permitir rever
registos; - exportar um resumo.

**Dificuldade:** baixa a média.

------------------------------------------------------------------------

### Ideia 7 --- Comparador de épocas agrícolas históricas

**Problema:** uma única média anual pode esconder diferenças importantes
entre épocas de cultivo.

**Solução:** comparar períodos agrícolas históricos com base na chuva,
temperatura e, quando apropriado, outras variáveis relevantes.

**Inovação:** mostrar diferenças entre épocas e anos, em vez de resumir
toda a região num único número.

**Protótipo mínimo:** - selecionar região e períodos; - comparar
gráficos e estatísticas; - indicar anos com dados incompletos; -
explicar que o passado não garante as condições futuras.

**Dificuldade:** média.

------------------------------------------------------------------------

### Ideia 8 --- Mapa de contexto agrícola regional

**Problema:** dados ambientais apresentados apenas em tabelas são
difíceis de relacionar com o território.

**Solução:** um mapa simples que permite selecionar uma região e
consultar indicadores climáticos disponíveis.

**Inovação:** tornar os dados mais intuitivos através de uma
visualização geográfica.

**Protótipo mínimo:** - mapa de uma área limitada; - seleção de um ponto
ou região; - apresentação de indicadores e respetivas fontes; - aviso
sobre a resolução espacial dos dados.

**Dificuldade:** média a alta, dependendo da fonte e da tecnologia
cartográfica.

------------------------------------------------------------------------

### Ideia 9 --- Explicador de dados da NASA para agricultores

**Problema:** mesmo quando os dados estão disponíveis, os seus nomes,
unidades e limitações podem ser difíceis de compreender.

**Solução:** uma interface que traduz indicadores como precipitação e
temperatura para explicações curtas e acessíveis.

**Inovação:** a prioridade não é gerar mais dados, mas ajudar o
utilizador a interpretar corretamente os dados existentes.

**Protótipo mínimo:** - apresentar dois ou três indicadores; - explicar
o que cada um mede; - mostrar unidade, período e fonte; - incluir
exemplos de interpretação e limitações.

**Dificuldade:** baixa.

------------------------------------------------------------------------

### Ideia 10 --- Comparador de estratégias para poupar água

**Problema:** agricultores que enfrentam limitações de água precisam de
comparar estratégias de gestão, mas as opções dependem da cultura, do
solo e das condições locais.

**Solução:** apresentar cenários de gestão da água e comparar os seus
requisitos conhecidos, juntamente com o contexto climático disponível.

**Inovação:** mostrar os compromissos entre estratégias, sem prometer
resultados que não foram medidos.

**Protótipo mínimo:** - selecionar uma cultura e um cenário; - mostrar
indicadores climáticos relevantes; - comparar opções com base em fontes
agronómicas; - identificar claramente as hipóteses.

**Dificuldade:** média a alta, porque exige informação agronómica
fiável.

------------------------------------------------------------------------

## 3. Comparação rápida

  -------------------------------------------------------------------------
  Ideia            Utilidade                   Dificuldade Adequada a um
                   principal                               protótipo curto?
  ---------------- ----------------- --------------------- ----------------
  Comparador de    Comparar                          Média Sim, com poucas
  rotações         sequências de                           culturas e
                   culturas                                regras validadas

  Calendário de    Organizar                  Baixa--média Sim
  preparação       informação por                          
                   época                                   

  Indicador de     Compreender                       Média Sim, se os dados
  pressão hídrica  condições                               forem adequados
                   secas/húmidas                           

  Assistente por   Personalizar                      Média Sim, com
  prioridades      comparações                             critérios
                                                           transparentes

  Histórico        Explorar variação                 Baixa Sim
  climático        ao longo do tempo                       

  Diário de campo  Relacionar                 Baixa--média Sim
                   observações com                         
                   clima                                   

  Comparador de    Comparar períodos                 Média Sim
  épocas           históricos                              

  Mapa regional    Explorar dados              Média--alta Talvez
                   geograficamente                         

  Explicador de    Tornar os dados                   Baixa Sim
  dados NASA       compreensíveis                          

  Cenários de      Comparar                    Média--alta Sim, se o âmbito
  poupança de água estratégias                             for reduzido
  -------------------------------------------------------------------------

## 4. As três ideias que vale a pena discutir primeiro

### A. Comparador de rotações de culturas

É a opção mais diretamente alinhada com o objetivo central do desafio.
Exige, contudo, informação credível sobre culturas, solos e regras de
rotação.

### B. Indicador visual de pressão hídrica

Tem um resultado fácil de demonstrar: escolher uma região, visualizar
dados e compreender o contexto de água. Precisamos de distinguir
claramente precipitação, humidade do solo e água efetivamente disponível
para as plantas.

### C. Assistente de escolha por prioridades

Pode oferecer uma experiência simples e personalizada. A qualidade
depende de os critérios serem transparentes e de não apresentarmos
pontuações inventadas como se fossem recomendações científicas.

**Hipótese de combinação:** estas ideias poderiam fazer parte de uma
única aplicação pequena: um agricultor escolhe uma localização, vê o
contexto climático e compara duas rotações de culturas segundo
prioridades explícitas. Só devemos combinar funcionalidades se isso
continuar a ser exequível.

## 5. Como escolher a ideia final

Antes de decidir, atribuam uma pontuação de 1 a 5 a cada ideia em cinco
critérios:

1.  **Relevância:** resolve uma dificuldade concreta?
2.  **Alinhamento:** responde ao desafio oficial?
3.  **Dados disponíveis:** conseguimos obter e explicar os dados
    necessários?
4.  **Viabilidade:** conseguimos demonstrar a solução com o tempo e as
    competências da equipa?
5.  **Clareza:** um agricultor consegue compreender o benefício?

Não escolham automaticamente a ideia com mais funcionalidades. Escolham
aquela em que conseguem demonstrar melhor o problema, a utilização dos
dados, o funcionamento da solução e as suas limitações.

## 6. Questões que precisamos de investigar

-   Que culturas e práticas agrícolas queremos considerar?
-   Em que região ou comunidade queremos concentrar o protótipo?
-   Que dados da NASA são recomendados no enunciado completo?
-   Que informação local sobre solos e culturas conseguimos obter de
    fontes fiáveis?
-   Que utilizador concreto vai beneficiar da ferramenta?
-   Qual é a única funcionalidade que tem de funcionar bem na
    demonstração?

## 7. Nota de rigor científico

Os dados da NASA não substituem automaticamente medições locais,
conhecimento agronómico ou aconselhamento profissional. A resolução
espacial e temporal varia conforme o produto. O protótipo deve
identificar as fontes, unidades, períodos, hipóteses e limitações; não
deve inventar medições nem garantir rendimentos agrícolas.

------------------------------------------------------------------------

**Próximo passo sugerido:** escolher duas ou três ideias desta lista e
avaliá-las em equipa. Depois de consultarem a descrição completa e os
recursos oficiais do desafio, decidam qual delas pode ser transformada
numa solução pequena, demonstrável e cientificamente responsável.
