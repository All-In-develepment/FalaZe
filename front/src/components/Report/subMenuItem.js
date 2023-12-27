// ReportSubMenu.jsx
import React, { useState } from "react";
import Tag from "./tag";

export const ReportSubMenu = ({ onCloseSubMenu, onSelectOption }) => {
  const [currentPage, setCurrentPage] = useState(null);

  console.log("oi");

  const handleSelectOption = (option) => {
    switch (option) {
      case "Tageamentos":
        setCurrentPage(<Tag />);
        break;
      default:
        break;
    }
  };
  return (
    <div>
      <button onClick={() => handleSelectOption("Tageamentos")}>
        Atendimentos
      </button>
      <button onClick={() => handleSelectOption("Atendentes")}>
        Atendentes
      </button>
      <button onClick={() => handleSelectOption("Tags")}>Tags</button>
      <button onClick={onCloseSubMenu}>Fechar</button>

      {/* Renderizar a página selecionada */}
      {/* {currentPage}  */}
      <Tag />
    </div>
  );
};
