import JSZip from 'jszip';

export async function downloadProjectZip() {
  const zip = new JSZip();

  // Helper to fetch file content if available or use fallback
  const addFile = async (path: string, url: string, fallbackContent: string) => {
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        const text = await resp.text();
        zip.file(path, text);
        return;
      }
    } catch {
      // Fallback
    }
    zip.file(path, fallbackContent);
  };

  // README with simple run instructions
  const readmeContent = `# Aventura Matemática do Herói (Pietro e Amigos)

Aplicativo educativo e gamificado de matemática infantil com adição, subtração, multiplicação e divisão, níveis graduais, pontuação e ranking para crianças.

## Como Executar no seu Computador:

1. Certifique-se de ter o **Node.js** instalado (versão 18 ou superior):
   https://nodejs.org

2. Abra o terminal na pasta deste projeto e instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`

3. Inicie o servidor de desenvolvimento:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Abra no seu navegador o endereço indicado (geralmente http://localhost:3000 ou http://localhost:5173).

Divirta-se aprendendo matemática! 🚀
`;
  zip.file('README.md', readmeContent);

  // Read current known files through fetch or raw content
  const filesToInclude = [
    { path: 'package.json', url: '/package.json' },
    { path: 'index.html', url: '/index.html' },
    { path: 'tsconfig.json', url: '/tsconfig.json' },
    { path: 'vite.config.ts', url: '/vite.config.ts' },
    { path: 'src/main.tsx', url: '/src/main.tsx' },
    { path: 'src/index.css', url: '/src/index.css' },
    { path: 'src/App.tsx', url: '/src/App.tsx' },
    { path: 'src/types/math.ts', url: '/src/types/math.ts' },
    { path: 'src/utils/audio.ts', url: '/src/utils/audio.ts' },
    { path: 'src/utils/mathGenerator.ts', url: '/src/utils/mathGenerator.ts' },
    { path: 'src/utils/storage.ts', url: '/src/utils/storage.ts' },
    { path: 'src/components/Header.tsx', url: '/src/components/Header.tsx' },
    { path: 'src/components/MenuScreen.tsx', url: '/src/components/MenuScreen.tsx' },
    { path: 'src/components/GameScreen.tsx', url: '/src/components/GameScreen.tsx' },
    { path: 'src/components/GameOverScreen.tsx', url: '/src/components/GameOverScreen.tsx' },
    { path: 'src/components/VisualManipulative.tsx', url: '/src/components/VisualManipulative.tsx' },
    { path: 'src/components/RankingModal.tsx', url: '/src/components/RankingModal.tsx' },
    { path: 'src/components/AchievementsModal.tsx', url: '/src/components/AchievementsModal.tsx' },
    { path: 'src/components/ParentReportModal.tsx', url: '/src/components/ParentReportModal.tsx' },
    { path: 'src/components/HeroSelectorModal.tsx', url: '/src/components/HeroSelectorModal.tsx' },
    { path: 'public/manifest.json', url: '/manifest.json' },
  ];

  await Promise.all(
    filesToInclude.map((f) => addFile(f.path, f.url, `// ${f.path}`))
  );

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'aventura-matematica-pietro.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
}
