/**
 * Script para gerar icones PWA a partir do SVG
 *
 * Gera icones PNG em varios tamanhos para PWA
 *
 * Uso: node scripts/generate-icons.js
 *
 * Requer: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const INPUT_SVG = path.join(__dirname, '../public/icons/icon.svg');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

async function generateIcons() {
  console.log('Gerando icones PWA...\n');

  // Verificar se o SVG existe
  if (!fs.existsSync(INPUT_SVG)) {
    console.error('Erro: Arquivo SVG nao encontrado em:', INPUT_SVG);
    process.exit(1);
  }

  // Criar diretorio se nao existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Gerar cada tamanho
  for (const size of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

    try {
      await sharp(INPUT_SVG)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✓ Gerado: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Erro ao gerar icon-${size}x${size}.png:`, error.message);
    }
  }

  // Gerar favicon.ico (32x32)
  const faviconPath = path.join(__dirname, '../public/favicon.ico');
  try {
    await sharp(INPUT_SVG)
      .resize(32, 32)
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));

    console.log('✓ Gerado: favicon.png (renomeie para .ico se necessario)');
  } catch (error) {
    console.error('✗ Erro ao gerar favicon:', error.message);
  }

  // Gerar apple-touch-icon (180x180)
  const appleTouchPath = path.join(__dirname, '../public/apple-touch-icon.png');
  try {
    await sharp(INPUT_SVG)
      .resize(180, 180)
      .png()
      .toFile(appleTouchPath);

    console.log('✓ Gerado: apple-touch-icon.png');
  } catch (error) {
    console.error('✗ Erro ao gerar apple-touch-icon:', error.message);
  }

  console.log('\nIcones gerados com sucesso!');
  console.log('Diretorio:', OUTPUT_DIR);
}

generateIcons().catch(console.error);
