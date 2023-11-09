export function libError(response: number) {
  let message:string = 'Mensagem não catalogada!';
  
  if(response === -1) message = '[ERROR] Houve falhas na inicialização da biblioteca.';
  if(response === -2) message = '[ERROR] Houve falhas na finalização da biblioteca.';
  if(response === -3) message = '[ERROR] Houve erro ao ler a configuração informada.';
  if(response === -4) message = '[ERROR] Valor informado incorreto.';
  if(response === -5) message = '[ERROR] Não foi possível localizar o arquivo informado.';
  if(response === -6) message = '[ERROR] Não foi possível encontrar o diretório do arquivo.';
  if(response === -7) message = '[ERROR] Erro na comunicação HTTP.';
  if(response === -10) message = '[ERROR] Houve falhas na execução do método.';
  if(response === -11) message = '[ERROR] Falha na validação do xml.';
  if(response === -12) message = '[ERROR] Falha na validação da chave passada.';
  if(response === -13) message = '[ERROR] Índice passado não se encontra no intervalo.';
  if(response === -14) message = '[ERROR] Houve um erro ao gerar o xml.';
  if(response === -17) message = '[ERROR] Nenhuma NF-e foi adicionada ao lote ou adicionado mais de 50 NFe.';

  return message
}
