# FIELD SHIFT — Especificação do Produto e Técnica

**Produto:** Field Shift — Adaptar as Explorações Agrícolas com Dados da NASA  
**Versão:** 0.1.0  
**Estado:** Linha de base inicial — documento vivo  
**Última atualização:** 2026-10-30

> Este documento é a fonte oficial de referência do projeto. Distinguir factos confirmados, propostas e questões em aberto. Atualizá-lo sempre que a implementação ou uma decisão importante mudar.

## 1. Visão do produto

O Field Shift pretende ajudar os agricultores a adaptar as suas decisões agrícolas às alterações das condições climáticas, utilizando dados de observação da Terra e de clima da NASA, combinados com informações locais das explorações agrícolas sempre que estejam disponíveis.

Deve ser um sistema útil e proativo de apoio à agricultura — não apenas um painel estático de dados climáticos.

### Princípios fundamentais
- **Monitorização proativa:** preparar informação útil mesmo quando o agricultor não está a utilizar a aplicação.
- **Processamento assíncrono:** a recolha e a análise de dados devem funcionar independentemente do Streamlit.
- **Explicabilidade:** cada alerta deve explicar o que foi observado, onde, quando e por que razão é importante.
- **Orientações baseadas em evidências:** distinguir observações, previsões, indicadores estatísticos e recomendações.
- **Relevância local:** não assumir que um ponto de dados regional representa uma exploração agrícola individual.
- **Design centrado no agricultor:** investigar as necessidades, literacia, conectividade, dispositivos e canais de notificação preferidos.
- **Entrega incremental:** preservar as funcionalidades que já funcionam e implementar/testar em pequenas etapas.

## 2. Utilizadores previstos e problema

**Utilizadores previstos:** agricultores, gestores de explorações agrícolas, técnicos de apoio agrícola/extensionistas e utilizadores de demonstração/avaliação.

**Hipótese do problema:** os agricultores podem beneficiar de uma interpretação atempada e geograficamente relevante das condições climáticas — especialmente da variabilidade da precipitação, dos períodos secos prolongados e dos padrões de temperatura — para apoiar o planeamento e a monitorização.

**Validação necessária:** entrevistas com agricultores e especialistas agrícolas devem confirmar as decisões prioritárias, culturas, limitações locais e canais de comunicação preferidos.

## 3. Âmbito e estado

### Direção confirmada
- Aplicação dinâmica, bem concebida e responsiva.
- Painel proativo.
- Monitorização climática em segundo plano/assíncrona.
- Deteção de riscos e histórico de alertas.
- Orientação agrícola contextualizada, na medida em que as evidências o permitam.
- Notificações; o canal de entrega continua em investigação.

### Questões em aberto
- Cultura e variedade-alvo iniciais.
- Geografia exata do projeto-piloto e coordenadas das explorações.
- Modelo de registo e identificação dos agricultores.
- Canal de notificação (WhatsApp, SMS, notificações push ou outro).
- Alojamento e ambiente de implantação em produção.
- Fornecedor e integração de previsões meteorológicas.
- Limiares agronómicos para orientações específicas por cultura.

## 4. Base técnica existente

### Ambiente confirmado
- Python 3.10 (informado).
- Streamlit 1.65.0.
- Pandas 2.3.3.
- Plotly 7.1.0.
- NumPy 2.2.6.
- Ambiente virtual: `.venv`.
- Windows PowerShell.
- Executável Python: `.\.venv\Scripts\python.exe`.

Outros pacotes constavam no `pip freeze` apresentado; não devem ser considerados dependências diretas do produto até que a sua utilização seja confirmada.

### Ficheiros existentes no projeto
- `app.py` — aplicação Streamlit existente (15 461 bytes na última inspeção).
- `audit_data.py` — auditoria da qualidade dos dados.
- `explore_benguela.py` — exploração climática.
- `inspect_dry_spells.py` — análise da distribuição da precipitação e dos períodos secos.
- `validate_metrics.py` — validação das métricas.
- `data/` — ficheiros CSV de origem e derivados.
- `assets/` — recursos visuais existentes.
- `Exploração e testes-Onésimo/` — pasta de exploração existente.

**Restrição:** inspecionar o `app.py` atual e a estrutura do projeto antes de modificar ou substituir qualquer elemento. Preservar as funcionalidades existentes.

## 5. Inventário de dados

### Conjunto de dados diário
`data/field_shift_daily_nasa_power.csv`

Colunas: `date`, `rain_mm`, `temp_mean_c`, `temp_max_c`, `temp_min_c`, `city`.

Dimensão reportada: 38 988 linhas. Período: 1991-01-01 a 2026-07-31. Identificadores de localização: `Benguela`, `Bie_Cuito`, `Huambo`.

