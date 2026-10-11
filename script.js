// ============================================
//  SCRIPT.JS — Gerador de Senha Aleatória
//  Conceitos usados:
//  - Strings e concatenação
//  - Math.random() e Math.floor()
//  - Loops for
//  - Condicionais if/else
//  - Funções
//  - DOM: getElementById, textContent
//  - Clipboard API (copiar para área de transferência)
//  - setTimeout (esconder mensagem após N segundos)
// ============================================


// ============================================
// 1. CONJUNTOS DE CARACTERES
//    Cada string representa um grupo de chars
//    que pode ser incluído na senha
// ============================================

const MAIUSCULAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MINUSCULAS = 'abcdefghijklmnopqrstuvwxyz';
const NUMEROS    = '0123456789';
const SIMBOLOS   = '!@#$%^&*()_+-=[]{}|;:,.<>?';


// ============================================
// 2. REFERÊNCIAS AOS ELEMENTOS HTML
// ============================================

const elSenha      = document.getElementById('senha');
const elTextoForca = document.getElementById('texto-forca');
const elMsgCopia   = document.getElementById('msg-copiado');
const elValorTam   = document.getElementById('valor-tamanho');


// ============================================
// 3. ATUALIZAR LABEL DO SLIDER
//    Chamada pelo oninput no HTML
// ============================================

function atualizarTamanho() {
  const tamanho = document.getElementById('tamanho').value;
  elValorTam.textContent = tamanho;
}


// ============================================
// 4. GERAR SENHA
//    Função principal — chamada pelo botão
// ============================================

function gerarSenha() {
  // Lê as opções selecionadas pelo usuário
  const tamanho     = parseInt(document.getElementById('tamanho').value);
  const usaMaius    = document.getElementById('maiusculas').checked;
  const usaMinus    = document.getElementById('minusculas').checked;
  const usaNums     = document.getElementById('numeros').checked;
  const usaSimb     = document.getElementById('simbolos').checked;

  // Monta o alfabeto disponível juntando os grupos selecionados
  let alfabeto = '';
  if (usaMaius) alfabeto += MAIUSCULAS;
  if (usaMinus) alfabeto += MINUSCULAS;
  if (usaNums)  alfabeto += NUMEROS;
  if (usaSimb)  alfabeto += SIMBOLOS;

  // Se nenhuma opção foi marcada, avisa e para
  if (alfabeto === '') {
    elSenha.textContent = 'Selecione ao menos uma opção!';
    resetarForca();
    return;
  }

  // Gera a senha: repete N vezes e a cada vez
  // escolhe um caractere aleatório do alfabeto
  let senha = '';
  for (let i = 0; i < tamanho; i++) {
    const indiceAleatorio = Math.floor(Math.random() * alfabeto.length);
    senha += alfabeto[indiceAleatorio];
  }

  // Exibe a senha no visor
  elSenha.textContent = senha;
  elMsgCopia.textContent = '';

  // Calcula e exibe a força da senha
  calcularForca(senha, usaMaius, usaMinus, usaNums, usaSimb);
}


// ============================================
// 5. CALCULAR FORÇA DA SENHA
//    Baseado na variedade de tipos e no tamanho
// ============================================

function calcularForca(senha, maius, minus, nums, simb) {
  // Conta quantos tipos de caractere foram usados
  let pontos = 0;
  if (maius) pontos++;
  if (minus) pontos++;
  if (nums)  pontos++;
  if (simb)  pontos++;

  // Bônus por comprimento
  if (senha.length >= 12) pontos++;
  if (senha.length >= 20) pontos++;

  // Define cor e texto conforme pontuação
  let cor   = '#e74c3c';  // vermelho = fraca
  let texto = 'Fraca';

  if (pontos >= 5) {
    cor   = '#27ae60'; // verde escuro = muito forte
    texto = 'Muito forte';
  } else if (pontos >= 4) {
    cor   = '#2ecc71'; // verde = forte
    texto = 'Forte';
  } else if (pontos >= 3) {
    cor   = '#f39c12'; // laranja = boa
    texto = 'Boa';
  } else if (pontos >= 2) {
    cor   = '#e67e22'; // laranja escuro = média
    texto = 'Média';
  }

  // Quantas barras colorir (máximo 4)
  const barrasColoridas = Math.min(pontos, 4);

  for (let i = 1; i <= 4; i++) {
    const barra = document.getElementById('barra' + i);
    if (i <= barrasColoridas) {
      barra.style.background = cor;
    } else {
      barra.style.background = '#dde3ea'; // cinza = inativo
    }
  }

  elTextoForca.textContent = 'Força: ' + texto;
}


// ============================================
// 6. RESETAR BARRAS DE FORÇA
//    Usada quando nenhuma opção está marcada
// ============================================

function resetarForca() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById('barra' + i).style.background = '#dde3ea';
  }
  elTextoForca.textContent = 'Força: —';
}


// ============================================
// 7. COPIAR SENHA
//    Usa a Clipboard API moderna do navegador
// ============================================

function copiar() {
  const senha = elSenha.textContent;

  // Não copia se não houver senha válida
  if (
    senha === 'Clique em gerar' ||
    senha === 'Selecione ao menos uma opção!'
  ) return;

  // navigator.clipboard é a forma moderna de copiar
  navigator.clipboard.writeText(senha)
    .then(function() {
      // Sucesso: mostra feedback por 2 segundos
      elMsgCopia.textContent = '✅ Senha copiada para a área de transferência!';
      setTimeout(function() {
        elMsgCopia.textContent = '';
      }, 2000);
    })
    .catch(function() {
      // Fallback para browsers antigos
      elMsgCopia.textContent = '❌ Não foi possível copiar automaticamente.';
    });
}


// ============================================
// 8. GERA UMA SENHA AO CARREGAR A PÁGINA
// ============================================

gerarSenha();