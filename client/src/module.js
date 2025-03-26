// Fonction pour chiffrer un entier et le concaténer avec une lettre au hasard
function chiffrement(entier) {
    // Génération d'une lettre au hasard entre 'a' et 'z'
    const lettreAuHasard = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    // Multiplication par 197823456
    const chiffreChiffre = entier * 197823456;
    return chiffreChiffre.toString() + lettreAuHasard;
}

// Fonction pour déchiffrer le résultat
function dechiffrement(chiffre) {
    // Extraction de la partie chiffrée (en supprimant la lettre)
    const chiffreChiffre = chiffre.slice(0, -1);
    // Conversion en nombre et division par 197823456 pour récupérer l'entier d'origine
    const entier = parseInt(chiffreChiffre) / 197823456;
    return entier;

}

module.exports = {
    chiffrement,
    dechiffrement,
};