### Conjunto de dados por campanha
`data/field_shift_campaigns_by_city.csv`

Dimensão reportada: 105 linhas (3 localidades × 35 épocas/campanhas).

Colunas:
- `city`, `season`, `season_start_year`
- `rain_sep_jul_mm`, `rain_oct_mar_mm`
- `temp_mean_c`, `temp_max_mean_c`, `temp_min_mean_c`
- `max_dry_spell_days_lt1mm`
- `rain_data_completeness`, `days_with_rain_data`, `expected_days`
- `baseline_mean_rain_sep_jul_mm`, `baseline_sd_rain_sep_jul_mm`
- `baseline_mean_rain_oct_mar_mm`, `baseline_mean_temp_c`
- `rain_anomaly_sep_jul_mm`, `rain_anomaly_pct`

### Comparação das campanhas recentes
`data/field_shift_recent_campaign_comparison.csv`: dimensão reportada de 15 linhas; campanhas de 2021/22 a 2025/26 nas três localidades.

### Outros ficheiros reportados
- `data/metric_validation_report.csv`
- `data/exploration/monthly_climate_profile.csv`
- `data/exploration/annual_climate_profile.csv`
- `data/exploration/dry_spells.csv`

## 6. Qualidade e validação dos dados

Verificações reportadas:
- Não existem valores em falta nem linhas integralmente duplicadas nos três principais ficheiros CSV.
- Não existem datas inválidas, registos duplicados por cidade/data ou valores negativos de precipitação.
- Não existem dias em falta dentro do intervalo de datas de cada localidade.
- Não foram encontradas inconsistências evidentes na ordem dos valores de temperatura.
- Não existem registos duplicados por cidade/campanha.
- Os valores de completude das campanhas correspondem à proporção entre dias com dados observados e dias esperados, com diferença inferior a 0,01.
- Os totais de precipitação das campanhas coincidem com os dados diários.
- O `validate_metrics.py` reportou 945 testes `OK` e nenhuma discrepância.

**Limitação:** estas verificações demonstram consistência interna, mas não comprovam a exatidão científica independente, a representatividade geográfica exata ou a adequação dos dados para recomendações ao nível de uma exploração agrícola. Antes de fazer afirmações localizadas, confirmar os parâmetros de consulta da NASA POWER, as coordenadas, a agregação temporal e os metadados da fonte.

## 7. Resultados exploratórios registados

Para o identificador `Benguela`:
- 12 996 registos diários, de 1991-01-01 a 2026-07-31.
- Precipitação diária média: aproximadamente 0,7866 mm.
- Dias com precipitação exatamente igual a zero: 5 200.
- Dias com precipitação inferior a 1 mm: 11 102.
- Maior sequência reportada com precipitação inferior a 1 mm/dia: 230 dias, de 2005-03-25 a 2005-11-09.
- Também foram reportadas outras sequências longas em 1997, 2002, 2003, 2013, 2015 e 2022.

**Cuidado na interpretação:** o limiar inferior a 1 mm/dia é uma definição analítica, não uma prova de ausência total de chuva ou de stress hídrico da cultura. Uma estatística de período seco, por si só, não demonstra danos na cultura nem perdas de produção.

## 8. Arquitetura proposta (ainda não implementada)

1. **Adaptadores das fontes de dados:** obter dados da NASA POWER e, posteriormente, de outras fontes aprovadas; registar a fonte, os parâmetros, as coordenadas, a hora da recolha e a cobertura.
2. **Processo de ingestão:** executar independentemente do Streamlit; obter dados incrementais quando suportado; tratar novas tentativas, tempos-limite e indisponibilidade das fontes.
3. **Validação e armazenamento:** validar esquema, datas, unidades, duplicados e dados em falta; guardar observações normalizadas e metadados. Proposta inicial para o protótipo: SQLite.
4. **Motor de análise climática:** calcular totais de precipitação em janelas móveis, anomalias, períodos secos, indicadores de temperatura e completude dos dados. Os limiares devem ser configuráveis e documentados.
5. **Motor de alertas:** avaliar regras explícitas; guardar evidências, localização, período analisado, gravidade, versão da regra e estado; evitar alertas duplicados.
6. **Camada de orientação:** converter indicadores verificados em explicações compreensíveis. Adicionar regras agronómicas e relativas às fases da cultura apenas após validação por especialistas locais.
7. **Aplicação Streamlit:** ler dados processados e registos de alertas; apresentar a atualidade e a qualidade dos dados; evitar operações de ingestão dispendiosas durante a apresentação das páginas.
8. **Adaptador de notificações:** criar inicialmente alertas dentro da aplicação; adicionar entrega externa depois de a investigação com agricultores selecionar um canal; registar tentativas e falhas de entrega.

