// @ts-check
import { test, expect } from '@playwright/test';
import { obterCodigo2FA } from '../suppport/db';

import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';

import { cleanJobs, getJob } from '../suppport/redis';

test('Nao deve logar quando o código de autenticação é inválido', async ({ page }) => {
  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await page.goto('http://paybank-mf-auth:3000/');

  await page.getByRole('textbox', { name: 'Digite seu CPF' }).fill(usuario.cpf);
  await page.getByRole('button', { name: 'Continuar' }).click();

  for (const digito of usuario.senha) {
    await page.getByRole('button', { name: digito }).click();
  }
  await page.getByRole('button', { name: 'Continuar' }).click();

  await page.getByRole('textbox', { name: '000000' }).fill('123456');
  await page.getByRole('button', { name: 'Verificar' }).click();

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.')
});

// Teste usando Page Object model
test('Deve acessar a conta do usuario', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await cleanJobs()

  await loginPage.acessaPagina()
  await loginPage.informaCPF(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  // checkpoint
  await page.getByRole('heading', {name: 'Verificação em duas etapas'}).waitFor({timeout: 3000})
  
  const codigo = await getJob() // busca via Redis

  //const codigo = await obterCodigo2FA(usuario.cpf) // busca via BD
  await loginPage.informe2FA(codigo)

  await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
});

