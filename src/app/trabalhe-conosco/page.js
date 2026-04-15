import StaticPage from "@/components/StaticPage/StaticPage";

const instagramUrl = "https://www.instagram.com/decor.artearomas";

export const metadata = {
  title: "Trabalhe Conosco | Decor Arte Aromas",
  description: "Entre em contato com a Decor Arte Aromas pelo Instagram para parcerias e oportunidades.",
};

export default function TrabalheConoscoPage() {
  return (
    <StaticPage
      eyebrow="Institucional"
      title="Trabalhe conosco"
      description="Se você quer apresentar parceria, portfólio ou proposta de colaboração, fale com a gente pelo Instagram."
      action={{
        label: "Abrir Instagram",
        href: instagramUrl,
        external: true,
      }}
      sections={[
        {
          title: "Como enviar sua proposta",
          items: [
            "Envie uma mensagem direta pelo Instagram com uma apresentação curta.",
            "Inclua seu nome, cidade, área de atuação e o tipo de parceria que procura.",
            "Se tiver portfólio, anexe o link ou os destaques do seu trabalho.",
          ],
        },
        {
          title: "Canal oficial",
          paragraphs: [
            "O canal principal para esse contato é o Instagram já usado no site.",
          ],
          items: [
            "Perfil: @decor.artearomas",
          ],
        },
        {
          title: "Acesso rápido",
          paragraphs: [
            "Se preferir, use o botão acima para abrir diretamente o perfil oficial.",
          ],
        },
      ]}
    />
  );
}