### Stack proposta para o primeiro protótipo
- Python + aplicação Streamlit existente.
- Pandas para processamento tabular.
- Plotly para visualizações interativas.
- SQLite para persistência local.
- Processo Python agendado e separado (Agendador de Tarefas do Windows durante o desenvolvimento local).
- `requests` para acesso à API, se necessário (reportado como instalado).

Uma tarefa agendada local só funciona enquanto o computador anfitrião estiver disponível. A monitorização em produção exigirá alojamento permanentemente disponível ou um agendador gerido.

## 9. Estrutura proposta da aplicação

1. **Visão geral:** estado da exploração/localidade, última atualização, alertas ativos e indicadores principais.
2. **Inteligência Climática:** histórico de precipitação e temperatura, comparações e anomalias.
3. **Monitorização da Exploração:** perfil da exploração, cultura, localização, sistema de produção e fase da cultura.
4. **Inteligência de Risco:** indicadores de risco climático sustentados por evidências e respetivas explicações.
5. **Orientação Inteligente:** considerações contextualizadas e próximos passos, incluindo a incerteza.
6. **Centro de Alertas:** alertas ativos, históricos, reconhecidos e resolvidos.
7. **Definições/Fontes de Dados:** perfil, unidades, atualidade dos dados, metadados das fontes e preferências de notificação quando forem decididas.

### Direção visual da interface
Interface premium, clara e responsiva; base em verde-escuro agrícola com apontamentos moderados de verde-lima; fundos neutros e tipografia de elevado contraste; âmbar/vermelho reservados para estados de atenção/risco; etiquetas acessíveis e gráficos adaptados a dispositivos móveis. O aspeto visual não deve ocultar a proveniência dos dados nem a incerteza.

## 10. Requisitos funcionais

### Etapa inicial
- FR-001: Carregar os CSV climáticos existentes sem alterar o seu significado.
- FR-002: Apresentar a localidade e o intervalo de datas selecionados.
- FR-003: Apresentar a data da última atualização e a cobertura dos dados.
- FR-004: Executar a análise climática fora do ciclo de apresentação do Streamlit.
- FR-005: Guardar os resultados da análise de forma persistente.
- FR-006: Gerar alertas baseados em regras, com evidências e datas/h horas.
- FR-007: Impedir alertas ativos duplicados para a mesma regra/localidade/período.
- FR-008: Apresentar alertas ativos e históricos no Streamlit.
- FR-009: Identificar claramente os dados observados e os dados de previsão.
- FR-010: Apresentar avisos sobre a qualidade e a completude dos dados.

### Etapas posteriores
- FR-011: Manter perfis de agricultores e explorações com consentimento e minimização de dados.
- FR-012: Associar as coordenadas das explorações aos dados climáticos relevantes.
- FR-013: Incorporar cultura, variedade, data de sementeira e fase de desenvolvimento.
- FR-014: Entregar alertas através de um canal escolhido pelo agricultor.
- FR-015: Recolher feedback dos agricultores e, sempre que possível, resultados das campanhas.

## 11. Requisitos não funcionais

- **Fiabilidade:** os processos em segundo plano devem registar erros e recuperar de forma segura.
- **Idempotência:** repetir um processo não deve duplicar observações nem alertas.
- **Rastreabilidade:** os alertas devem poder ser reproduzidos a partir dos dados guardados e da versão da regra.
- **Segurança:** proteger as informações dos agricultores e das explorações; nunca incluir segredos ou dados pessoais no Git.
- **Desempenho:** a apresentação do painel deve basear-se sobretudo na leitura de resultados já preparados.
- **Acessibilidade:** ser legível em telemóveis e funcionar, na medida do possível, com ligações de baixa largura de banda.
- **Manutenção:** código modular, testes, versões de dependências controladas e documentação.
- **Resiliência:** apresentar a última atualização bem-sucedida se a fonte de dados estiver indisponível.

## 12. Conceção dos alertas

Cada alerta deve incluir: título, gravidade, localização/exploração, período de observação, data/hora de geração, indicador e valor observados, referência e método de comparação, completude e atualidade dos dados, explicação em linguagem simples, ação prudente ou informação a verificar, identificador/versão da regra e estado (ativo, reconhecido, resolvido ou expirado).

Não afirmar que haverá perda iminente da cultura, não prescrever datas de sementeira nem declarar perdas de produção apenas com base em anomalias de precipitação. Os limiares e as orientações específicos de cada cultura exigem evidência agronómica e validação local.

## 13. Investigação com agricultores

O canal de notificação preferido **ainda não foi decidido**. Investigar:
- Posse de smartphones e acesso a aplicações.
- Disponibilidade e custo da Internet.
- Preferência por WhatsApp, SMS, voz, notificações da aplicação ou agentes de extensão rural.
- Idioma preferido e necessidades de acessibilidade.
- Frequência e horários aceitáveis para os alertas.
- Expectativas de confiança, privacidade e consentimento.
- Que decisões e avisos são realmente úteis.

