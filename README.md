# Projeto Olhos de Águia (*Eagle's Eye*) | Workshop no 5º CTA

> **Visão computacional (simples) embarcada e autonomia em drones de arquitetura aberta**

Este repositório atua como um hub central de materiais e códigos para o workshop realizado no 5º Centro de Telemática de Área (5º CTA) nos dias 16 e 17 de junho de 2026. O objetivo é fornecer acesso rápido e direto à teoria e à prática de processamento de imagens embarcado e integração de sistemas via *MAVLink*.

## O que você encontrará aqui
- **Hub de Materiais:** Código-fonte de uma Landing Page ultra-leve construída em Vanilla JS, HTML e CSS puro, focada em performance e carregamento instantâneo para dispositivos móveis.
- **Documentação (Masterclass):** Arquivos teóricos em PDF cobrindo desde a arquitetura de hardware da Baixa Camada (Pixhawk, telemetria, Failsafe) até o processamento lógico e Defesa Cibernética.
- **Scripts de Visão Computacional:** Códigos práticos em Python da Alta Camada, utilizando OpenCV para rastreamento de alvos e envio de comandos dinâmicos.

## Como acessar os materiais

Para visualizar o hub de materiais interativo e baixar a Masterclass, acesse a página oficial do projeto:
👉 **[Acesse o Portal Olhos de Águia Aqui](https://link-para-o-github-pages.com)**

## Rodando os códigos localmente

Caso queira analisar e testar os scripts de processamento de imagem e controle MAVLink na sua máquina:

1. Clone o repositório:
```bash
git clone https://github.com/Jhon-Victor-Ramos/workshop-5-CTA-olhos-de-aguia.git
cd nome-do-repositorio
```

2. Instale as dependências necessárias (Visão e Controle):
```bash
pip install opencv-python numpy pymavlink
```

3. Acesse a pasta dos scripts e execute o arquivo principal (nota: o envio de comandos de voo exige conexão com o hardware via serial/USB):
```bash
python3 main.py
```

---
*Desenvolvido pela equipe do Projeto Olhos de Águia.*
