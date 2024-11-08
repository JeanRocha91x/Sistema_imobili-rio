# Sistema Imobiliário

## Instalação Local

1. Certifique-se de ter o Node.js instalado (versão 16 ou superior)

2. Abra o terminal e execute:

```bash
# Clone o repositório (se estiver usando Git)
git clone [URL_DO_REPOSITORIO]

# Entre na pasta do projeto
cd sistema-imobiliario

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

3. O sistema estará disponível em `http://localhost:5173`

## Build para Produção

Para gerar uma versão otimizada para produção:

```bash
# Gera os arquivos de produção
npm run build

# Testa a versão de produção localmente
npm run preview
```

## Notas Importantes

- O sistema utiliza IndexedDB para armazenamento local
- Todos os dados são armazenados no navegador
- Recomendado usar navegadores modernos (Chrome, Firefox, Safari)
- Para backup dos dados, use as opções de exportação para Excel/PDF na interface