Não escolher um canal apenas com base em suposições da equipa.

## 14. Estratégia de testes

- Testes unitários para agregação da precipitação, cálculo de anomalias, lógica dos períodos secos e regras de alerta.
- Testes de dados para esquema, unidades, cobertura temporal e tratamento de duplicados.
- Testes de idempotência para ingestão repetida e geração de alertas.
- Testes de integração para persistência na base de dados e consultas do painel.
- Testes de falhas para erros de rede/API e dados incompletos.
- Testes com agricultores e especialistas agrícolas.
- Registar neste documento as limitações conhecidas e os resultados dos testes.

## 15. Roteiro de desenvolvimento

### Etapa 0 — Linha de base e preservação
- [x] Ambiente Python/Streamlit existente identificado.
- [x] Inventário e colunas dos principais CSV registados.
- [x] Auditoria dos dados reportou ausência de discrepâncias internas.
- [x] Validação das métricas reportou 945 verificações OK.
- [ ] Inspecionar/documentar as páginas, funções e comportamento do `app.py` atual.
- [ ] Registar os parâmetros de consulta e as coordenadas da NASA POWER.

### Etapa 1 — Base de monitorização
- [ ] Criar o esquema SQLite e o módulo da base de dados.
- [ ] Importar os dados diários e das campanhas de forma idempotente.
- [ ] Criar o módulo de análise com base nas métricas testadas.
- [ ] Criar regras de alerta e histórico.
- [ ] Criar um processo de monitorização autónomo.
- [ ] Adicionar registos de execução (logs) e informação da última execução bem-sucedida.
- [ ] Testar execuções repetidas e comportamento perante falhas.

### Etapa 2 — Experiência Streamlit
- [ ] Integrar os resultados preparados na aplicação existente.
- [ ] Adicionar a visão geral e o centro de alertas.
- [ ] Adicionar indicadores de atualidade e qualidade dos dados.
- [ ] Melhorar o design visual responsivo sem remover funcionalidades existentes.

### Etapa 3 — Contexto das explorações e orientações
- [ ] Realizar investigação com agricultores e especialistas.
- [ ] Confirmar a geografia do projeto-piloto e os requisitos de dados das explorações.
- [ ] Adicionar perfis das explorações e contexto das culturas.
- [ ] Validar as regras de orientação com especialistas agronómicos.

### Etapa 4 — Notificações e implantação
- [ ] Selecionar o canal com base na investigação junto dos agricultores.
- [ ] Implementar o adaptador de notificações e o registo de entregas.
- [ ] Colocar os processos em segundo plano num ambiente de alojamento fiável e permanentemente disponível.
- [ ] Adicionar monitorização operacional, cópias de segurança e revisão de segurança.

## 16. Próxima ação imediata

**Inspecionar o `app.py` completo antes de o alterar.** Inspecionar também a árvore completa do projeto e confirmar os parâmetros de consulta e as coordenadas usados na NASA POWER.

Depois:
1. Mapear as funcionalidades existentes e preservá-las.
2. Implementar SQLite e a importação de dados como uma camada separada e testável.
3. Construir o primeiro processo de monitorização em segundo plano.
4. Integrar os resultados dos alertas no Streamlit.

## 17. Registo de decisões

| ID | Decisão | Estado | Observações |
|---|---|---|---|
| DEC-001 | Manter Python e Streamlit no protótipo atual | Confirmada | A aplicação existente está funcional. |
| DEC-002 | A monitorização deve ser assíncrona e independente do Streamlit | Direção confirmada | O agendador/alojamento ainda precisa de ser construído. |
| DEC-003 | Disponibilizar um painel proativo e notificações | Direção confirmada | O canal externo continua por decidir. |
| DEC-004 | Investigar o canal de notificação junto dos agricultores | Confirmada | Não assumir WhatsApp nem SMS. |
| DEC-005 | Usar SQLite no primeiro protótipo local | Proposta | Reavaliar para implantação multiutilizador em produção. |
| DEC-006 | Inspecionar antes de refatorar; preservar a aplicação existente | Confirmada | Evitar uma substituição destrutiva. |
| DEC-007 | Utilizar alertas explicáveis e baseados em evidências | Princípio confirmado | Orientações específicas por cultura exigem validação. |

## 18. Histórico de alterações

- **2026-10-30 — v0.1.0:** Especificação inicial elaborada a partir das decisões do projeto e das informações técnicas comunicadas pelo responsável. A arquitetura proposta e os elementos ainda não verificados estão identificados explicitamente.
