import StaticPage from "@/components/StaticPage/StaticPage";

export const metadata = {
  title: "Termos de Uso | Decor Arte Aromas",
  description: "Regras para uso do site, navegação e interação com os conteúdos.",
};

export default function TermosDeUsoPage() {
  return (
    <StaticPage
      eyebrow="Institucional"
      title="Termos de uso"
      description="Ao acessar o site, você concorda com os termos abaixo, criados para deixar claro como o conteúdo e os serviços devem ser utilizados."
      sections={[
        {
          title: "Condições de uso",
          items: [
            "O conteúdo do site é destinado ao uso pessoal e informativo.",
            "Não é permitido copiar, distribuir ou reutilizar conteúdos sem autorização.",
            "As informações de produtos, preços e disponibilidade podem ser atualizadas a qualquer momento.",
          ],
        },
        {
          title: "Responsabilidades",
          items: [
            "O cliente é responsável por fornecer informações corretas ao entrar em contato ou realizar pedidos.",
            "A Decor Arte Aromas pode suspender acessos em caso de uso indevido, fraude ou tentativa de dano ao sistema.",
          ],
        },
        {
          title: "Atualizações",
          paragraphs: [
            "Estes termos podem ser ajustados sempre que necessário para refletir mudanças no site ou no processo de atendimento.",
          ],
        },
      ]}
    />
  );
}
