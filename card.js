function generateCard(product) {
    return `
    <div class="card">
      <h2>${product.name}</h2>
      <p><strong>ID:</strong> ${product.id}</p>
      <p><strong>Prix:</strong> $${product.price}</p>
    </div>
  `;
}

module.exports = generateCard;