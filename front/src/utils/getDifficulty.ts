const getDifficultyText = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
        return "Très facile";
      case 2:
        return "Facile";
      case 3:
        return "Intermédiaire";
      case 4:
        return "Confirmé";
      case 5:
        return "Difficile";
      default:
        return "Inconnue";
    }
};

export default getDifficultyText;