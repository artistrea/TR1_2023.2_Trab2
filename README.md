# TR1_2023.2_Trab2

https://github.com/artistrea/TR1_2023.2_Trab2/

simulando camada fisica com um transmissor, um receptor e uma interface visualizando todo o processo

## Instalando as dependências

Primeiro, é **necessário** ter **node** e **npm** (_node package manager_) em seu sistema. Geralmente os dois são instalados juntos. Para verificar se já os possui, rode `npm --version` e, se a resposta for um número, você possui ambos instalados.

Então basta **instalar** os pacotes do **projeto**. Para isso, rode `npm install` na raíz do projeto.

### Como instalar Node?

O ideal é **instalar** o Node **usando** o **nvm** (_node version manager_). Para fazer isso no Linux, é possível olhar o github [oficial deles](https://github.com/nvm-sh/nvm#install--update-script), mas basta usar os comandos:

```bash
# run install script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
# load nvm to shell session PATH
source ~/.bashrc
# install long-term-support Node version and its npm
nvm install --lts
```

## Como rodar?

Caso já tenha **node** e rodado `npm install` na raíz do projeto, basta rodar:

```bash
npm run dev
```

Na configuração inicial do projeto, a interface está sendo servida na porta `5173`, o transmissor está na `3001` e o receptor na `3002` do `http://localhost`.
