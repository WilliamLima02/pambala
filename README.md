*Este projecto foi desenvolvido por Maidenless Tarnisheds*

# Pambala — versão inicial funcional

## Funcionalidades nesta versão
- Navegação entre secções sem recarregar a página.
- Seleção de coordenadas no mapa Leaflet/OpenStreetMap ou introdução manual.
- Consulta real da NASA POWER Daily API para T2M, PRECTOTCORR e RH2M.
- Indicadores, tabela e gráfico da série consultada.
- Formulário de perfil do solo e persistência local.
- Biblioteca inicial de culturas em `data/crops.json`.
- Motor experimental de comparação, com razões e avisos.
- Histórico local das análises.

## Limitações importantes
- SMAP e NDVI estão identificados como integrações pendentes. Não são simulados nem apresentados como se tivessem sido consultados.
- Os parâmetros de culturas e a pontuação são preliminares. Não usar como recomendação agronómica final sem validação por técnicos e fontes regionais.
- A persistência usa `localStorage`: os dados ficam apenas no navegador/dispositivo atual. Não há contas, sincronização, base de dados nem backend.
- O mapa usa tiles públicos do OpenStreetMap e necessita de Internet. Respeita a política de utilização do serviço.
- A consulta NASA POWER é feita diretamente do navegador. Para produção, convém criar um backend/cache, controlar limites e validar respostas.

## Fontes técnicas
- NASA POWER Daily API: https://power.larc.nasa.gov/docs/services/api/temporal/daily/
- NASA POWER Temporal APIs: https://power.larc.nasa.gov/docs/services/api/temporal/
- NASA SMAP / NASA-USDA Global Soil Moisture: https://earth.gsfc.nasa.gov/hydro/data/nasa-usda-global-soil-moisture-data
- NASA MODIS vegetation indices: https://modarch.gsfc.nasa.gov/data/dataprod/mod13.php
- MOD13Q1 V061: https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD13Q1/
- OpenStreetMap: https://www.openstreetmap.org/copyright

## Próximas integrações para uma versão de produção
1. Validar as fichas agronómicas com fontes de Angola (IIA, MINAGRIF, FAO e literatura local).
2. Implementar extração SMAP e NDVI via serviço geoespacial (por exemplo Google Earth Engine ou NASA Earthdata/LP DAAC), com tratamento de qualidade e datas.
3. Desenvolver backend, base de dados, autenticação e sincronização.
4. Melhorar o motor de decisão com época de sementeira, previsão/climatologia, balanço hídrico, variedades e calibração regional.
