# acbr-lib-nfe
Biblioteca para comunicação com ACBrLibNFe feita em Typescript.

## 🚀 Começando
Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento.

```
git clone https://github.com/matheusgomesbs/acbr-lib-nfe.git
```

### 🔧 Instalação

Uma série de exemplos passo-a-passo que informam o que você deve executar para ter um ambiente de desenvolvimento em execução.

Diga como essa etapa será:

```
pnpm install
```

Termine com um exemplo de como obter dados do sistema ou como usá-los para uma pequena demonstração.

## 📦 Implantação
Veja o exemplo que esta dentro de "modules/user", para criar módulos com as
funcionalidades que deseja. Para expor seus módulos utilize o arquivo "context.ts" que esta dentro da pasta "preload".

Exemplo: 
```typescript
import path from 'node:path';
import { ACBrLibNFe, IACBrLibNFeOptions } from "@ACBrLibNFe";

const ACBrLibPath = path.join(__dirname, 'bin', 'StdCall', 'ACBrNFe64.dll');
const ACBrFileConfigINI = path.join(__dirname, 'bin', 'ACBrLib.ini');
const XMLFile = path.join(__dirname, 'lib', 'xml', 'test-save.xml');
const eventXMLFile = path.join(__dirname, 'lib', 'xml', 'evento-teste-nfe.xml');
const eventINIFile = path.join(__dirname, 'lib', 'ini', 'evento-teste.ini');
const INIFile = path.join(__dirname, 'lib', 'ini', '01.ini');

const ACBrOptions: IACBrLibNFeOptions = {
  fileConfigINI: ''
}

const NFe = new ACBrLibNFe({
  ACBrLibPath,
  ACBrOptions
});

const init = NFe.initialize();
console.log('=>', init.ACBrResponse);

// Verificar Status Serviço
const libCheckServiceStatus = NFe.checkServiceStatus();
console.log('=>', libCheckServiceStatus.ACBrResponse);

const finish = NFe.finish();
console.log('=>', finish.ACBrResponse);
```
## 🛠️ Construído com

Mencione as ferramentas que você usou para criar seu projeto

* [NodeJS](https://nodejs.org/) - Node.js® is an open-source, cross-platform JavaScript runtime environment.
* [TypeScript](https://www.typescriptlang.org/) - TypeScript é uma linguagem de programação fortemente tipada que se baseia em JavaScript, oferecendo melhores ferramentas em qualquer escala.

## 🖇️ Colaborando

Fique a vontade para deixar sua colaboração com o projeto com correções ou dicas de melhorias

## 📌 Versão

Versão 0.0.1

## ✒️ Autores

* **Matheus Gomes** - [matheusgomesbs](https://github.com/matheusgomesbs)
* **Koromix**- *Biblioteca de comuicação com .dll* - [Koffi](https://github.com/Koromix/koffi)

Você também pode ver a lista de todos os [colaboradores](https://github.com/matheusgomesbs/acbr-lib-nfe/graphs/contributors) que participaram deste projeto.

## 📄 Licença

Este projeto está sob a licença (MIT) - veja o arquivo [LICENSE.md](https://github.com/matheusgomesbs/acbr-lib-nfe/licenca) para detalhes.
