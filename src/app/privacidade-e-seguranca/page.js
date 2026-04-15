import StaticPage from "@/components/StaticPage/StaticPage";

export const metadata = {
  title: "Privacidade e Segurança | Decor Arte Aromas",
  description: "Como tratamos dados pessoais e protegemos as informações do site.",
};

export default function PrivacidadeESegurancaPage() {
  return (
    <StaticPage
      eyebrow="Institucional"
      title="Privacidade e segurança"
      description="Aqui explicamos como lidamos com dados, navegação e proteção das informações compartilhadas com a Decor Arte Aromas."
      sections={[
        {
          title: "Dados coletados",
          paragraphs: [
            "Podemos tratar dados informados voluntariamente em formulários, mensagens e interações com o site.",
            "Também podemos registrar dados técnicos básicos de navegação para melhorar desempenho e experiência.",
          ],
        },
        {
          title: "Uso das informações",
          paragraphs: [
            "As informações são usadas para responder contatos, processar pedidos, melhorar conteúdo e manter a operação do site.",
          ],
        },
        {
          title: "Proteção",
          paragraphs: [
            "Adotamos medidas razoáveis de proteção para reduzir risco de acesso indevido, alteração ou perda de informações.",
            "Nenhum sistema é totalmente imune, mas trabalhamos para manter os dados organizados e o acesso restrito.",
          ],
        },
      ]}
    />
  );
}
