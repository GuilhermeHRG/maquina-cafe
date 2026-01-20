export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <div className="row space" style={{ marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Gestão da Máquina de Café</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Limpeza + reabastecimento e controle de estoque
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
