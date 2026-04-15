import StaticPage from "@/components/StaticPage/StaticPage";

export const metadata = {
  title: "Regulamentos | Decor Arte Aromas",
  description: "Regras gerais de uso, atendimento, produção e comunicação.",
};

export default function RegulamentosPage() {
  return (
    <StaticPage
      eyebrow="Institucional"
      title="Regulamentos"
      description="Regras básicas que ajudam a organizar pedidos, atendimento e relacionamento com a loja."
      sections={[
        {
          title: "Pedidos e atendimento",
          items: [
            "Pedidos ficam sujeitos à confirmação e disponibilidade de produção.",
            "Prazos podem variar conforme volume de demanda e personalizações solicitadas.",
            "Mensagens e solicitações devem ser feitas pelos canais oficiais do site ou Instagram.",
          ],
        },
        {
          title: "Uso correto",
          items: [
            "Não publique dados falsos, ofensivos ou que violem direitos de terceiros.",
            "Não tente interferir na operação do site, painel ou banco de dados.",
          ],
        },
        {
          title: "Convivência",
          paragraphs: [
            "Buscamos um atendimento respeitoso e claro em todas as etapas. Estes regulamentos existem para manter essa organização.",
          ],
        },
      ]}
    />
  );
}
